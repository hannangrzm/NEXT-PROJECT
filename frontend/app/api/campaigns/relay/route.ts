// app/api/campaigns/relay/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { ethers } from "ethers";
import DonationMetaTx from "@/app/abi/DonationMetaTx.json";

const rpcUrl = process.env.NEXT_PUBLIC_QUORUM_RPC_URL!;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const relayerPrivateKey = process.env.PRIVATE_KEY!;

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userAddress = searchParams.get("userAddress");

        if (!userAddress) {
            return NextResponse.json({ error: "Missing userAddress" }, { status: 400 });
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const contract = new ethers.Contract(contractAddress, DonationMetaTx.abi, provider);
        const nonce = await contract.nonces(userAddress);

        return NextResponse.json({ nonce: nonce.toString() });
    } catch (err) {
        console.error(" Error fetching nonce:", err);
        return NextResponse.json({ error: "Failed to fetch nonce" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    let campaignId;

    try {
        const body = await req.json();
        const { userAddress, functionSignature, nonce, signature, campaignId: id } = body;

        if (!userAddress || !functionSignature || !signature || !id) {
            throw new Error("Missing required fields (userAddress, signature, campaignId, etc.)");
        }

        campaignId = id;

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const relayer = new ethers.Wallet(relayerPrivateKey, provider);
        const contract = new ethers.Contract(contractAddress, DonationMetaTx.abi, relayer);

        console.log("Relaying meta transaction...");
        const tx = await contract.executeMetaTransaction(userAddress, functionSignature, 0, signature);
        console.log("Waiting for tx to be mined...");
        const receipt = await tx.wait();

        console.log(`MetaTx mined: ${tx.hash}`);

        // Update Supabase status
        await supabase
            .from("campaigns")
            .update({
                status: "success",
                tx_hash: tx.hash,
            })
            .eq("id", campaignId);

        return NextResponse.json({
            success: true,
            txHash: tx.hash,
        });
    } catch (err: any) {
        console.error("Relay Error:", err);

        if (campaignId) {
            await supabase
                .from("campaigns")
                .update({
                    status: "failed",
                    error_message: err.message,
                })
                .eq("id", campaignId);
        }

        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}
