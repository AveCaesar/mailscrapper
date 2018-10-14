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
      return [
          Array.from(document.querySelectorAll(selector.company_name)).map(element => element.innerText)[0],
          Array.from(document.querySelectorAll(selector.link)).map(element => element.href)[0].substr(50)
      ]
    }, selector)
    .end()
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
  let end = true, counter = 1
  
  await goToGrid()
  
  while(end) {
    counter++
    
    let info = await getNthGridInfo(counter)
    
    if(isCompanyExists(company_info.company_name) && info !== undefined) {
      continue
    } else if(info === undefined) {
      console.log("Border is riched. Trying to scroll down")

      let cardSelector = ".card.no-rationale:nth-child(" + counter + ")"
      
      try {        
        await nightmare
          .scrollTo(10000, 0)
          .wait(cardSelector)
          
        info = await getNthGridInfo(counter)
      } catch (err) {
        console.log("Scrolling used to be unsuccessfull. Trying to press 'show more'")
        
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
    
    previousPush(info)
  }
  
}

//Main()

const Test = async () => {
  
  await goToGrid()
  
  await nightmare
    .scrollTo(10000, 0)
  
}

Test()