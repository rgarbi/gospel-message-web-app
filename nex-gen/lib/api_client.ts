import { logout } from "@/app/actions/auth";

export class AuthTokenResponse {
    public user_id: string;
    public token: string;
    public expires_on: number;

    constructor() {
        this.user_id = "";
        this.token = "";
        this.expires_on = 0;
    }
}

export class Subscriber {
    public id: string;
    public name: string;
    public email_address: string;
    public user_id: string;
    public stripe_customer_id: string;

    constructor() {
        this.id = "";
        this.name = "";
        this.email_address = "";
        this.user_id = "";
        this.stripe_customer_id = "";
    }
}

export class Subscription {
    public id: string;
    public subscriber_id: string;
    public subscription_name: string;
    public subscription_mailing_address_line_1: string;
    public subscription_mailing_address_line_2: string;
    public subscription_city: string;
    public subscription_state: string;
    public subscription_postal_code: string;
    public subscription_email_address: string;
    public subscription_creation_date: string;
    public subscription_cancelled_on_date : string
    public subscription_anniversary_day : number
    public subscription_anniversary_month : number
    public subscription_renewal_date : string
    public active : boolean
    public subscription_type: string
    public stripe_subscription_id: string

    constructor() {
        this.id = "";
        this.subscriber_id = "";
        this.subscription_name = "";
        this.subscription_mailing_address_line_1 = "";
        this.subscription_mailing_address_line_2 = "";
        this.subscription_city = "";
        this.subscription_state = "";
        this.subscription_postal_code = "";
        this.subscription_email_address = "";
        this.subscription_creation_date = "";
        this.subscription_cancelled_on_date = "";
        this.subscription_anniversary_day = 0;
        this.subscription_anniversary_month = 0;
        this.subscription_renewal_date = "";
        this.active = false;
        this.subscription_type = "";
        this.stripe_subscription_id = "";
    }
}

export class ResponseObject {
    public object: {};
    public statusCode: number;

    constructor(responseBody: {}, status: number) {
        this.object = responseBody;
        this.statusCode = status;
    }
}


async function signUp(serverAddress: string, emailAddress: string, password: string, name: string): Promise<ResponseObject> {
    return fetch(serverAddress + '/sign_up', { 
        method: 'POST',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({
            'email_address': emailAddress,
            'password': password,
            'name': name,
        }),
    })
    .then(async response => { 
        return await generateResponse(response, true) 
    })
    .catch(error => {
        console.error('Error:', error);
        throw new Error('Error:', error)
    });
}

async function logIn(serverAddress: string, emailAddress: string, password: string): Promise<ResponseObject> {
    return fetch(serverAddress + '/login', { 
        method: 'POST',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({
            'email_address': emailAddress,
            'password': password,
        }),
    })
    .then(async response => { 
        return await generateResponse(response, true)
    })
    .catch(error => {
        console.error('Error:', error);
        throw new Error('Error:', error)
    });
}

async function forgotPassword(serverAddress: string, emailAddress: string): Promise<ResponseObject> {
    return fetch(serverAddress + '/forgot_password', { 
        method: 'POST',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({
            'email_address': emailAddress,
        }),
    })
    .then(async response => { return await generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
        throw new Error('Error:', error)
    });
}

async function exchangeOtpForToken(serverAddress: string, otp: string): Promise<ResponseObject> {
    return fetch(serverAddress + '/forgot_password/otp/' + otp, { 
        method: 'GET',
        headers: new Headers({'Content-Type':'application/json'}),
    })
    .then(async response => { return await generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
        throw new Error('Error:', error)
    });
}

async function forgotPasswordResetPassword(serverAddress: string, token: string, userId: string, password: string): Promise<ResponseObject> {
    return fetch(serverAddress + '/forgot_password/reset_password', { 
        method: 'POST',
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer ' + token],
        ]),
        body: JSON.stringify({
            'user_id': userId,
            'new_password': password,
        }),
    })
    .then(async response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
        throw new Error('Error:', error)
    });
}

async function getSubscriber(serverAddress: string, userId: string, token: string): Promise<ResponseObject> {
    return fetch(serverAddress + '/subscribers?user_id=' + userId, { 
        method: 'GET',
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer ' + token],
        ]),
    })
    .then(async response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
        throw new Error('Error:', error)
    });
}

async function getSubscriptionsBySubscriberId(serverAddress: string, subscriberId: string, token: string): Promise<ResponseObject> {
    return fetch(serverAddress + '/subscribers/' + subscriberId + '/subscriptions', { 
        method: 'GET',
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer ' + token],
        ]),
    })
    .then(async response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
        throw new Error('Error:', error)
    });
}

async function addSubscription(serverAddress: string, token: string, subscriberId: string, name: string, mailingAddressLine1: string, mailingAddressLine2: string, city: string, state: string, postalCode: string, emailAddress: string, subscriptionType: string) {
    return fetch(serverAddress + '/subscriptions', { 
        method: 'POST',
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer ' + token],
        ]),
        body: JSON.stringify({
            'subscriber_id': subscriberId,
            'subscription_name': name,
            'subscription_mailing_address_line_1': mailingAddressLine1,
            'subscription_mailing_address_line_2': mailingAddressLine2,
            'subscription_city': city,
            'subscription_state': state,
            'subscription_postal_code': postalCode,
            'subscription_email_address': emailAddress,
            'subscription_type': subscriptionType,
        }),
    })
    .then(response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
    });
}

async function updateSubscription(serverAddress: string, token: string, subscriptionId: string, subscriberId: string, name: string, mailingAddressLine1: string, mailingAddressLine2: string, city: string, state: string, postalCode: string, emailAddress: string, subscriptionType: string, creationDate: string, active: string, stripeSubscriptionId: string) {
    return fetch(serverAddress + '/subscriptions/' + subscriptionId , { 
        method: 'PUT',
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer ' + token],
        ]),
        body: JSON.stringify({
            'id': subscriptionId,
            'subscriber_id': subscriberId,
            'subscription_name': name,
            'subscription_mailing_address_line_1': mailingAddressLine1,
            'subscription_mailing_address_line_2': mailingAddressLine2,
            'subscription_city': city,
            'subscription_state': state,
            'subscription_postal_code': postalCode,
            'subscription_email_address': emailAddress,
            'subscription_creation_date': creationDate,
            'active': active,
            'subscription_type': subscriptionType,
            'stripe_subscription_id': stripeSubscriptionId,
        }),
    })
    .then(response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
    });
}

async function initiateCheckout(serverAddress: string, token: string, userId: string, subscriberId: string, name: string, mailingAddressLine1: string, mailingAddressLine2: string, city: string, state: string, postalCode: string, emailAddress: string, subscriptionType: string, priceLookupKey: string) {
    return fetch(serverAddress + '/checkout/' + userId, {
        method: 'POST',
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer ' + token],
        ]),
        body: JSON.stringify({
            'price_lookup_key': priceLookupKey,
            'subscription': {
                'subscriber_id': subscriberId,
                'subscription_name': name,
                'subscription_mailing_address_line_1': mailingAddressLine1,
                'subscription_mailing_address_line_2': mailingAddressLine2,
                'subscription_city': city,
                'subscription_state': state,
                'subscription_postal_code': postalCode,
                'subscription_email_address': emailAddress,
                'subscription_type': subscriptionType,
        },}),
    })
    .then(response => { 
        return generateResponse(response, true)
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

async function checkoutSuccess(serverAddress: string, token: string, userId: string, sessionId: string) {
    return fetch(serverAddress + '/checkout/' + userId + '/session/' + sessionId, {
        method: 'POST',
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer ' + token],
        ]),
    })
    .then(response => { 
        return generateResponse(response, true)
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

async function manageStripeSubscription(serverAddress: string, token: string, userId: string) {
    return fetch(serverAddress + '/checkout/'+ userId + '/manage', { 
        method: 'POST',
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer ' + token],
        ]),
    })
    .then(response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
    });
}

async function cancelSubscription(serverAddress: string, token: string, subscriptionId: string) {
    return fetch(serverAddress + '/subscriptions/' + subscriptionId, { 
        method: 'DELETE',
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer ' + token],
        ]),
    })
    .then(response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
    });
}

async function checkToken(serverAddress: string, token: string, userId: string): Promise<ResponseObject> {
    return fetch(serverAddress + '/check_token/'+ userId, { 
        method: 'POST',
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer ' + token],
        ]),
    })
    .then(async response => { return await generateResponse(response, false)})
    .catch(error => {
        console.error('Error:', error);
        throw new Error(error);
    });
}


async function generateResponse(response: Response, redirectOn401: boolean): Promise<ResponseObject> {
    let responseObject: ResponseObject = {
        object: {},
        statusCode: 0
    };
    
    if(response.ok) {
        let responseJson = await response.json().then((data) => {return data});
        responseObject.object = responseJson;
        responseObject.statusCode = response.status;
        return responseObject;
    } else {
        if(response.status === 401 && redirectOn401) {
            logout();
        }
        
        responseObject.statusCode = response.status
        return responseObject;
    }
}




export { signUp, logIn, getSubscriber, forgotPassword, exchangeOtpForToken, forgotPasswordResetPassword, getSubscriptionsBySubscriberId, addSubscription, initiateCheckout, checkoutSuccess, manageStripeSubscription, checkToken, cancelSubscription, updateSubscription };
