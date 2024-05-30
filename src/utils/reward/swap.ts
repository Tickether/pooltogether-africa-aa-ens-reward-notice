import { encodeFunctionData } from 'viem';
import { SwapRouterParams, swapRouterABI } from '../abis/swapRouterABI.js';
import { SWAP_ROUTER } from '../constants/addresses.js';



export const swap = (swapRouterParams: SwapRouterParams) => {
    const swapData = encodeFunctionData({
        abi: swapRouterABI,
        functionName: 'exactInputSingle',
        args: [(swapRouterParams)]
    })

    // Build the transactions
    const swapTx = {
        to: SWAP_ROUTER,
        data: swapData,
    };
    
    return swapTx
}