"use client"
import { useEffect, useState } from "react";
import CampaignHeader from "./components/CampaignHeader";
import CampaignProgress from "./components/CampaignProgress";
import CampaignButton from "./components/CampaignButton";

export default function CampaignDisplay ({params}: {params: {id: string}}) {
    const [campaign, setCampaign] = useState<any>(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            const res = await fetch(`/api/campaigns/${params.id}`);
            const data = await res.json();
            setCampaign(data);
            console.log(data);
        }
        fetchCampaign();
    }, [params.id]);

    if(!campaign) return <p className="text-center p-10">Loading....</p>

    return (
        <div className=" m-20 border">
            
            <div className="flex flex-col md:flex-row items-stretch border"> 
            <div className="w-full md:w-1/2 border">
                <img
                    src={campaign.campaign_photo}
                    className="aspect-[16/9] w-full overflow-hidden rounded-2xl object-cover shadow-md"
                />
            </div>
            
            <div className="w-full md:w-1/2 px-6 flex flex-col justify-start space-y-3">
                <CampaignHeader
                    id={campaign.id}
                    type={campaign.type}
                    title={campaign.project_title}
                    date={campaign.created_at}
                    description={campaign.project_description}
                    tag={campaign.tags}
                />
                <CampaignProgress/>
            </div>

            </div>

            <div className="flex justify-center">
                <CampaignButton
                    campaign={campaign}
                    />
            </div>

                
            </div>
    );
}