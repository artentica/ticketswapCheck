import config from './src/config'
// import isSignedIn from './src/testConnection'
// import request from './src/request'
// import Parser from './src/parser'
import Main from './src/main'

// isSignedIn().catch(err => console.log(err))
// main.run(config).then(res => console.log(res, typeof res))
// request('https://www.ticketswap.fr/event/resurrection-fest-2020/entrada-jueves-02-07/742ece31-3f8d-4c67-b1a0-39ee665a0657/1538965').then(res => {//console.log(res.body)
// console.log(new Parser({baseUrl : 'https://www.ticketswap.fr'}, res.body).getAvailableTickets())
// })


//.split('/').slice(0,3).join('/')


Main.run(config)