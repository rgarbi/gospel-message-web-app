
async function signUp(serverAddress, emailAddress, password, firstName, lastName) {
    return fetch(serverAddress + '/sign_up', { 
        method: 'POST',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({
            'email_address': emailAddress,
            'password': password,
            'first_name': firstName,
            'last_name': lastName,
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
        responseObject.statusCode = response.status
        return responseObject;
    }
}




export { signUp, logIn };