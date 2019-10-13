const rp = require("request-promise");
const chalk = require("chalk");
const cheerio = require("cheerio");
const notifier = require("node-notifier");
const opn = require("opn");
const puppeteer = require("puppeteer");

const authCookie = [
  {
    name: "cookieAccepted",
  },
  {
    name: "geoInfo",
    value:
  },
  {
    name: "session",
  },
  {
    name: "sid",
  },
  {
    name: "token",
    value:
};
  }
];
const baseurl = "https://www.ticketswap.fr"; // input your url here
//const url =
//  baseurl +
//  "/event/pitchfork-music-festival-paris-2019/c2d3f804-08d0-4acc-967e-579a6875d584"; // input your url here
const url = baseurl + '/event/hellfest-2020/182ff3dd-db69-4d1a-98b0-4390edfa3649' // input your url here
const autoReservationBool = true; // auto open browser and resa ticket, script stop on resa page, need to manually relaunch it
const interestedOptions = ['Pass 3 Jours', 'Pack T-Shirt (=Pass Entrée SANS T-Shirt)', 'Pass 3 Jours CE', 'Pass Leclerc', 'Pack Bus (=Pass Entrée SANS Bus)'] // Option interested by
//const interestedOptions = [
//  "1-Day Ticket - Saturday",
//  "2-days Pass - (Thursday & Friday)"
//]
 // Option interested by
const preferNumberTickets = (a, b) => {
  return (
    parseInt(
      b
        .text()
        .trim()
        .split(" x ")[0]
    ) -
    parseInt(
      a
        .text()
        .trim()
        .split(" x ")[0]
    )
  );
};

const delayInMilliseconds = 1000; //1 second
const separator = "    "; //separator of info
const reactiveValLabel = "Disponible";
let inPurchasing = false; // is buying ticket

async function buyTicketButton(link) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(baseurl + link)
  await page.setCookie(...authCookie);
  await page.evaluate(() => {
    localStorage.setItem("didSetupIdentity", 1)
  })
  await page.goto(baseurl + link)
  await page.click("div > form > button")
}

function autoReservation(availableOption, htlmObj) {
  inPurchasing = true;
  let link = "";
  for (let idx = 0; idx < availableOption.length; idx++) {
    link = htlmObj(`a div h4:contains(${availableOption[idx]})`)
      .parent()
      .parent()
      .attr("href");
    if (link) break;
  }
  if (link) {
    rp(baseurl + link).then(html => {
      //load html in cheerio
      const $ = cheerio.load(html);
      const ticket = [];
      $(`a div header h3`).map(function() {
        ticket.push($(this));
      });

      let buyticketLink = "";
      for (
        let index = 0;
        index < ticket.sort(preferNumberTickets).length;
        index++
      ) {
        buyticketLink = ticket[index].parents("a").attr("href");
        buyTicketButton(buyticketLink);
        if (buyticketLink) break;
      }
    });
  } else {
    return false;
  }
  // TODO failed case
}

//recursive func
function checkTicketAvailability() {
  const date = new Date();
  //time to show
  const time = `${date.getHours()}h ${date.getMinutes()}min ${date.getSeconds()}s`;

  //delay call
  setTimeout(function() {
    //request with promise
    rp(url)
      //when html is received
      .then(html => {
        //load html in cheerio
        const $ = cheerio.load(html);
        //init info object
        let info = { dispo: false, info: [] };

        //get all data in page
        const data = $("span")
          .filter(function() {
            return (
              $(this)
                .text()
                .trim() === reactiveValLabel
            );
          })
          .parent()
          .parent();

        //for all children get label and value
        data.children().map(function() {
          const label = $(this)
            .find("span")
            .text();
          const val = $(this)
            .find("h2")
            .text();
          if (label === reactiveValLabel && val > 0) info.dispo = true;
          if (label) info.info.push({ label, val });
        });

        //if there is place, show link to quick access
        if (info.dispo) {
          const optionsAvailable = $("a h4")
            .parent()
            .has("strong")
            .map(function() {
              return $(this)
                .find("h4")
                .text()
                .trim();
            })
            .get();

          if (optionsAvailable.some(opt => interestedOptions.includes(opt))) {
            console.log(
              chalk.yellow(time),
              separator,
              chalk.green.inverse(
                info.info.map(el => `${el.label}: ${el.val}`).join(separator)
              )
            );
            console.log(chalk.bgMagenta(url));
            // Notification object
            if (!autoReservationBool) {
              notifier.notify(
                {
                  title: "TicketSwap available ticket",
                  subtitle: url,
                  message: "Click to open browser",
                  sound: "ding.mp3",
                  wait: true
                },
                function() {
                  opn(url);
                }
              );
            } else {
              autoReservation(
                optionsAvailable.filter(opt => interestedOptions.includes(opt)),
                $
              );
            }
          } else {
            console.log(
              chalk.yellow(time),
              separator,
              chalk.green(
                info.info.map(el => `${el.label}: ${el.val}`).join(separator)
              )
            );
            console.log(chalk.bgMagenta(url));
          }
        } else {
          //screen time and info in color depending if ticket are available or not
          console.log(
            chalk.yellow(time),
            separator,
            chalk.blue(
              info.info.map(el => `${el.label}: ${el.val}`).join(separator)
            )
          );
        }
      })
      //When last request is finished we loop
      .then(() => {
        if (!inPurchasing) checkTicketAvailability();
      })
      //if there is a crashed we log an error and still loop
      .catch(err => {
        console.log(chalk.yellow(time) + chalk.red(err || "Error"));
        inPurchasing = false;
        checkTicketAvailability();
      });
  }, delayInMilliseconds);
}

//start the recursive loop
checkTicketAvailability();
