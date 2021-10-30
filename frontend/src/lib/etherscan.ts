import axios from "axios";

export const getContractAbi = async (contractAddress: string) => {
    const {result} = (await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`)).data;
    return JSON.parse(result);
}
