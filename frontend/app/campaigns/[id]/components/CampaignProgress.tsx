export default function CampaignProgress () {
    const collected = 100;
    const target = 200;
    const percent = Math.min((collected / target) * 100, 100).toFixed(2);
    return (
        <div>
            <div className="w-full bg-gray-200 h-5 rounded-2xl overflow-hidden flex justify-between">
                <div 
                    className="border bg-green-500 h-5 rounded-2xl flex items-center justify-end px-2 text-gray text-sm"
                    style={{width: `${percent}%`}}><p>{percent}%</p></div>
                
            </div>
                <div className="flex justify-between mt-2 text-sm">
                    <p>Amount Collected: <span className="font-bold">RM {collected} </span>/ {target}</p>
                </div>
        </div>
    )
}