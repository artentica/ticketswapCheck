const rp = require('request-promise')
const chalk = require('chalk')
const cheerio = require('cheerio')


const url = 'https://www.ticketswap.fr/event/hellfest-2020/pass-3-jours/182ff3dd-db69-4d1a-98b0-4390edfa3649/1464290' // input your url here
let delayInMilliseconds = 1000; //1 second
const separator = '    '
function checkPlace(){

  setTimeout(function () {
  rp(url).then(html => {
    var date = new Date;
    const time = `${date.getHours()}h ${date.getMinutes()}min ${date.getSeconds()}s`
    const $ = cheerio.load(html)

    const data = $('span').filter(function () {
      return $(this).text().trim() === 'Disponible';
    }).parent().parent()

    let info = { dispo: false, info:[]}
    data.children().map(function () {
      const label = $(this).find('span').text()
      const val = $(this).find('h2').text()
      if (label === 'Disponible' && val > 0) info.dispo = true
      if(label) info.info.push({label,val})
    })
    console.log(chalk.yellow(time),separator,chalk[info.dispo ? 'green' : 'blue'](info.info.map(el => `${el.label}: ${el.val}`).join(separator)))
  }).then(() => checkPlace()).catch( () => {
    console.log(chalk.red('Error'))
    checkPlace()
  })

  }, delayInMilliseconds)
}

checkPlace()