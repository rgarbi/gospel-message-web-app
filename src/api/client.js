
async function signUp(serverAddress, username, password) {
    return fetch(serverAddress + '/sign_up', { 
        method: 'POST',
        headers: new Headers({'Content-Type':'application/json'}),
        body: JSON.stringify({
            'username': username,
            'password': password
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




export default signUp;