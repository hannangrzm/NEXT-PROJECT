"use client";
import { useState } from "react";
import { useCampaignStore } from "@/store/campaignFormStore";
import { campaignDetailsSchema } from "@/schema/campaignFormSchema";
import TagsInput from "./TagsInput";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextArea";
import MilestoneInput from "./MilestoneInput";

export default function Step1Details() {
  const { data, updateFormData, setStep } = useCampaignStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isActive, setIsActive] = useState(false);
  

  const [form, setForm] = useState({
    type: data.type || "",
    title: data.title || "",
    description: data.description || "",
    targetAmount: data.targetAmount || "",
    photo: data.photo || null,
    milestones: data.milestones || {
      milestone1: "",
      milestone2: "",
      milestone3: "",
    },
    tags: data.tags || [],
  });

  const milestoneKeys = ["milestone1", "milestone2", "milestone3"] as const;

  const handleNext = () => {
    const parsed = campaignDetailsSchema.safeParse(form);

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
    updateFormData(parsed.data);
    setStep(2);
  };

  return (
    <div className="mx-20">
    
    <h1>Publish New Campaign</h1> 
    <h2 className="my-8">Campaign Details</h2>

    <div className="flex flex-col lg:flex-row gap-10">

    <div className="w-full lg:w-1/2">
        
        <div className="mb-5"> 
          <label>Type of Campaign:</label>

          {["disaster relief", "standard"].map((t) => ( 
          <button 
            key={t} 
            onClick={() => {
              setForm({ ...form, type: t });
            }} 
            type="button" 
            className={`ml-5 w-28 border p-1 border-transparent rounded-2xl transition ${form.type === t ? "!border-gray-500" : ""}`}
            > 
            {t} 
          </button> ))} 
          {errors.type && <p>{errors.type}</p>}
        </div> 
        

      <FormInput
        label="Your Project's Title"
        value={form.title}
        onChange={(val) => setForm({ ...form, title: val })}
        error={errors.title}
      />

      <FormTextarea
        label="Your Project's Description"
        value={form.description}
        onChange={(val) => setForm({ ...form, description: val })}
        error={errors.description}
      />

      <div className="">
        <div className="my-6">
        <label className="block font-medium">Milestones of Campaign</label>
        <p>For standard campaign, your organization is required to provide three milestones activities to be achieved. Details for each milestones will be required later when updating the milestone progress. </p>
        </div>
        {milestoneKeys.map((m, i) => {
          if (form.type !== "standard" && i > 0) return null;
          return (
            <MilestoneInput
              key={m}
              index={i}
              initialValue={form.milestones[m] ?? ""}
              onUpdate={(val) =>
                setForm({
                  ...form,
                  milestones: { ...form.milestones, [m]: val },
                })
              }
              error={errors[`milestones.${m}`]}
            />
          );
        })}

      </div>
      
    </div>

    <div className="w-full lg:w-1/2 flex flex-col justify-between">
      
      <div className="aspect-[16/9] bg-neutral-200 rounded-lg flex items-center justify-center w-full relative overflow-hidden">

      {form.photo ? (
          <div className="m-2">
            <img src={URL.createObjectURL(form.photo as File)}
            className="object-cover w-full h-full" />

            <button
              type="button"
              onClick={() => setForm({...form, photo: null})}
              className="absolute top-2 right-2 bg-white text-red-600 px-2 py-1 text-sm rounded-md shadow hover:bg-red-100 transition"
            >Remove</button>

          </div>
          
        
      ) : (
        <label htmlFor="photo-upload">Add Campaign's Photo</label>
      )}

        <input
          id="photo-upload"
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, photo: e.target.files?.[0] || null })
          }
        />

      </div>

      <div className="">
      <div>
        <TagsInput tags={form.tags} 
          setTags={(tags) => setForm({ ...form, tags })} 
          error={errors.tags} />
      </div>

      <FormInput
        label="Your Project's Targeted Funds Amount"
        type="string"
        value={form.targetAmount}
        onChange={(val) => setForm({ ...form, targetAmount: Number(val) })}
        error={errors.targetAmount}
      />

      </div>
      </div>

    </div>

    <div className="flex m-8 justify-center">
    <button 
      onClick={handleNext}
      className="bg-black text-neutral-200 border w-28 p-1 rounded-2xl "
      >Next
    </button>
    </div>
    </div>
  
  );
}
