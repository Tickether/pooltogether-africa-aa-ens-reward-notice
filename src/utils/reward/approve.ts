import { encodeFunctionData, erc20Abi } from 'viem'
import { USDC, WETH } from '../constants/addresses.js';



export const approveLifeTimeSwim = (spender: `0x${string}`) => {
    const approveData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [(spender), (BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935'))]
    })

    // Build the transactions
    const approveTx = {
        to: USDC,
        data: approveData,
    };
    return approveTx
}

export const approveLifeTimeReward = (spender: `0x${string}`) => {
    const approveData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [(spender), (BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935'))]
    })

    // Build the transactions
    const approveTx = {
        to: WETH,
        data: approveData,
    };
    return approveTx
}