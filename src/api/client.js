
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
    .then(response => { return generateResponse(response)})
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
    .then(response => { return generateResponse(response)})
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
    .then(response => { return generateResponse(response)})
    .catch(error => {
        console.error('Error:', error);
    });
}

async function exchangeOtpForToken(serverAddress, otp) {
    return fetch(serverAddress + '/forgot_password/otp/' + otp, { 
        method: 'GET',
        headers: new Headers({'Content-Type':'application/json'}),
    })
    .then(response => { return generateResponse(response)})
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
    .then(response => { return generateResponse(response)})
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
    .then(response => { return generateResponse(response)})
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
    .then(response => { return generateResponse(response)})
    .catch(error => {
        console.error('Error:', error);
    });
}



async function generateResponse(response) {
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

        if(response.status === 401) {
            window.location.replace(window.location.origin);
        }

        responseObject.statusCode = response.status
        return responseObject;
    }
}




export { signUp, logIn, getSubscriber, forgotPassword, exchangeOtpForToken, forgotPasswordResetPassword, getSubscriptionsBySubscriberId };