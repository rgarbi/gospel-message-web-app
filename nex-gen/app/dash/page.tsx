'use client'
import * as React from "react"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { logout } from "@/app/actions/auth";
import { useFormState } from "react-dom";
import { decrypt } from "@/lib/session";


export default function Home() {
    
    const [state, action] = useFormState(logout, undefined)
    

    return (
        <div>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>You are Logged In</CardTitle>
                    <CardDescription>Your email address is: {}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                <form action={action}>
                    <Button type="submit">Log Out</Button>
                </form>
                </CardFooter>
            </Card>
        </div>
    );
}
