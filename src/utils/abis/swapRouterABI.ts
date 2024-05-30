export interface SwapRouterParams {
    tokenIn: `0x${string}`,
    tokenOut: `0x${string}`,
    fee: number,
    recipient: `0x${string}`,
    amountIn: bigint,
    amountOutMinimum: bigint,
    sqrtPriceLimitX96: bigint
}

export const swapRouterABI = [
    {
        inputs: [
            {
                components: [
                    { name: "tokenIn", type: "address" }, 
                    { name: "tokenOut", type: "address" }, 
                    { name: "fee", type: "uint24" }, 
                    { name: "recipient", type: "address" }, 
                    { name: "amountIn", type: "uint256" }, 
                    { name: "amountOutMinimum", type: "uint256" },
                    { name: "sqrtPriceLimitX96", type: "uint160" },

                ], 
                name: "params", 
                type: "tuple"
            }
    
    ],
        name: 'exactInputSingle',
        outputs: [{ name: "amountOut", type: "uint256" },],
        stateMutability: 'payable',
        type: 'function',
    },
] as const; 
