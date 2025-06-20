"use client"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import Link from 'next/link';

function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            //React query to register the user
            //loading, error, debounce, etc. can be handled with react-query or similar libraries
            const response = await fetch("/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            email, password
                        }
                    )
                }
            )
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to register");
            }
            console.log("Registration successful", data);
            // Redirect to login page after successful registration
            router.push("/login");
        } catch (error) {
            console.error("Error during registration:", error);
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
            <div>
                <p>
                    Already have an account? <Link href="/login">Login</Link>
                </p>

            </div>
        </div>

    )
}

export default RegisterPage