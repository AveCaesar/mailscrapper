const JsonDB = require('node-json-db')
const Maildb = new JsonDB("MailDB", true, false)
const Statedb = new JsonDB("StateDB", true, false)
const { CATEGORIES } = require('./otherData')

/*====================================== MAIL ========================================== */

exports.pushMail = (company_name, mail, additional_info) => {
  Maildb.push("/" + company_name, [mail, additional_info])
}

exports.isCompanyExists = (company_name) => {
  try {
    Maildb.getData("/" + company_name)
  } catch (error) {
    
    return false
  }
  
  return true
}

/*====================================== STATE ========================================== */

exports.incrementCounter = () => {
  Statedb.push("/counter", Statedb.getData("/counter") + 1)
}

exports.nextState = () => {
  if(Statedb.getData("/type") === "/collection/topselling_free") {
    Statedb.push("/type", "/collection/topgrossing")
  } else {    
    let category_name = Statedb.getData("/category")
    
    if(category_name === 'FAMILY_PRETEND') {
      console.log("Thats all!")
      process.exit(0)
    }
    
    Statedb.push("/category", CATEGORIES[CATEGORIES.indexOf(category_name) + 1])
    Statedb.push("/type", "/collection/topselling_free")
  }
  
  Statedb.push("/counter", 0)
}

exports.getState = () => Statedb.getData("/")

