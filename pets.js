'use strict'
const fs = require('fs')
const path = require('path')
const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1])

let petsPath = path.join(__dirname, 'pets.json')
let command = process.argv[2]
let index = Number(process.argv[3])

if (command === 'read') {
    fs.readFile(petsPath, 'utf-8', function(err, petsData) {
      // parse 'json' 'petsData' so it can be manipulated by javscript code
      let parsedPets = JSON.parse(petsData)
      if (err) {
        throw err
        console.error(`Usage: ${node} ${file} ${command} INDEX`)
       }
       //need length -1
      if (index <= parsedPets.length - 1 && index > -1) {
        console.log(parsedPets[index])
          //need length-1
      } else if (index < 0 || index > parsedPets.length -1) {
        console.error(`Usage: ${node} ${file} ${command} INDEX`)
        process.exit(1)
      } else {
        console.log(parsedPets)
       }
   })
} else if (command === 'create') {
    fs.readFile(petsPath, 'utf-8', function(err, petsData) {
      let parsedPets = JSON.parse(petsData)
      // create an empty object to add new pet's key-value pairs
      let newPet = {}
      var age = Number(process.argv[3])
      var kind = String(process.argv[4])
      var name = String(process.argv[5])
      // log 'error' if there are not enough 'args' in command line prompt
      if (process.argv.length < 6) {
        console.error('Usage: node pets.js create AGE KIND NAME')
        process.exit(1)
      }
      // create the new object's key-value 'pairs' based on values retrieved from command line prompt
      newPet['age'] = age
      newPet['kind'] = kind
      newPet['name'] = name
      console.log(newPet)
      parsedPets.push(newPet)
      // 'stringify' the array back to json doc
      var updatedJSON = JSON.stringify(parsedPets)
      // use 'writeFile()' to write to 'petsPath' file
      fs.writeFile(petsPath, updatedJSON, function(err){
        if (err)
        { throw err }
    })
  })
} else {
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`)
    process.exit(1)
}
