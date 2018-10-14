const nightmare = require('nightmare')({ show: true })
const { getSelector } = require('./otherData')
const { previousPush, nextState, getState, isCompanyExists } = require('./database')

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
  let end = true, counter = 1, scroll_counter = 1
  
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
    scroll_counter++
    
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
        process.exit(0)
      }
    }
  }  
}

Main()

const Test = async () => {
  
  await goToGrid()
  
  await nightmare
    .scrollTo(10000, 0)
  
}

//Test()