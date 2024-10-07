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
import { getSubscriber, getSubscriptionsBySubscriberId, Subscriber, Subscription } from "@/lib/api_client";
import { getApiServerLocation } from "@/lib/utils";
import { getAuthInfoFromSessionCookie } from "@/lib/session";




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
                    <CardDescription>Your email address is: {subscriber.email_address}</CardDescription>
                </CardHeader>
                <CardContent>
                    {subscriptions.map((subscription) => {
                        return <Card>
                            <CardHeader>
                                <CardTitle>{subscription.subscription_type} Subscription for: {subscription.subscription_email_address}</CardTitle>
                                <CardDescription>Renews on: {subscription.subscription_renewal_date}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                Sub content
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                Footer
                            </CardFooter>
                        </Card>
                        })
                    }
                </CardContent>
                <CardFooter className="flex justify-between">
                
                </CardFooter>
            </Card>
        </div>
    );
}
