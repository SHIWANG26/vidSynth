"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { on } from "events";
import { set } from "mongoose";
import React, { useRef, useState } from "react";

interface FileUploadProps {
    onSuccess?: (response: any) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const FileUpload = ({
    onSuccess,
    onProgress,
    fileType
} : FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const[error, setError] = useState<string | null>(null);

    const validateFile= (file: File) => {
        if(fileType === "video"){
            if(!file.type.startsWith("video/")){
                setError("Please upload a valid video file.");
            }
        }
        if (file.size > 100 * 1024 * 1024) { // 100 MB limit
            setError("File size exceeds the 100 MB limit.");
            
        }
        return true;
    }
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file || !validateFile(file)) {
            return;
        }
        setUploading(true);
        setError(null);

        try {
            const authRes = await fetch("/api/auth/imagekit-auth");
            const auth = await authRes.json();

            const res = await upload({
                // Authentication parameters
                file,
                fileName: file.name, // Optionally set a custom file name
                publicKey: process.env.IMAGEKIT_PUBLIC_PUBLIC_KEY!,
                expire: auth.expire,
                token: auth.token,
                signature: auth.signature,
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent));
                    }
                },
            })

            onSuccess?.(res);
        } catch (error) {
            console.error("Upload failed:", error);

        } finally{
            setUploading(false);
        }
    }

    return (
        <>
            {/* File input element using React ref */}
            <input type="file"
                accept={fileType === "video" ? "video/*" : "image/*"} 
                onChange={handleFileChange}/>
            {uploading && (<span>Uploading...</span>)}
        </>
    );
};

export default FileUpload;
// This component provides a simple file upload interface using ImageKit's Next.js SDK.
// It allows users to select a file and upload it to ImageKit, displaying the upload progress.