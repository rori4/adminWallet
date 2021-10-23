import { BigNumber, Wallet } from "ethers";
import { FlashbotsBundleProvider, FlashbotsBundleResolution, FlashbotsBundleTransaction,  } from "@flashbots/ethers-provider-bundle";

// lib
import { QueuedTx } from "../components/TxQueue";
import { getProvider } from "./provider";
import { updateGasPrices } from "./ethereum";

const getFlashbotsProvider = async (signer: Wallet) => {
    return await FlashbotsBundleProvider.create(getProvider(), signer);
}

/// Returns simulation gas price if simulation succeeds.
/// thanks to Scott Bigelow & Kendrick Tan for [this](https://github.com/flashbots/searcher-sponsored-tx/blob/main/src/utils.ts)
export const checkSimulation = async(
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
  
      const gasPrice = simulationResponse.coinbaseDiff.div(gasUsed);
      return gasPrice;
    }
  
    console.error(
      `Simulation failed, error code: ${simulationResponse.error.code}`
    );
    console.error(simulationResponse.error.message);
    throw new Error("Failed to simulate response");
}

/// Sets latest gas price for each tx and returns unsigned bundle.
const buildFlashbotsBundle = async (queuedTxs: QueuedTx[], gasPriceOverride?: BigNumber): Promise<FlashbotsBundleTransaction[]> => {
    const updatedTxs = await updateGasPrices(queuedTxs, gasPriceOverride);
    return ([
        ...updatedTxs.map(tx => ({
            transaction: tx.tx,
            signer: tx.wallet.wallet,
        })),
    ]);
}

/// Returns signed bundle.
export const signFlashbotsBundle = async (bundleTransactions: FlashbotsBundleTransaction[], sponsorWallet: Wallet): Promise<string[]> => {
    const flashbotsProvider = await getFlashbotsProvider(sponsorWallet);
    return await flashbotsProvider.signBundle(bundleTransactions);
}

/// Sends bundle to flashbots in a block-monitoring loop
export const sendFlashbotsBundle = async (queuedTxs: QueuedTx[], sponsorWallet: Wallet) => {
    const provider = getProvider();
    const flashbotsProvider = await getFlashbotsProvider(sponsorWallet);
    provider.on('block', async (blockNumber) => {
        console.log(`[BLOCK ${blockNumber}]`);
        const bundleTransactions = await buildFlashbotsBundle(queuedTxs);
        
        // simulate on every block
        const signedBundle = await signFlashbotsBundle(bundleTransactions, sponsorWallet);
        try {
            const simulationGasPrice = await checkSimulation(flashbotsProvider, signedBundle);
            console.log(`SIM PASSED. Gas price: ${simulationGasPrice}`);
        } catch (e) {
            console.error("SIM FAILED", e);
        }
        // test; probably need to remove this
        provider.removeAllListeners();
        
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
    // thanks Scott for inspiration from [searcher-sponsored-tx](https://github.com/flashbots/searcher-sponsored-tx/blob/main/src/index.ts)
}
