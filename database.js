const JsonDB = require('node-json-db')
const Maildb = new JsonDB("MailDB", true, false)
const Statedb = new JsonDB("StateDB", true, false)
const Linkdb = new JsonDB("LinkDB", true, false)
const { CATEGORIES } = require('./otherData')

/*====================================== MAIL ========================================== */

exports.previousPush = (info) => {
  Maildb.push("/" + info[0], [])
  Linkdb.push("/links[]", info[1], true)
}

exports.finalPush = (info) => {
  if(info.company_name !== undefined) {
    if(info.additional_info === undefined) {
      Maildb.push("/" + info.company_name, [info.mail])
    } else {
      Maildb.push("/" + info.company_name, [info.mail, info.additional_info])
    }
  }
}

exports.isCompanyExists = (company_name) => {
  try {
    Maildb.getData("/" + company_name)
  } catch (error) {
    
    return false
  }
  
  return true
}

exports.getLink = (number) => {
  return Linkdb.getData("/links[" + number + "]")
}

/*====================================== STATE ========================================== */

exports.incrementCounter = () => {
  Statedb.push("/counter", Statedb.getData("/counter") + 1)
}

exports.nextState = () => {
  if(Statedb.getData("/type") === "/collection/topselling_free") {
    Statedb.push("/type", "/collection/topselling_paid")
  } else {    
    let category_name = Statedb.getData("/category")
    
    if(category_name === 'FAMILY_PRETEND') {
      console.log("Thats all!")
      process.exit(0)
    }
    
    Statedb.push("/category", CATEGORIES[CATEGORIES.indexOf(category_name) + 1])
    Statedb.push("/type", "/collection/topselling_free")
  }
}

exports.getState = () => Statedb.getData("/")

