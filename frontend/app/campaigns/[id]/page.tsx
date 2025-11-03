import { useEffect, useState } from "react";
import CampaignHeader from "./components/CampaignHeader";

export default function CampaignDisplay ({params}: {params: {id: string}}) {
    const [campaign, setCampaign] = useState<any>(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            const res = await fetch(`/api/campaigns/${params.id}`);
            const data = await res.json;
            setCampaign(data);
        }
        fetchCampaign();
    }, [params.id]);

    if(!campaign) return <p className="text-center p-10">Loading....</p>

    return (
        <div>
            <div> 
            <div>
                <img
                    src={campaign.campaign_photos}
                    className="rounded-2xl w-full object-cover shadow-md"
                />
            </div>
            <div>
                <CampaignHeader
                />
            </div>
            </div>

        </div>
    );
}