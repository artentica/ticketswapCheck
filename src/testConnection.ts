import { NotSignedError } from './error';
import request from './request';

export default async function isSignedIn() {
  return request('https://www.ticketswap.fr/profile').then(result => {
    // If we were redirected to the login page the session id wasn't valid
    if (result.response.request.uri.path === '/login') {
      //   const customError = new error(`The session id ${options.sessionID} is not valid`)
      throw new NotSignedError(`The session id is not valid`);
    }
  });
}
