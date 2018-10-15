const nightmare = require('nightmare')({ show: true, executionTimeout: 5000})
const { getSelector } = require('./otherData')
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
          Array.from(document.querySelectorAll(selector.link)).map(element => element.href)[0].substr(50)
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
    counter++
    
    let info = await getNthGridInfo(counter)
    
    if(Array.isArray(info)) {
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
        .wait(1000)
        .scrollTo(100000, 20)
        .wait(cardSelector)
        
      info = await getNthGridInfo(counter)
    } catch (err) {
      console.log("Scrolling is unsuccessfull. Trying to press 'show more'")
      
      try {
        await nightmare
          .click("#show-more-button")
          .wait(cardSelector)
          
        info = await getNthGridInfo(counter)
      } catch (err) {
        console.log("Pressing is unsuccessfull. Going forward")
        nextState()
        break
      }
    }
  }
  
  Main()  
}

//Main()

const Final = async () => {
  while (true) {
    await nightmare
      .goto("https://play.google.com/store/apps/details?id=com." + getLink(getState().counter))
      .evaluate((getSelector) => ({
        company_name: Array.from(document.querySelectorAll(getSelector["APP_NAME"])).map(element => element.innerText)[0],
        mail: Array.from(document.querySelectorAll(getSelector["APP_MAIL"])).map(element => element.innerText)[0],
        additional_info: Array.from(document.querySelectorAll(getSelector["APP_ADDITIONAL"])).map(element => element.innerText)[0]  
      }), getSelector)
      .then((info) => {
        //finalPush(info)
        console.log(info);
        incrementCounter()
      })
      .catch()
  }
}

Final()