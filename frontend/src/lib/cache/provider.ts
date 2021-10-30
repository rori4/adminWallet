// lib
import { getItem, setItem } from "./cache";

export const getProviderUrl = () => {
    return getItem("provider_url");
}

export const setProviderUrl = (providerUrl: string) => {
    return setItem("provider_url", providerUrl);
}
