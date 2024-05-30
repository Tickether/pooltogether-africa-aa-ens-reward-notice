export const quoterABI = [
    {
        inputs: [
            {
                components: [
                    { name: "tokenIn", type: "address" }, 
                    { name: "tokenOut", type: "address" }, 
                    { name: "amountIn", type: "uint256" }, 
                    { name: "fee", type: "uint24" }, 
                    { name: "sqrtPriceLimitX96", type: "uint160" },
                ], 
                name: "params", 
                type: "tuple"
            }
    
    ],
        name: 'quoteExactInputSingle',
        outputs: [
            { name: "amountOut", type: "uint256" }
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const; 
