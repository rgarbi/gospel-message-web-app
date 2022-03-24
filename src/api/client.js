
function signUp(serverAddress, username, password) {
    fetch(serverAddress + '/sign_up', { 
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        }),
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}




export default signUp;