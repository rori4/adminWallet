import { Contract } from "ethers";

// lib
import { getItem, setItem } from "./cache";
import { getContractAbi } from "../etherscan";
import { getProvider } from "../provider";

type ContractArtifact = {
    address: string,
    abi: any[],
};

export type ContractResponse = {
    name: string,
    contract: Contract,
}

const buildContractArtifact = async (contractAddress: string): Promise<ContractArtifact> => {
    let abi = await getContractAbi(contractAddress);
    return {
        address: contractAddress,
        abi,
    };
}

export const getContracts = async (): Promise<ContractResponse[]> => {
    const artifacts: ContractArtifact[] = getItem("contracts");
    if (artifacts) {
        let out: ContractResponse[] = [];
        for (const artifact of artifacts) {
            const contract = (new Contract(artifact.address, artifact.abi)).connect(getProvider());
            let name: string;
            try {
                name = await contract.name();
            } catch {
                name = "";
            }
            out.push({
                name,
                contract,
            });
        }
        return out;
    } else {
        return [];
    }
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
