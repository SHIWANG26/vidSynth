import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDatabase();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();//Lean converts the document to a plain JavaScript object

        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 });
        }
        return NextResponse.json(videos, { status: 200 });
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json(
            { error: "Failed to fetch videos" },
            { status: 500 }
        );
    }
}
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        await connectToDatabase();

        const body: IVideo = await request.json();
        if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
            return NextResponse.json(
                { error: "Title, description, and video URL are required" },
                { status: 400 }
            );
        }

        const videoData = {
            ...body,
            controls: body?.controls?? true, // Default to true if not provided
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 80, // Default quality to 80 if not provided
            }
        }
        const newVideo = await Video.create(videoData); 
        return NextResponse.json(newVideo);

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create video" },
            { status: 500 }
        );
    }
}