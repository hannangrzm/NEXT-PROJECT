export default function MilestoneViewer( {milestoneNumber, milestoneData}: any) {
    return (
        <div>
            <h2>Milestone {milestoneNumber} (Completed)</h2>
            <p>Description: </p>

            <div>
                <h3>Proof</h3>
                {milestoneData?.proofs?.map((file: any, idx: number) => (
                    <div key={idx}>
                        {file.type.startsWith("video") ? (
                            <video src={URL.createObjectURL(file)} controls width={120} />
                        ) : (
                            <img src={URL.createObjectURL(file)} width={120} />
                        )}
                    </div>

                ))}
            </div>

            <div>
                <h3>Invoives</h3>
                {milestoneData?.invoices?.map((file: any, idx: number) => (
                    <img key={idx} src={URL.createObjectURL(file)} width={120} />
                ))}
            </div>
        </div>
    )
}