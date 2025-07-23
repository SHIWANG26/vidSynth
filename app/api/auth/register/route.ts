import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const {email, password} = await req.json(); 
        if(!email || !password){
            return NextResponse.json(
                {message: "Email and password are required"}, 
                {status: 400}
            );
        }
        await connectToDatabase();

        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json(
                {message: "User already exists"}, 
                {status: 400}
            );
        }

        const user = await User.create({email, password});
        return NextResponse.json(
            {message: "User created successfully", 
                user: {id: user._id, email: user.email}},
            {status: 400}
        );
    }
    catch(error){
        console.error("Error creating user:", error);
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 400}
        );
    }
}