
function getServerAddress() {
    var currentLocation = window.location;
    let protocol = currentLocation.protocol;
    let hostname = currentLocation.hostname;

    if(hostname.includes('onrender.com')) {
        return 'https://newsletter-signup-service.onrender.com';
    }

    let host = protocol + '//' + hostname + ':8000'
    return host;
}

export default getServerAddress;