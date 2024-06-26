import { walletClient } from '../viem/client.js'
import { BiconomySmartAccountV2, PaymasterMode, createSmartAccountClient } from '@biconomy/account'
import dotenv from 'dotenv'
import { config } from '../wagmi/config.js';
import { simulateContract } from '@wagmi/core';
import { QUOTER, SWAP_ROUTER, USDC, WETH, suPrzUSDC } from '../constants/addresses.js';
import { quoterABI } from '../abis/quoterABI.js';
import { SwapRouterParams } from '../abis/swapRouterABI.js';
import { allowanceUSD, allowanceWETH } from '../reward/allowance.js';
import { approveLifeTimeReward, approveLifeTimeSwim } from '../reward/approve.js';
import { swap } from '../reward/swap.js';
import { deposit } from '../reward/deposit.js';

dotenv.config();

let smartAccount: BiconomySmartAccountV2 | undefined = undefined
let smartAccountAddress: `0x${string}` | undefined = undefined
let amountUSDC: bigint = BigInt(0)

export const createSmartAccount = async () => {
    try {
        if (!walletClient) return;

        const smartAccountFromCreate = await createSmartAccountClient({
            signer: walletClient,
            bundlerUrl: process.env.BICONOMY_BUNDLER_URL as string, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
            biconomyPaymasterApiKey: process.env.BICONOMY_PAYMASTER_API_KEY as string, // <-- Read about at https://docs.biconomy.io/dashboard/paymaster
        });
    
        const address = await smartAccountFromCreate.getAccountAddress();
        smartAccountAddress = (address);
        console.log('smart account wallet:', smartAccountAddress)
        smartAccount = (smartAccountFromCreate);
    } catch (error) {
        console.log(error)
    }
};
const swapRewardPoolDeposit = async(reward: bigint, pooler: `0x${string}`) => {
    //simulate quoter from uniswap
    const quoterParams = {
        tokenIn: (WETH),
        tokenOut: (USDC),
        amountIn: (reward),
        fee: (500),
        sqrtPriceLimitX96: BigInt(0),
    }
    const qoute = await simulateContract(config, {
        abi: quoterABI,
        address: QUOTER,
        functionName: 'quoteExactInputSingle',
        args: [(quoterParams)],
        account: smartAccountAddress
    })
    amountUSDC = (qoute.result * BigInt(995))/BigInt(1000)
    const swapRouterParams: SwapRouterParams = {
        tokenIn: WETH,
        tokenOut: USDC,
        fee: 500,
        recipient: smartAccountAddress!,
        amountIn: reward,
        amountOutMinimum: amountUSDC,
        sqrtPriceLimitX96: BigInt(0)
    }
    let tx = []
    const wethForSwapAllowance = await allowanceWETH(smartAccountAddress!, SWAP_ROUTER)      
    const usdcForDepositAllowance = await allowanceUSD(smartAccountAddress!, suPrzUSDC)    
    if (reward > wethForSwapAllowance || wethForSwapAllowance == BigInt(0)) {
    const lifetimeRewardTx = approveLifeTimeReward(SWAP_ROUTER)
    tx.push(lifetimeRewardTx)
    } 
    if (amountUSDC > usdcForDepositAllowance || usdcForDepositAllowance == BigInt(0)) {
        const lifetimeSwimTx = approveLifeTimeSwim(suPrzUSDC)
        tx.push(lifetimeSwimTx)
    }
    const swapTx = swap(swapRouterParams)
    tx.push(swapTx)
    const depositPrzTx = deposit(amountUSDC, pooler!)
    tx.push(depositPrzTx)

    // Send the transaction and get the transaction hash
    const userOpResponse = await smartAccount!.sendTransaction(tx, {
        paymasterServiceData: {mode: PaymasterMode.SPONSORED},
    });
    const { transactionHash } = await userOpResponse.waitForTxHash();
    console.log("Transaction Hash", transactionHash);
    
    const userOpReceipt  = await userOpResponse?.wait();
    if(userOpReceipt?.success == 'true') { 
        console.log("UserOp receipt", userOpReceipt)
        console.log("Transaction receipt", userOpReceipt?.receipt)
    }
    return transactionHash
}
export const smartUserOP = async(reward: bigint, pooler: `0x${string}`) => {

    try {
        if (reward <= BigInt(0)) return;
            
        await createSmartAccount()

        const txnHash = await swapRewardPoolDeposit(reward, pooler)
        return { txnHash , amountUSDC }
            
    } catch (error) {
        console.log(error)
    }
}
