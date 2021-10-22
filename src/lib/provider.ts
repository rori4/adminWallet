import { providers } from "ethers";
import { getProviderUrl } from "./cache/provider";
const { JsonRpcProvider } = providers;

const getProvider = () => {
    const url = getProviderUrl();
    if (url) {
        return new JsonRpcProvider(url);
    } else {
        return providers.getDefaultProvider();
    }
}

export { getProvider };
