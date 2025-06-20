import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id">

type FetchOptions = {
    method?: "POST" | "GET" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
}

class ApiClient {
    private async fetch<T>(
        endPoint: string,
        options : FetchOptions = {}
    ) : Promise<T> {
        const {method = "GET", body, headers = {}} = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        }

        const response = await fetch(`/api${endPoint}`,{
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        })

        if(!response.ok){
            throw new Error(await response.text())
        }

        return response.json()
    }
    //It gets endpoint from the server for the videos
    async getVideos(){
        return this.fetch("/videos")
    }

    async createVideo(videoData: VideoFormData) {
        return this.fetch("/videos", {
            method: "POST",
            body: videoData,
        })
    }
}

export const apiCLient = new ApiClient();