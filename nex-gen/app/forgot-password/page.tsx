'use client'

import * as React from "react"
import { useFormState, useFormStatus } from 'react-dom'

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, signup } from "@/app/actions/auth"

export default function forgotPassword() {
    const [login_state, login_action] = useFormState(login, undefined)
    const [signup_state, signup_action] = useFormState(signup, undefined)
    
    return (
<Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>Enter the email address for your account.</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                <form action={action}>
                    <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="Enter email" />
                    </div>
                    </div>
                    <div>
                        {login_state?.errors?.email && <p>{login_state.errors.email}</p>}
                        {login_state?.message && <p>{login_state?.message}</p>}
                    </div>
                    <SubmitButton>Submit</SubmitButton>
                </form>
                </CardFooter>
            </Card>
    );
}

function SubmitButton(props: any) {
    const { pending } = useFormStatus()

    let button;
    if (pending) {
        button = (
            <Button disabled type="submit" variant="outline">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {props.text}
            </Button>
        )
    } else {
        button = (
            <Button type="submit" variant="outline">
                {props.text}
            </Button>
        )
    }
   
    return button
  }
