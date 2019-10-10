const rp = require('request-promise')
const chalk = require('chalk')
const cheerio = require('cheerio')


const url = 'https://www.ticketswap.fr/event/hellfest-2020/pass-3-jours/182ff3dd-db69-4d1a-98b0-4390edfa3649/1464290' // input your url here
const delayInMilliseconds = 1000; //1 second
const separator = '    ' //separator of info

//recursive func
function checkPlace(){
  const date = new Date;
  //time to show
  const time = `${date.getHours()}h ${date.getMinutes()}min ${date.getSeconds()}s`

  //delay call
  setTimeout(function () {
  //request with promise
  rp(url)
  //when html is received
  .then(html => {
    //load html in cheerio
    const $ = cheerio.load(html)
    //init info object
    let info = { dispo: false, info:[]}

    //get all data in page
    const data = $('span').filter(function () {
      return $(this).text().trim() === 'Disponible';
    }).parent().parent()

    //for all children get label and value
    data.children().map(function () {
      const label = $(this).find('span').text()
      const val = $(this).find('h2').text()
      if (label === 'Disponible' && val > 0) info.dispo = true
      if(label) info.info.push({label,val})
    })

    //screen time and info in color depending if ticket are available or not
    console.log(chalk.yellow(time),separator,chalk[info.dispo ? 'green' : 'blue'](info.info.map(el => `${el.label}: ${el.val}`).join(separator)))
    //if there is place, show link to quick access
    if (info.dispo) console.log(chalk.bgMagenta(url))
  })
  //When last request is finished we loop
  .then(() => checkPlace())
  //if there is a crashed we log an error and still loop
  .catch( err => {
    console.log(chalk.yellow(time) + chalk.red(err || 'Error'))
    checkPlace()
  })

  }, delayInMilliseconds)
}

//start the recursive loop
checkPlace()