const nightmare = require('nightmare')({ show: true })
const { getSelector } = require('./otherData')
const { pushMail, incrementCounter, nextState, getState, isCompanyExists } = require('./database')

const DEFAULT_LINK = "https://play.google.com/store/apps/category/"

const createURL = () => {
  let state = getState()
  
  return DEFAULT_LINK + state.category + state.type
}

nightmare
  .goto(createURL())
  .evaluate(() => document.querySelector("title"))
  .end()
  .then(console.log)
  .catch(error => {
    console.error('Search failed:', error)
  })

