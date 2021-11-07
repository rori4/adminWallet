import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { BigNumber, providers, utils } from "ethers";
const { JsonRpcProvider, getDefaultProvider } = providers;

import { IQueuedTx } from "./interfaces";
export type EthProvider = providers.BaseProvider | providers.JsonRpcProvider;

export const getProvider = (): EthProvider => {
    const url = process.env.PROVIDER_URL;
    if (url) {
        return new JsonRpcProvider(url);
    } else {
        return getDefaultProvider();
    }
}

/// Gets latest gas price from provider.
const getLatestGasPrice = async (provider: EthProvider, flashbotsProvider?: FlashbotsBundleProvider, blocksInFuture?: number) => {
    let gasPrice: BigNumber;
    // get base fee for this block
    const currentBlock = await provider.getBlock(await provider.getBlockNumber());
    const baseFee = currentBlock.baseFeePerGas;
    const priorityFee = BigNumber.from(1e9).mul(13); // 13 gwei // TODO: dynamically adjust priority fee

    if (flashbotsProvider) {
        // add EIP-1559 priority fee to base fee since we're just setting gasPrice
        const futureBaseFee = await FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(baseFee, blocksInFuture);
        gasPrice = futureBaseFee.add(priorityFee);
    } else {
        gasPrice = baseFee.add(priorityFee);
    }

    console.log("bundle gas price:", `${utils.formatUnits(gasPrice, "gwei")} gwei`);

    return gasPrice;
}

/// Gets latest gas price and returns transactions with updated gas prices.
/// Gas price override will always take precedence if provided.
export const updateGasPrices = async (queuedTxs: IQueuedTx[], provider: EthProvider, gasPriceOverride?: BigNumber, flashbotsProvider?: FlashbotsBundleProvider) => {
    const gasPrice = gasPriceOverride ?? await getLatestGasPrice(provider, flashbotsProvider, 1);
    console.log("gasPrice", gasPrice.div(1e9).toString(), "gwei");
    return queuedTxs.map(qtx => (
        {
            ...qtx,
            tx: {
                ...qtx.tx,
                gasPrice,
            }
        }
    ));
}
