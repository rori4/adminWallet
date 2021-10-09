import { Contract } from "ethers";
import { getContractAbi } from "./etherscan";
import { getContract } from "./contract";
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

const buildArtifact = async (contractAddress: string): Promise<ContractArtifact> => {
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
            let artifact = await buildArtifact(contractAddress);
            contractArtifacts.push(artifact);
            setItem("contracts", contractArtifacts);
        }
    } else {
        const artifact = await buildArtifact(contractAddress);
        setItem("contracts", [artifact]);
    }
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
