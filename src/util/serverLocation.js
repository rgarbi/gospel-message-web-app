
function getServerAddress() {
    var currentLocation = window.location;
    let protocol = currentLocation.protocol;
    let hostname = currentLocation.hostname;

    if(hostname.includes('newsletter-web-app-cxqn.onrender.com')) {
        return 'https://newsletter-signup-service-r8s5-cvp4.onrender.com';
    }

    if(hostname.includes('newsletter-web-app.onrender.com')) {
        return 'https://newsletter-signup-service.onrender.com';
    }

    if(hostname.includes('subscribe.gospelmessage.net')) {
        return 'https://api.gospelmessage.net';
    }

    let host = protocol + '//' + hostname + ':8000'
    return host;
}

export default getServerAddress;