import { Contract, Wallet } from "ethers";
import { getContractAbi } from "./etherscan";
const cache = window.localStorage;

const setItem = (key: string, value: any) => {
    const jsonVal = JSON.stringify(value);
    cache.setItem(key, jsonVal);
}

const getItem = (key: string): any => {
    const item = cache.getItem(key);
    if (item) {
        return JSON.parse(item);
    } else {
        return undefined;
    }
}

export const flush = () => {
    cache.clear();
}

type ContractArtifact = {
    address: string,
    abi: any[],
};

type WalletArtifact = {
    name: string,
    privateKey: string,
}

export type WalletResponse = {
    name: string,
    wallet: Wallet,
}

const buildContractArtifact = async (contractAddress: string): Promise<ContractArtifact> => {
    let abi = await getContractAbi(contractAddress);
    return {
        address: contractAddress,
        abi,
    };
}

export const addContract = async (contractAddress: string) => {
    const contractArtifacts: ContractArtifact[] = getItem("contracts");
    if (contractArtifacts) {
        // if this contractAddress hasn't been stored yet
        if (!contractArtifacts.map(artifact => artifact.address).includes(contractAddress)) {
            let artifact = await buildContractArtifact(contractAddress);
            contractArtifacts.push(artifact);
            setItem("contracts", contractArtifacts);
        }
    } else {
        const artifact = await buildContractArtifact(contractAddress);
        setItem("contracts", [artifact]);
    }
    return getContracts();
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

export const getContracts = (): Contract[] => {
    const artifacts: ContractArtifact[] = getItem("contracts");
    if (artifacts) {
        return artifacts.map(artifact => (
            new Contract(artifact.address, artifact.abi)
        ));
    } else {
        return [];
    }
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
