import main from './src/main'
import config from './src/config'

main.run(config).then(res => console.log(res, typeof res))
// request('https://www.google.fr').then(res => console.log(res, typeof res))