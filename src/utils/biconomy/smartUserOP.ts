import { walletClient } from '../viem/client.js'
import { BiconomySmartAccountV2, PaymasterMode, createSmartAccountClient } from '@biconomy/account'
import dotenv from 'dotenv'
import { config } from '../wagmi/config.js';
import { simulateContract } from '@wagmi/core';
import { QUOTER, SWAP_ROUTER, USDC, WETH, przUSDC } from '../constants/addresses.js';
import { quoterABI } from '../abis/quoterABI.js';
import { SwapRouterParams } from '../abis/swapRouterABI.js';
import { allowanceUSD, allowanceWETH } from '../reward/allowance.js';
import { approveLifeTimeReward, approveLifeTimeSwim } from '../reward/approve.js';
import { swap } from '../reward/swap.js';
import { deposit } from '../reward/deposit.js';
import { transfer } from '../reward/transfer.js';

dotenv.config();

let smartAccount: BiconomySmartAccountV2 | undefined = undefined
let smartAccountAddress: `0x${string}` | undefined = undefined

export const createSmartAccount = async () => {
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
};

export const smartUserOP = async(reward: bigint, pooler: `0x${string}`) => {

    let txnHash

    await createSmartAccount()

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
    const amountUSDC = qoute.result
    const swapRouterParams: SwapRouterParams = {
        tokenIn: WETH,
        tokenOut: USDC,
        fee: 500,
        recipient: smartAccountAddress!,
        amountIn: reward,
        amountOutMinimum: qoute.result,
        sqrtPriceLimitX96: BigInt(0)
    }
    const swapRewardPoolDeposit = async() => {
        let tx = []
        const wethForSwapAllowance = await allowanceWETH(smartAccountAddress!, SWAP_ROUTER)      
        const usdcForDepositAllowance = await allowanceUSD(smartAccountAddress!, przUSDC)    
        if (reward < wethForSwapAllowance || wethForSwapAllowance == BigInt(0)) {
           const lifetimeRewardTx = approveLifeTimeReward(SWAP_ROUTER)
           tx.push(lifetimeRewardTx)
        } 
        if (qoute.result < usdcForDepositAllowance || usdcForDepositAllowance == BigInt(0)) {
            const lifetimeSwimTx = approveLifeTimeSwim(przUSDC)
            tx.push(lifetimeSwimTx)
        }
        const swapTx = swap(swapRouterParams)
        tx.push(swapTx)
        const depositPrzTx = deposit(qoute.result, smartAccountAddress!)
        tx.push(depositPrzTx)
        const transferTx = transfer(pooler, qoute.result)
        tx.push(transferTx)

        // Send the transaction and get the transaction hash
        const userOpResponse = await smartAccount!.sendTransaction(tx, {
            paymasterServiceData: {mode: PaymasterMode.SPONSORED},
        });
        const { transactionHash } = await userOpResponse.waitForTxHash();
        console.log("Transaction Hash", transactionHash);
        txnHash = transactionHash
        const userOpReceipt  = await userOpResponse?.wait();
        if(userOpReceipt?.success == 'true') { 
            console.log("UserOp receipt", userOpReceipt)
            console.log("Transaction receipt", userOpReceipt?.receipt)
        }return transactionHash
    }
    await swapRewardPoolDeposit()
    return { txnHash, amountUSDC }
}
