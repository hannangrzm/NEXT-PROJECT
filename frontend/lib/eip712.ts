// EIP-712 domain and types must match your Solidity contract
export const getEIP712MetaTxData = (
    chainId: number,
    verifyingContract: string,
    userAddress: string,
    nonce: number,
    functionSignature: string,
    value: number
) => ({
    domain: {
        name: "DonationMetaTx",
        version: "1",
        chainId,
        verifyingContract,
    },
    types: {
        MetaTransaction: [
            { name: "nonce", type: "uint256" },
            { name: "from", type: "address" },
            { name: "functionSignature", type: "bytes" },
            { name: "value", type: "uint256" },
        ],
    },
    primaryType: "MetaTransaction",
    message: {
        nonce,
        from: userAddress,
        functionSignature,
        value,
    },
});
