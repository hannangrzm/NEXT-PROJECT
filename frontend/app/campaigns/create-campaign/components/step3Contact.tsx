"use client";
import {ethers} from "ethers";
import { useState } from "react";
import { useCampaignStore } from "@/store/campaignFormStore";
import {
  campaignContactSchema,
  fullCampaignSchema,
} from "@/schema/campaignFormSchema";
import { supabase } from "@/lib/supabaseClient";
import DonationMetaTx from "@/app/abi/DonationMetaTx.json";
import { getEIP712MetaTxData } from "@/lib/eip712";
import FormInput from "./FormInput";
import { useRouter } from "next/navigation";

export default function Step3Contact() {
  const { data, setStep, resetForm } = useCampaignStore();
  const router = useRouter();

  const [form, setForm] = useState({
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    personInCharge: data.personInCharge || "",
    accountNum: data.accountNum || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const parsed = campaignContactSchema.safeParse(form);

    if (!parsed.success) {
      const newErrors: Record<string, string> = {};

      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      console.log(newErrors);
      return;
    }

    const fullData = { ...data, ...form };
    const validated = fullCampaignSchema.safeParse(fullData);
    console.log(fullData);

    if (!validated.success) {
      alert("Some fields are invalid");
      return;
    }

    setLoading(true);

    try {
      // Upload photo to Supabase Storage
      let photoUrl = null;
      if (validated.data.photo instanceof File) {
        const file = validated.data.photo;
        const filePath = `campaigns/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("campaign_photos")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("campaign_photos")
          .getPublicUrl(filePath);
        photoUrl = publicUrlData.publicUrl;
      }

       //Ensure user has a local private key (generate if not exist)
      let userPrivateKey = localStorage.getItem("userPrivateKey");

      if (!userPrivateKey) {
        const randomWallet = ethers.Wallet.createRandom();
        userPrivateKey = randomWallet.privateKey;
        localStorage.setItem("userPrivateKey", userPrivateKey);
        localStorage.setItem("userAddress", randomWallet.address);
        alert(
          `🆕 New wallet created for you:\nAddress: ${randomWallet.address}`
        );
      }

      const wallet = new ethers.Wallet(userPrivateKey);
      const userAddress = wallet.address;

      const initRes = await fetch("/api/campaigns/init", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          ...validated.data,
          photoUrl,
        }),
      });

      const initResult = await initRes.json();
      if(!initResult.success) throw new Error(initResult.error);

      const campaignId = initResult.campaignId;
      console.log("Supabase campaignId:", campaignId);
      

      const iface = new ethers.Interface(DonationMetaTx.abi);
      const functionSignature = iface.encodeFunctionData("createCampaign", [
        campaignId,
        fullData.title,
        fullData.targetAmount,
        userAddress,
      ]);

      //prepare EIP-712 typed data
      const chainId = 1337; 
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_QUORUM_RPC_URL);
      const contract = new ethers.Contract(contractAddress, DonationMetaTx.abi, provider);

      const nonceRes = await fetch(`/api/campaigns/relay?userAddress=${userAddress}`);
      const { nonce } = await nonceRes.json();


      const typedData = getEIP712MetaTxData(
        chainId,
        contractAddress, 
        userAddress,
        nonce,
        functionSignature,
        0
      );

      //sign typed data
      const signature = await wallet.signTypedData(
        typedData.domain,
        typedData.types,
        typedData.message
      );

      //send MetaTx to BE (to relay to BC)
      const relayRes = await fetch ("/api/campaigns/relay", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          campaignId,
          userAddress, 
          functionSignature, 
          nonce, 
          signature,
        }),
      });

      const relayResult = await relayRes.json();
      if(!relayResult.success) throw new Error (relayResult.error);

      alert(`Campaign created successfully!\nBlockchain Tx: ${relayResult.txHash}`);
      resetForm();
      //router.push(`/campaigns/${campaignId}`);
    } catch (err: any) {
      console.log("Error submitting: ", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => setStep(2)}>Back</button>
      <div className="flex flex-col items-center text-left ">
        <div className="w-2/3 my-4"> 
        <p>How donors can connect with you?</p>
        </div>

      <div className="w-2/3">
          <FormInput
          label="Email"
          value={form.email}
          onChange={(val) => setForm({ ...form, email: val })}
          error={errors.email}
        />
        
        <div className="mt-5">
          <FormInput
          label="Telephone number"
          value={form.phoneNumber}
          onChange={(val) => setForm({ ...form, phoneNumber: val })}
          error={errors.phoneNumber}
        />
        </div>
        
        <div className="mt-5">
          <FormInput
          label="Person In Charge"
          value={form.personInCharge}
          onChange={(val) => setForm({ ...form, personInCharge: val })}
          error={errors.personInCharge}
        />
        </div>
        
        <div className="mt-5">
          <FormInput
          label="Account Number"
          value={form.accountNum}
          onChange={(val) => setForm({ ...form, accountNum: val })}
          error={errors.accountNum}
        />
        </div>
        

      </div>

      <div className="flex m-8 justify-center">
        <button
          className="bg-black text-neutral-200 border w-28 p-1 rounded-2xl"
          disabled={loading} 
          onClick={handleSubmit}>
          {loading ? "Submitting.." : "Submit"}
        </button>
      </div>

      </div>
      
    </div>
  );
}
