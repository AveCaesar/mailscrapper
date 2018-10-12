const nightmare = require('nightmare')({ show: true })
const { getSelector } = require('./otherData')
const { pushMail, pushLink, incrementCounter, nextState, getState, isCompanyExists } = require('./database')

const DEFAULT_LINK = "https://play.google.com/store/apps/category/"

const createURL = () => {
  let state = getState()
  
  return DEFAULT_LINK + state.category + state.type
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
  let end = true, counter = getState().counter
  
  await goToGrid()
  
  while(end) {
    counter++
    
    let company_info = await getNthGridInfo(counter)
    
    if(isCompanyExists(company_info.company_name)) {
      continue
    }
    
    
  }

  console.log(await getNthGridInfo(1))
  
}

Main()