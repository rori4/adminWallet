import {
	BigNumber,
	Wallet,
	providers
} from "ethers";
import {
	FlashbotsBundleProvider,
	FlashbotsBundleResolution,
	FlashbotsBundleTransaction,
} from "@flashbots/ethers-provider-bundle";

import {
	getProvider,
	updateGasPrices
} from "./ethereum";
import {
	IQueuedTx
} from "./interfaces";

export const getFlashbotsProvider = async (signer: Wallet) => {
	const standardProvider = getProvider();
	await standardProvider.ready;
	return await FlashbotsBundleProvider.create(standardProvider, signer.connect(standardProvider));
}

/// Simulates bundle, returns gas price (miner_bribe / gas_used) if simulation succeeds.
/// thanks to Scott Bigelow & Kendrick Tan for [this](https://github.com/flashbots/searcher-sponsored-tx/blob/main/src/utils.ts)
export const checkSimulation = async (
	flashbotsProvider: FlashbotsBundleProvider,
	signedBundle: string[],
) => {
	const simulationResponse = await flashbotsProvider.simulate(
		signedBundle,
		"latest"
	);

	if ("results" in simulationResponse) {
		for (let i = 0; i < simulationResponse.results.length; i++) {
			const txSimulation = simulationResponse.results[i];
			if ("error" in txSimulation) {
				throw new Error(
					`TX #${i} : ${txSimulation.error} ${txSimulation.revert}`
				);
			}
		}

		if (simulationResponse.coinbaseDiff.eq(0)) {
			throw new Error("Does not pay coinbase");
		}

		const gasUsed = simulationResponse.results.reduce(
			(acc, txSimulation) => acc + txSimulation.gasUsed,
			0
		);

		return simulationResponse.coinbaseDiff.div(gasUsed);
	}

	console.error(
		`Simulation failed, error code: ${simulationResponse.error.code}`
	);
	console.error(simulationResponse.error.message);
	throw new Error("Failed to simulate response");
}

/// Sets latest gas price for each tx and returns unsigned bundle.
const buildFlashbotsBundle = async (queuedTxs: IQueuedTx[], flashbotsProvider: FlashbotsBundleProvider, gasPriceOverride ? : BigNumber): Promise < FlashbotsBundleTransaction[] > => {
	const provider = getProvider();
	const updatedTxs = await updateGasPrices(queuedTxs, provider, gasPriceOverride, flashbotsProvider);
	return ([
		...updatedTxs.map(tx => ({
			transaction: tx.tx,
			signer: new Wallet(tx.walletKey),
		})),
	]);
}

/// Sends bundle to flashbots in a block-monitoring loop
/// TODO: maintain a list of active loops that the client can query
export const sendFlashbotsBundle = async (queuedTxs: IQueuedTx[], sponsorWallet: Wallet) => {
	const provider = getProvider();
	const flashbotsProvider = await getFlashbotsProvider(sponsorWallet);
	await provider.on('block', async (blockNumber) => {
		console.log(`[BLOCK ${blockNumber}]`);
		const bundleTransactions = await buildFlashbotsBundle(queuedTxs, flashbotsProvider);

		// simulate on every block
		const signedBundle = await flashbotsProvider.signBundle(bundleTransactions);
		try {
			const simulationGasPrice = await checkSimulation(flashbotsProvider, signedBundle);
			console.log(`SIM PASSED. Gas price: ${simulationGasPrice.div(1e9)} gwei`);

			// TODO: figure out how to stay in listener while sim passes and return only when successfully mined or sim fails
			// test; need to remove this eventually
			provider.removeAllListeners();
			// return simulationGasPrice;
		} catch (e) {
			console.error("SIM FAILED", e);
			provider.removeAllListeners();
			// return e;
		}


		// DANGER! ONLY UNCOMMENT THIS WHEN EVERYTHING ELSE HAS BEEN TESTED.
		// send bundle to flashbots
		// const targetBlockNum = blockNumber + 1;
		// const bundleResponse = await flashbotsProvider.sendBundle(bundleTransactions, targetBlockNum);
		// if ('error' in bundleResponse) {
		//     throw new Error(bundleResponse.error.message);
		// }
		// const bundleResolution = await bundleResponse.wait();
		// if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
		//     console.log(`Congrats, included in ${targetBlockNum}`)
		//     provider.removeAllListeners();
		// } else if (bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
		//     console.log(`Not included in ${targetBlockNum}`);
		// } else if (bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh) {
		//     console.log("Nonce too high, bailing")
		//     provider.removeAllListeners();
		// }
	});
	return "received";
	// thanks Scott for inspiration from [searcher-sponsored-tx](https://github.com/flashbots/searcher-sponsored-tx/blob/main/src/index.ts)
}