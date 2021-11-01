import { providers, BigNumber } from "ethers";
const { JsonRpcProvider, getDefaultProvider } = providers;

import { IQueuedTx } from "./interfaces";

export const getProvider = () => {
    const url = process.env.PROVIDER_URL;
    if (url) {
        return new JsonRpcProvider(url);
    } else {
        return getDefaultProvider();
    }
}

/// Gets latest gas price from provider.
const getLatestGasPrice = async () => {
    const provider = getProvider();
    const extra_gas = BigNumber.from(1e9).mul(30); // add 30 gwei to gas price
    return (await provider.getBlock(provider.getBlockNumber())).baseFeePerGas?.add(extra_gas);
}

/// Gets latest gas price and returns transactions with updated gas prices.
export const updateGasPrices = async (queuedTxs: IQueuedTx[], gasPriceOverride?: BigNumber) => {
    const gasPrice = gasPriceOverride ?? await getLatestGasPrice();
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
