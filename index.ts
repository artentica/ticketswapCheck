import config from './src/config'
import Main from './src/main'
import isSignedIn from './src/testConnection'

isSignedIn().then(() => Main.run(config))
