"use client";
import { useState } from "react";
import { useCampaignStore } from "@/store/campaignFormStore";
import { campaignBackgroundSchema } from "@/schema/campaignFormSchema";
import FormTextarea from "./FormTextArea";

export default function Step2Background() {
  const { data, updateFormData, setStep } = useCampaignStore();
  const [form, setForm] = useState({
    background: data.background || "",
    problem: data.problem || "",
    solution: data.solution || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const parsed = campaignBackgroundSchema.safeParse(form);
    if (!parsed.success) {
      const newErrors: Record<string, string> = {};

      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    updateFormData(parsed.data);
    console.log(parsed.data);
    setStep(3);
  };

  const isDisabled = !form.background || !form.problem || !form.solution;

  const fields = ["background", "problem", "solution"] as const;

  return (
    <div>
      <button onClick={() => setStep(1)}>Back</button>
      <div className="flex flex-col items-center text-left">
        <div className="w-2/3">
          <h1 className="text-2xl my-3">What is your story?</h1>
          <p>Tell us a brief story about your campaign! What problems does it solve and how do you plan it to be solved?</p>
        </div>
        
        {fields.map((field) => (
          <div 
            key={field} 
            className="text-gray-500 w-2/3">
            <FormTextarea
              label={field === "background" 
              ? "Background of the campaign"
              : field === "problem"
              ? "Problems description"
              : "Solutions"}
              value={form[field]}
              onChange={(val) => setForm({ ...form, [field]: val })}
              error={errors[field]}
              />
          </div>
        ))}
      </div>
      
      <div className="flex m-8 justify-center">
        <button 
          onClick={handleNext} 
          disabled={isDisabled}
          className="bg-black text-neutral-200 border w-28 p-1 rounded-2xl">
          Next
        </button>
      </div>
    </div>
  );
}
