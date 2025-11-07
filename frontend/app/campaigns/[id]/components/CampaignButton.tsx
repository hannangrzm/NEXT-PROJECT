"use client"
import { useState } from "react";
import OurStory from "./OurStory";
import MilestoneProgress from "./MilestoneProgress";

export default function CampaignButton ({campaign}: any) {
    const tabs = [
        "Our Story",
        "Milestone Progress",
        "Transaction Log",
        "Flow of Funds"
    ];

    const [active, setActive] = useState(tabs[0]);

    const renderContent = () => {
        switch (active) {
            case tabs[0]:
                return <OurStory
                campaign={campaign}/>;
            case tabs[1]:
                return <MilestoneProgress
                campaign={campaign}/>;
            case tabs[2]:
                return ;
            case tabs[3]:
                return ;
        }
    };

    return(
        <div className="w-full border ">
            <div className="flex flex-wrap justify-center rounded-xl p-10">
                <div>
                    {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActive(tab)}
                        className={
                            `border-b-2 px-10 py-2  transition ${
                            active === tab ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                            }`
                        }>{tab}</button>
                ))}

                </div>
                
            </div>

            <div className="mx-10">
                {renderContent()}
            </div>
        </div>
    )
}