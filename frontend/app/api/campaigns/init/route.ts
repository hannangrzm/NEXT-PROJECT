// app/api/campaigns/init/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { data: inserted, error } = await supabase
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
                    accountNum: body.accountNum,
                    status: "pending",
                    tx_hash: "pending",
                },
            ])
            .select("id")
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            campaignId: inserted.id,
        });
    } catch (err: any) {
        console.error("Error creating campaign:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}
