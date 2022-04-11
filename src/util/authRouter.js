export const UNPROTECTED_PATHS = ['/', '/forgot-password', '/reset-password'];

export default function canRoute(path, token) {
    console.log('Got called: ', path, token);

    //if not an unprotected route then check
    if (isPathUnprotected(path)) {
        console.log('Path is not protected, do not check the token', path);
        return true;
    }


    let goodToken = checkToken(token);
    console.log('Good token? -> ', goodToken);
    return goodToken;
}

function isPathUnprotected(path) {
    console.log(UNPROTECTED_PATHS);
    return UNPROTECTED_PATHS.includes(path);
}


function checkToken(token) {
    if (Object.keys(token).length === 0) {
        console.log('Empty token');
        return false;
    }


    let currentTimeInSeconds = new Date().getTime() / 1000;
    if (currentTimeInSeconds > token.expires_on) {
        console.log('Token must be expired...', currentTimeInSeconds, token.expires_on);
        return false;
    }

    return true;

}