import { providers } from "ethers";
import { getProviderUrl } from "./cache/provider";
import { EthProvider } from "./ethereum";
const { JsonRpcProvider, getDefaultProvider } = providers;

/**
 * Gets the provider URL provided by user, otherwise uses ethers default provider.
 */
const getProvider = (): EthProvider => {
    const url = getProviderUrl();
    if (url) {
        return new JsonRpcProvider(url);
    } else {
        return getDefaultProvider();
    }
}

export { getProvider };
