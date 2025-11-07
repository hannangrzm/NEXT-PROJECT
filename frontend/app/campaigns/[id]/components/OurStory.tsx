export default function OurStory({campaign}: any) {
    return (
        <div className="flex flex-col md:flex-row w-full gap-2">
            <div className="border w-full md:w-2/3 p-4 rounded-lg">
                <div>
                    <h1>Background of the campaign</h1>
                    <p>{campaign.background}</p>
                </div>

                <div>
                    <h1>Problems description</h1>
                    <p>{campaign.problem}</p>
                </div>

                <div>
                    <h1>Solutions</h1>
                    <p>{campaign.solution}</p>
                </div>
                
            </div>

            <div className="border  w-full md:w-1/3 p-4 rounded-lg">
                <p>Contact</p>

                <div className="">
                    <p>{campaign.email}</p>
                    <p>{campaign.tel_number}</p>
                    <p>Person InCharge</p>
                    <p>{campaign.person_inCharge}</p>
                </div>
            </div>
        </div>
    )
}