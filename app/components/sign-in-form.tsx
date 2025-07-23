"use client"
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export function SignInForm() {
    return (
        <div className="flex flex-col gap-8 w-96 mx-auto">
            <p>Log in to see the numbers</p>
            <SignInButton mode="modal">
                <button className="bg-foreground text-background px-4 py-2 rounded-md">
                    Sign in
                </button>
            </SignInButton>
            <SignUpButton mode="modal">
                <button className="bg-foreground text-background px-4 py-2 rounded-md">
                    Sign up
                </button>
            </SignUpButton>
        </div>
    );
}