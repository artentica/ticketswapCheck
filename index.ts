// import main from './src/main'
// import config from './src/config'
import isSignedIn from './src/testConnection'

isSignedIn().catch(err => console.log(err))
// main.run(config).then(res => console.log(res, typeof res))
// request('https://www.google.fr').then(res => console.log(res, typeof res))