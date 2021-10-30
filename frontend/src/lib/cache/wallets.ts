import { Wallet } from "ethers";

// lib
import { getItem, setItem } from "./cache";

type WalletArtifact = {
    name: string,
    privateKey: string,
}

export type WalletResponse = {
    name: string,
    wallet: Wallet,
}

export const getWallets = (): WalletResponse[] => {
    const artifacts: WalletArtifact[] = getItem("wallets");
    if (artifacts) {
        return artifacts.map(artifact => ({
            name: artifact.name,
            wallet: new Wallet(artifact.privateKey),
        }))
    } else {
        return [];
    }
}

export const addWallet = async (privateKey: string, nickname?: string) => {
    const walletArtifacts: WalletArtifact[] = getItem("wallets");
    const artifact: WalletArtifact = {
        name: nickname || "",
        privateKey,
    };
    // make sure private key is valid
    try {
        new Wallet(privateKey);
    } catch (e) {
        console.error("invalid private key", e);
        return getWallets();
    }
    if (walletArtifacts) {
        // if this privateKey hasn't been stored yet
        if (!walletArtifacts.map(artifact => artifact.privateKey).includes(privateKey)) {
            walletArtifacts.push(artifact);
            setItem("wallets", walletArtifacts);
        } 
    } else {
        setItem("wallets", [artifact]);
    }
    return getWallets();
}