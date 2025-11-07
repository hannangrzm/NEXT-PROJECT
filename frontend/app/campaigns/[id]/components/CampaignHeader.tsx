export default function CampaignHeader ({id, type, title, date, description, tag}: any) {
    return (
        <div className="space-y-3">
            <p>{type} Campaign by {id}</p>
            <div className="flex justify-between"> 
                <h1>{title}</h1>
                <p>{new Date(date).toLocaleDateString("en-GB")}</p>
            </div>

            <p>{description}</p>

            <div className="flex flex-wrap gap-3">
                <p>Tags: </p>
                {tag.map((tags: string, i: number) => (
                    <p className="border w-fit text-center rounded-2xl px-3">{tags}</p>
                ))}
            </div>
            
        </div>
    )
}
