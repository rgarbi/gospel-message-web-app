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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPasswordServerAction } from "@/app/actions/auth"

export default function resetPassword() {
    const [restpassword_state, restpassword_action] = useFormState(resetPasswordServerAction, undefined)
    
    return (
        <Card>
            <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter a new password to reset your password</CardDescription>
            </CardHeader>
            <form action={restpassword_action}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="Enter password" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="passwordConfirmed">Password</Label>
                        <Input id="passwordConfirmed" name="passwordConfirmed" type="password" placeholder="Enter password" />
                    </div>
                    </div>
                
                <div>
                    {restpassword_state?.errors?.password && <p className="text-sm font-medium">{restpassword_state.errors.password}</p>}
                    {restpassword_state?.errors?.passwordConfirmed && <p className="text-sm font-medium">{restpassword_state.errors.passwordConfirmed}</p>}
                    {restpassword_state?.message && <p className="text-sm font-medium">{restpassword_state?.message}</p>}
                </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <SubmitButton text="Submit" />
                </CardFooter>
            </form>
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
