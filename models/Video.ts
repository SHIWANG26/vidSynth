import mongoose, {Schema, model, models} from "mongoose";
import { tree } from "next/dist/build/templates/app-page";

// We define the dimensions for the video
export const VIDEO_DIMENSIONS = {
    width: 1080,
    heigth: 1920
}  as const;

// We define the interface for the video model
export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?: {
        heigth: number,
        width: number,
        quality?: number
    };
}

// We define the video schema using mongoose Schema
const videoSchema = new Schema<IVideo>(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        videoUrl: {
            type: String,
            required: true
        },
        thumbnailUrl: {
            type: String,
            required: true
        }, 
        controls: {
            type: Boolean,
            default: true
        },
        transformation: {
            heigth: {
                type: Number,
                default: VIDEO_DIMENSIONS.heigth
            },
            width: {
                type: Number,
                default: VIDEO_DIMENSIONS.width
            },
            // Optional quality field to specify the video quality
            quality: {
                type: Number,
                min: 1, 
                max: 100
            }
        }
    },
    {
        timestamps: true
    }
)

// We can use a pre-save hook to validate the videoUrl and thumbnailUrl before saving it to the database
const Video  = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;