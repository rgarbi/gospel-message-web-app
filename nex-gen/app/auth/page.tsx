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

export default function Auth() {
    const [login_state, login_action] = useFormState(login, undefined)
    const [signup_state, signup_action] = useFormState(signup, undefined)
    
    return (
        <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Log In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
            <Card>
                <CardHeader>
                <CardTitle>Log In</CardTitle>
                <CardDescription>Already have an account? Please log in to manage your subscription.</CardDescription>
                </CardHeader>
                <form action={login_action}>
                    <CardContent>
                    
                        <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="Enter email" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" placeholder="Enter password" />
                        </div>
                        </div>
                    
                    <div>
                        {login_state?.errors?.email && <p>{login_state.errors.email}</p>}
                        {login_state?.errors?.password && <p>{login_state.errors.password}</p>}
                        {login_state?.message && <p>{login_state?.message}</p>}
                    </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <SubmitButton text="Log In" />
                    </CardFooter>
                </form>
            </Card>
        </TabsContent>
        <TabsContent value="signup">
            <Card>
                <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create an account so that you can manage your subscription later.</CardDescription>
                </CardHeader>
                <form action={signup_action}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" type="text" placeholder="John Smith" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="Enter email" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="Enter password" />
                    </div>
                    </div>
                
                <div>
                    {signup_state?.errors?.email && <p>{signup_state.errors.email}</p>}
                    {signup_state?.errors?.name && <p>{signup_state.errors.name}</p>}
                    {signup_state?.errors?.password && <p>{signup_state.errors.password}</p>}
                    {signup_state?.message && <p>{signup_state?.message}</p>}
                </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <SubmitButton text="Sign Up" />
                </CardFooter>
                </form>
            </Card>
      </TabsContent>
    </Tabs>
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
