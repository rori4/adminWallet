import { Contract } from "ethers";

import { getContractAbi } from "./etherscan";

export const getContract = async (contractAddress: string): Promise<Contract> =>  {
    const abi = await getContractAbi(contractAddress);
    return new Contract(contractAddress, abi);
}
