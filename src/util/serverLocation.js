
function getServerAddress() {
    var currentLocation = window.location;

    let host = currentLocation.protocol + '//' + currentLocation.hostname + ':8000'

    return host;
}

export default getServerAddress;