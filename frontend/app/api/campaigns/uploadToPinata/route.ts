import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import os from "os";
import axios from "axios";

export async function POST(req: Request) {
    const data = await req.formData();
    const files = data.getAll("proofFiles") as File[];

    console.log("Received files:", files.length);

    if (!files.length) {
        return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    //temporary folder to hold files
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "milestone-"));

    for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(tempDir, file.name);
        fs.writeFileSync(filePath, buffer);
    }

    //add all files to FormData as a dir
    const formData = new FormData();
    const directoryName = `milestone-${Date.now()}`;
    files.forEach((file) => {
        formData.append("file", fs.createReadStream(path.join(tempDir, file.name)), {
            filepath: `${directoryName}/${file.name}`,
        });
    });

    //upload to Pinata
    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                maxBodyLength: Infinity,
                headers: {
                    Authorization: `Bearer ${process.env.PINATA_JWT}`,
                    ...formData.getHeaders(),
                },
            }
        );

        console.log("Pinata response:", res.data);

        fs.rmSync(tempDir, { recursive: true, force: true });

        return NextResponse.json({ cid: res.data.IpfsHash });

    } catch (err: any) {
        console.error("Upload failed:", err.response?.data || err.message);
        fs.rmSync(tempDir, { recursive: true, force: true });
        return NextResponse.json(
            { error: err.response?.data || err.message },
            { status: 400 }
        );
    }

}