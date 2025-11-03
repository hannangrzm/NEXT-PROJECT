import {create } from "zustand";
import { fullCampaignData } from "@/schema/campaignFormSchema";

type CampaignFormState = {
    data: Partial<fullCampaignData>;
    step: number;
    setStep: (s: number) => void;
    updateFormData: (values: Partial<fullCampaignData>) => void;
    updateNested: (path: string[], value: any) => void;
    resetForm: () => void;
};

//create store
export const useCampaignStore = create<CampaignFormState>((set, get) => ({
    data: {},
    step: 1,
    setStep: (s) => set({ step: s}),
    updateFormData: (values) =>
        set((state) => ({
            data: {...state.data, ...values},
        })),
    updateNested: (path, value) =>
        set((state) => {
            const newData = { ...state.data};
            let cur: any = newData;
            for(let i = 0; i < path.length - 1; i++) {
                const k = path[i];
                cur[k] = cur[k] ? {...cur[k]} : {};
                cur = cur[k];
            }
            cur[path[path.length - 1]] = value;
            return {data: newData};
        }),
        resetForm: () => set({ data: {}}),

}));