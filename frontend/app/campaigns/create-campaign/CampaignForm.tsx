"use client";
import { useCampaignStore } from "@/store/campaignFormStore";
import Step1Details from "@/app/campaigns/create-campaign/components/step1Background";
import Step2Background from "@/app/campaigns/create-campaign/components/step2Background";
import Step3Contact from "@/app/campaigns/create-campaign/components/step3Contact";

export default function CampaignForm() {
  const { step, setStep } = useCampaignStore();

  return (
    <div className="m-5">
      {step === 1 && <Step1Details />}
      {step === 2 && <Step2Background />}
      {step === 3 && <Step3Contact />}
    </div>
  );
}
