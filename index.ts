import request from './src/request'

request('https://www.google.fr').then(res => console.log(res, typeof res))