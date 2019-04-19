const fs = require("fs")
const csv = require("csvtojson")

async function convert(filePath) {
  let result = csv().fromFile(filePath)
  let json = await Promise.all([result])
  return json
}

module.exports convert
