import errors from 'errors'
import request from'./request'

export function isSignedIn(options: any) {
    return request({ url: 'https://www.ticketswap.fr/profile', session: options.sessionID })
        .then((result) => {
            // If we were redirected to the login page the session id wasn't valid
            if (result.response.request.uri.path === '/login') {
                throw new errors.NotSignedInError(`The session id ${options.sessionID} is not valid`);
            }
        });
}