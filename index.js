const nightmare = require('nightmare')({ show: true })
const { getSelector } = require('./otherData')
const { pushMail, incrementCounter, nextState, isCompanyExists } = require('./database')

