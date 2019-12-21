// import errors from 'errors'
import request from'./request'

export async function isSignedIn() {
    return request('https://www.ticketswap.fr/profile')
        .then((result) => {
            // If we were redirected to the login page the session id wasn't valid
            if (result.response.request.uri.path === '/login') {
              console.error('error')
                // throw new errors.NotSignedInError(`The session id ${options.sessionID} is not valid`);
            }else console.log('ok')
        });
}