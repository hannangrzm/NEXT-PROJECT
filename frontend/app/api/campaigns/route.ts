// app/api/campaigns/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { ethers } from "ethers";
import DonationMetaTx from "@/app/abi/DonationMetaTx.json";

const rpcUrl = process.env.NEXT_PUBLIC_QUORUM_RPC_URL!;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const relayerPrivateKey = process.env.PRIVATE_KEY!; // backend relayer key

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
    console.error("Error fetching nonce:", err);
    return NextResponse.json({ error: "Failed to fetch nonce" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let campaignId;
  try {
    const body = await req.json();

    // 🟩 1️⃣ Store campaign in Supabase (UNCHANGED)
    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert([
        {
          type: body.type,
          project_title: body.title,
          project_description: body.description,
          campaign_photo: body.photoUrl || null,
          milestone1_title: body.milestones?.milestone1,
          milestone2_title: body.milestones?.milestone2,
          milestone3_title: body.milestones?.milestone3,
          tags: body.tags,
          target_amount: body.targetAmount,
          background: body.background,
          problem: body.problem,
          solution: body.solution,
          email: body.email,
          tel_number: body.phoneNumber,
          person_inCharge: body.personInCharge,
          status: "pending",
        },
      ])
      .select("id")
      .single();

    if (error) throw error;

    campaignId = campaign.id;



    //Validate MetaTx fields
    const { userAddress, functionSignature, nonce, signature } = body;
    if (!userAddress || !functionSignature || !signature) {
      throw new Error("Missing userAddress, functionSignature, or signature.");
    }

    //Relayer sends meta-transaction to Quorum
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const relayer = new ethers.Wallet(relayerPrivateKey, provider);
    const contract = new ethers.Contract(contractAddress, DonationMetaTx.abi, relayer);

    console.log("Relaying meta transaction...");
    const tx = await contract.executeMetaTransaction(
      userAddress,
      functionSignature,
      0, // value (0 for no ETH transfer)
      signature
    );

    console.log(`Waiting for tx to be mined...`);
    const receipt = await tx.wait();
    console.log(`✅ MetaTx mined: ${tx.hash}`);

    // 🟪 4️⃣ Try decoding event (optional, for transparency)
    const iface = new ethers.Interface(DonationMetaTx.abi);
    const campaignCreated = receipt.logs
      .map((log: any) => {
        try {
          return iface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsed: any) => parsed && parsed.name === "CampaignCreated");

    if (campaignCreated) {
      console.log("🎉 CampaignCreated Event:", {
        id: campaignCreated.args.id.toString(),
        title: campaignCreated.args.title,
        targetAmount: campaignCreated.args.targetAmount.toString(),
        creator: campaignCreated.args.creator,
      });
    }

    //update sb after bc success
    await supabase
      .from("campaigns")
      .update({
        status: "success",
        tx_hash: tx.hash,
      })
      .eq("id", campaignId);

    // 🟩 5️⃣ Respond to frontend
    return NextResponse.json({
      success: true,
      message: "Campaign stored + Meta Transaction relayed",
      txHash: tx.hash,
      supabaseId: campaign.id,
    });
  } catch (err: any) {
    console.error("API Error:", err);

    if (campaignId) {
      await supabase
        .from("campaigns")
        .update({
          status: "failed",
          error_msg: err.message,
        })
        .eq("id", campaignId);
    }

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

