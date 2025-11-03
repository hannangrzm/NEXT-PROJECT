import { z } from "zod";

export const campaignDetailsSchema = z
    .object({
        type: z.enum(["disaster relief", "standard"])
            .refine((val) => val !== undefined, { message: "Campaign type is required" }),
        title: z.string().min(1, "Title must be fullfil"),
        description: z.string().min(10, "Description must be at least 10 character"),
        photo: z
            .union([z.instanceof(File), z.string()])
            .refine((val) => !!val, "Camapign photo is required"),
        milestones: z.object({
            milestone1: z.string().min(1, "Milestone is required"),
            milestone2: z.string().optional(),
            milestone3: z.string().optional(),
        }),
        tags: z
            .array(z.string().min(1))
            .min(1, "At least one tag is required")
            .max(5, "Maximum 5 tags allowed"),
        targetAmount: z
            .any()
            .refine(
                (val) => !isNaN(Number(val)) && Number(val) > 0,
                "Target amount must be a number greater than 0"
            )
            .transform((val) => Number(val))
    })

    .refine(
        (data) => {
            if (data.type === "standard") {
                return (
                    data.milestones.milestone1 &&
                    data.milestones.milestone2 &&
                    data.milestones.milestone3
                );
            }
            return true;
        },
        {
            message: "Standard campaigns must have all 3 milestones filled.",
            path: ["milestones"],
        }
    );

export const campaignBackgroundSchema = z.object({
    background: z.string().min(10, "Background must be at least 10 characters"),
    problem: z.string().min(10, "Problem must be at least 10 characters"),
    solution: z.string().min(10, "Solution must be at least 10 characters")
});

export const campaignContactSchema = z.object({
    email: z.string().email("Invalid email format"),
    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(11, "Phone number must be at most 11 digits"),
    personInCharge: z.string().min(1, "Name is required"),
    accountNum: z.string()
});

export const fullCampaignSchema = campaignDetailsSchema
    .merge(campaignBackgroundSchema)
    .merge(campaignContactSchema);

export type fullCampaignData = z.infer<typeof fullCampaignSchema>;