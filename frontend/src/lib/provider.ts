import { providers } from "ethers";
import { getProviderUrl } from "./cache/provider";
const { JsonRpcProvider, getDefaultProvider } = providers;

/// Gets the provider URL provided by user, otherwise uses ethers default provider.
const getProvider = () => {
    const url = getProviderUrl();
    if (url) {
        return new JsonRpcProvider(url);
    } else {
        return getDefaultProvider();
    }
}

export { getProvider };
