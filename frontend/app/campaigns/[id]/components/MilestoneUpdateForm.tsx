"use client"
import React, { useState } from "react";

type Props = {
    milestoneNumber: number;
    milestoneData?: any;
}
export default function MilestoneUpdateForm({milestoneNumber, milestoneData}: Props) {
    const [description, setDescription] = useState(milestoneData?.description || "");
    const [proofFiles, setProofFiles] = useState<File[]>([]);
    const [invoiceFiles, setInvoiceFiles] = useState<File[]>([]);
    const [cid, setCid] = useState<string | null>(null);

    const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setProofFiles([...proofFiles, ...Array.from(e.target.files)]);
    }

    const handleInvoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setInvoiceFiles([...invoiceFiles, ...Array.from(e.target.files)]);
    };

    const removeProofFile = (index: number) => {
        setProofFiles(proofFiles.filter((_, i) => i !== index));
    };

    const removeInvoiceFile = (index: number) => {
        setInvoiceFiles(invoiceFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        proofFiles.forEach((file) => {
            formData.append("proofFiles", file)
        });

        const res = await fetch("/api/campaigns/uploadToPinata", {
            method: "POST",
            body: formData,
        });

        const text = await res.text(); // check raw body
        console.log("Raw response:", text);

        try {
        const data = JSON.parse(text);
        console.log("Parsed JSON:", data);
        } catch (e) {
        console.error("Invalid JSON response:", e);
        }

    }

    return(
        <div className="">
            <h2>Update Milestone {milestoneNumber}</h2>

            <div>
                <label>Description: </label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}/>
            </div>

            <div>
                <label>Upload Proofs (images/videos)</label>
                <input type="file" multiple accept="image/*, video/*" onChange={handleProofUpload} />

                <div>
                    {proofFiles.map((file, idx) => {
                        const url = URL.createObjectURL(file);
                        return(
                            <div key={idx}>
                                {file.type.startsWith("video") ? (
                                    <video src={url} controls width={120} />
                                ) : (
                                    <img src={url} width={120} />
                                )}
                                <button onClick={() => removeProofFile(idx)}>Remove</button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <label>Upload Invoices (images): </label>
                <input type="file" multiple accept="image/*" onChange={handleInvoiceUpload} />

                <div>
                    {invoiceFiles.map((file, idx) => {
                        const url = URL.createObjectURL(file);

                        return(
                            <div key={idx}>
                                <img src={url} width={120} />
                                <button onClick={() => removeInvoiceFile(idx)}>Remove</button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <button onClick={handleSubmit}>Save Milestone</button>
        </div>
    )
}