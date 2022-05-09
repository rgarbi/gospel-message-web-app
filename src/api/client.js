
async function signUp(serverAddress, emailAddress, password, name) {
    return fetch(serverAddress + '/sign_up', { 
        method: 'POST',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({
            'email_address': emailAddress,
            'password': password,
            'name': name,
        }),
    })
    .then(response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
    });
}

async function logIn(serverAddress, emailAddress, password) {
    return fetch(serverAddress + '/login', { 
        method: 'POST',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({
            'email_address': emailAddress,
            'password': password,
        }),
    })
    .then(response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
    });
}

async function forgotPassword(serverAddress, emailAddress) {
    return fetch(serverAddress + '/forgot_password', { 
        method: 'POST',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({
            'email_address': emailAddress,
        }),
    })
    .then(response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
    });
}

async function exchangeOtpForToken(serverAddress, otp) {
    return fetch(serverAddress + '/forgot_password/otp/' + otp, { 
        method: 'GET',
        headers: new Headers({'Content-Type':'application/json'}),
    })
    .then(response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
    });
}

async function forgotPasswordResetPassword(serverAddress, token, userId, password) {
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
    .then(response => { return generateResponse(response, true)})
    .catch(error => {
        console.error('Error:', error);
    });
}

async function getSubscriber(serverAddress, userId, token) {
    return fetch(serverAddress + '/subscribers?user_id=' + userId, { 
        method: 'GET',
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

async function getSubscriptionsBySubscriberId(serverAddress, subscriberId, token) {
    return fetch(serverAddress + '/subscribers/' + subscriberId + '/subscriptions', { 
        method: 'GET',
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

async function addSubscription(serverAddress, token, subscriberId, name, mailingAddressLine1, mailingAddressLine2, city, state, postalCode, emailAddress, subscriptionType) {
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

async function initiateCheckout(serverAddress, token, userId, subscriberId, name, mailingAddressLine1, mailingAddressLine2, city, state, postalCode, emailAddress, subscriptionType, priceLookupKey) {
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

async function checkoutSuccess(serverAddress, token, userId, sessionId) {
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

async function manageStripeSubscription(serverAddress, token, userId) {
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

async function cancelSubscription(serverAddress, token, subscriptionId) {
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

async function checkToken(serverAddress, token, userId) {
    return fetch(serverAddress + '/check_token/'+ userId, { 
        method: 'POST',
        headers: new Headers([
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer ' + token],
        ]),
    })
    .then(response => { return generateResponse(response, false)})
    .catch(error => {
        console.error('Error:', error);
    });
}


async function generateResponse(response, redirectOn401) {
    let responseObject = {
        object: {},
        statusCode: 0
    }
    
    if(response.ok) {
        let responseJson = await response.json().then((data) => {return data});
        responseObject.object = responseJson;
        responseObject.statusCode = response.status;
        return responseObject;
    } else {
        if(response.status === 401 & redirectOn401) {
            window.location.replace(window.location.origin);
        }
        
        responseObject.statusCode = response.status
        return responseObject;
    }
}




export { signUp, logIn, getSubscriber, forgotPassword, exchangeOtpForToken, forgotPasswordResetPassword, getSubscriptionsBySubscriberId, addSubscription, initiateCheckout, checkoutSuccess, manageStripeSubscription, checkToken, cancelSubscription };