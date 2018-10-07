const nightmare = require('nightmare')({ show: true })
const { getSelector } = require('./otherData')
const { pushMail, incrementCounter, nextState, getState, isCompanyExists } = require('./database')

const DEFAULT_LINK = "https://play.google.com/store/apps/category/"

const createURL = () => {
  let state = getState()
  
  return DEFAULT_LINK + state.category + state.type
}

const getNthGridName = async (number) => {
  let company_name, selector = ".card.no-rationale:nth-child(" + number + ") a.subtitle"
  
  await nightmare
    .evaluate((selector) => {
      return Array.from(document.querySelectorAll(selector)).map(element => element.innerText)[0]
    }, selector)
    .end()
    .then((title) => {
      company_name = title
    })
    .catch(error => {
      console.error('Getting title from grid failed: ', error)
    })
    
  return company_name
}

const goToGrid = () => {
  return nightmare
    .goto(createURL())
}

const getCompanyInfo = (company_name) => {
  nightmare
    .
}

/*===================================== MAIN LOOP ===========================================*/

const Main = async () => {
  let end = true, counter = 1
  
  await goToGrid()
  
  while(end) {
    counter++
    
    let company_name = await getNthGridName(counter)
    
    if(isCompanyExists(company_name)) {
      continue
    }
    
    let info = await getCompanyInfo(company_name)
  }
  
}

Main()



