import * as React from "react"
 
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { getSubscriber, getSubscriptionsBySubscriberId, Subscriber, Subscription } from "@/lib/api_client";
import { getApiServerLocation } from "@/lib/utils";
import { getAuthInfoFromSessionCookie } from "@/lib/session";
import Link from "next/link"


export default async function Home() {
    let authSession = await getAuthInfoFromSessionCookie();
    let getSubResponseObj = await getSubscriber(getApiServerLocation(), authSession.user_id, authSession.token);
    let subscriber: Subscriber = Object.assign(new Subscriber(), getSubResponseObj.object); 

    let subscriptionsResponseObj = await getSubscriptionsBySubscriberId(getApiServerLocation(), subscriber.id, authSession.token)
    let subscriptions: Array<Subscription> = JSON.parse(JSON.stringify(subscriptionsResponseObj.object)); 
    
    //let subscriptions: Array<Subscription> = Object.assign(new Array()<Subscription>, subscriptionsResponseObj.object); 
    
    console.log(subscriber);
    console.log(subscriptions);

    return (
        <div>
            <Card className="w-[750px]">
                <CardHeader>
                    <CardTitle>Welcome {subscriber.name}</CardTitle>
                    <CardDescription className="flex justify-between pt-3">
                        You have {subscriptions.length} subscriptions.
                        <div>
                            <Button asChild>
                                <Link href="/new-subscription">Add a Subscription</Link>
                            </Button>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {subscriptions.map((subscription) => {
                        return <Accordion type="single" collapsible key={subscription.id}>
                                <AccordionItem value="item-1">
                                <AccordionTrigger>{subscription.subscription_type} Subscription renewing on {subscription.subscription_renewal_date} for: {subscription.subscription_name}</AccordionTrigger>
                                <AccordionContent>
                                <Card key={subscription.id}>
                                    <CardHeader>
                                        <CardTitle>{subscription.subscription_type} Subscription Details</CardTitle>
                                        <CardDescription>Name: {subscription.subscription_name}</CardDescription>
                                        <CardDescription>Address Line 1: {subscription.subscription_mailing_address_line_1}</CardDescription>
                                        <CardDescription>Address Line 2: {subscription.subscription_mailing_address_line_2}</CardDescription>
                                        <CardDescription>City: {subscription.subscription_city}</CardDescription>
                                        <CardDescription>State: {subscription.subscription_state}</CardDescription>
                                        <CardDescription>Zip: {subscription.subscription_postal_code}</CardDescription>
                                        <CardDescription>Email Address: {subscription.subscription_email_address}</CardDescription>
                                        <CardDescription>Subscription Type: {subscription.subscription_type}</CardDescription>
                                        <CardDescription>Renews On: {subscription.subscription_renewal_date}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="outline">Change Payment Method</Button>
                                        <Button variant="destructive">Cancel Subscription</Button>
                                    </CardFooter>
                                </Card>
                                </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        })
                    }
                </CardContent>
                <CardFooter className="flex justify-between">
                
                </CardFooter>
            </Card>
        </div>
    );
}
