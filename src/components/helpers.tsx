import { ContractResponse } from "../lib/cache/contracts";

export const getContractName = (contractAddress: string, contracts: ContractResponse[])  => (
    contracts.find(contract => contract.contract.address === contractAddress)?.name || ""
);
