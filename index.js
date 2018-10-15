const nightmare = require('nightmare')({waitTimeout: 5000})
const { previousPush, finalPush, nextState, getState, isCompanyExists, incrementCounter, getLink } = require('./database')

const createURL = () => {
  let state = getState()
  
  return "https://play.google.com/store/apps/category/" + state.category + state.type
}

const getNthGridInfo = async (number) => {  
  let info, selector = {
    company_name: ".card.no-rationale:nth-child(" + number + ") a.subtitle",
    link: ".card.no-rationale:nth-child(" + number + ") a.card-click-target"
  }
  
  await nightmare
    .evaluate((selector) => {
      if(Array.from(document.querySelectorAll(selector.link)).map(element => element.href)[0] !== undefined) {
        return [
          Array.from(document.querySelectorAll(selector.company_name)).map(element => element.innerText)[0],
          Array.from(document.querySelectorAll(selector.link)).map(element => element.href)[0].substr(46)
        ]
      }
      
      return undefined
    }, selector)
    .then((a) => {
      info = a
    })
    .catch(error => {
      console.error('Getting company name from grid failed: ', error)
    })
  
  return info
}

const goToGrid = () => {
  return nightmare
    .goto(createURL())
}

/*===================================== MAIN LOOP ===========================================*/

const Main = async () => {
  let counter = 1
  
  await goToGrid()
  
  while(true) {    
    let info = await getNthGridInfo(counter)
    
    if(Array.isArray(info)) {
      counter++

      if(isCompanyExists(info[0])) {
        continue
      }
      
      previousPush(info)
      continue
    }
    
    console.log("Border is riched. Trying to scroll down")

    let cardSelector = ".card.no-rationale:nth-child(" + counter + ")"
    
    try {              
      await nightmare
        .wait(3000)
        .scrollTo(100000, 20)
        .wait(cardSelector)
    } catch (err) {
      console.log("Scrolling is unsuccessfull. Trying to press 'show more'")
      
      try {
        await nightmare
          .click("#show-more-button")
          .wait(cardSelector)
      } catch (err) {
        console.log("Pressing is unsuccessfull. Going forward")
        nextState()
        break
      }
    }
  }
  
  console.log("\nNEW CATEGORY\n");
  Main()  
}

const Final = async () => {
  while (true) {  
    console.log(getLink(getState().counter)); 
    
    try {
      await nightmare
        .goto("https://play.google.com/store/apps/details?id=" + getLink(getState().counter))
        .wait(100)
        .evaluate(() => {
          var mail, additional_info
          
          for (var i = 1; i < 5; i++) {
            mail = Array
              .from(document.querySelectorAll(".xyOfqd > .hAyfc:last-child > .htlgb .htlgb > div:nth-child(" + i + ") > a"))
              .map(element => element.innerText)[0]
              
            if(mail.indexOf('@') !== -1) break
          }
          
          if(Array.from(document.querySelectorAll(".xyOfqd > .hAyfc:last-child > .htlgb .htlgb > div:last-child > a")).map(element => element.href)[0] === undefined) {
            additional_info = Array.from(document.querySelectorAll(".xyOfqd > .hAyfc:last-child > .htlgb .htlgb > div:last-child")).map(element => element.innerText)[0]
          }
          
          return {
            company_name: Array.from(document.querySelectorAll(".i4sPve > .T32cc.UAO9ie:first-child > a")).map(element => element.innerText)[0],
            mail: mail,
            additional_info: additional_info 
          }
        })
        .then((info) => {
          console.log(info);
          finalPush(info)
          incrementCounter()
        })
    } catch (e) {
      incrementCounter()
      continue
    }     
  }
}

Main()
