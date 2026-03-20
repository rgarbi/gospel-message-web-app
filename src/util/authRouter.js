const UNPROTECTED_PATHS = ['/', '/forgot-password', '/reset-password'];

function canRoute(path, token) {
    console.log('Got called: ', path, token);

    //if not an unprotected route then check
    if (isPathUnprotected(path)) {
        console.log('Path is not protected, do not check the token', path);
        return true;
    }

    if (path === '/admin') {
        return isAGoodToken(token) && isAdminToken(token);
    }

    let goodToken = isAGoodToken(token);
    console.log('Good token? -> ', goodToken);
    return goodToken;
}

function isPathUnprotected(path) {
    console.log(UNPROTECTED_PATHS);
    return UNPROTECTED_PATHS.includes(path);
}

function validateCheckTokenResponseIs401(tokenResponse) {
    if (tokenResponse.statusCode === 401) {
        return true;
    }

    return false;
}


function isAGoodToken(token) {
    if (isTokenEmpty(token)) {
        console.log('Empty token');
        return false;
    }
    
    if (tokenIsExpired(token)) {
        return false;
    }

    return true;
}

function isTokenEmpty(token) {
    if (Object.keys(token).length === 0) {
        console.log('Empty token');
        return true;
    }

    return false;
}

function tokenIsExpired(token) {
    let currentTimeInSeconds = new Date().getTime() / 1000;
    if (currentTimeInSeconds > token.expires_on) {
        console.log('Token must be expired...', currentTimeInSeconds, token.expires_on);
        return true;
    }

    return false;
}

/** True when the login response marks this session as admin (snake_case matches API). */
function isAdminToken(token) {
    if (!token || typeof token !== 'object') {
        return false;
    }
    if (token.is_admin === true) {
        return true;
    }
    if (typeof token.group === 'string' && token.group.toLowerCase() === 'admin') {
        return true;
    }
    return false;
}

export { canRoute, isTokenEmpty, tokenIsExpired, validateCheckTokenResponseIs401, isAdminToken };
