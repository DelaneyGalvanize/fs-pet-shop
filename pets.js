
//delimited
'use strict'

const fs = require('fs');
const path = require('path');

const petsData = path.join(__dirname, 'pets.json')
const buffer = fs.readFileSync(petsData)
const pets = JSON.parse(buffer)

const command = process.argv[2]
const index = Number.parseInt(process.argv[3])



if (command === 'read'  && process.argv[3] !== undefined) {
  if (process.argv[3] < 0 || process.argv[3] > pets.length -1) {
    console.error('Usage: node pets.js [read] + [number]')
    process.exit(1)
  } else {
    console.log(pets[index])
  }

} else if (command === undefined) {
  console.error('Usage: node pets.js [read | create | update | destroy]')
  process.exit(1)

} else if (command === 'read') {
  console.log(pets);
}


if (command === 'create') {
  if (process.argv[3] === null || process.argv[4] === undefined  || process.argv[5] === undefined) {
    console.error('Usage: node pets.js create AGE KIND NAME')
    process.exit(1)
  } else {
    const newPet = {}
    var agePet = Number.parseInt(process.argv[3])
    newPet.age = agePet
    newPet.kind = process.argv[4]
    newPet.name = process.argv[5]
    pets.push(newPet)
    var createPet = JSON.stringify(pets)
    fs.writeFile('./pets.json', createPet, (err) => {
      if (err) throw err;
      console.log(newPet);
      });
  }

}
// const fs = require('fs');
// const path = require('path');
// const petsPath = path.join(__dirname, 'pets.JSON');
// let args = process.argv;
// let subCommand = args[2];
//
// //checks to see if the terminal command has "read" as the third part of it ($node pets.js read)
//
// if(!args[2]) {
//   console.error('Usage: node pets.js [read | create | update | destroy]')
//   process.exit(1)
// }
//
// fs.readFile(petsPath, 'utf8', (err, petsData) => {
//   var parsedPets= JSON.parse(petsData)
// if(subCommand === 'read'){
//   if(args.length === 3){
//       console.log(parsedPets);
//   }
//   //checks to see if args[3] exists, then checks to make sure args[3] is greater than 0, then checks to see if args[3] is
//   // less than the length of petsData
//   else if(args[3] && args[3] >= 0 && (args[3]<parsedPets.length)){
//     console.log(parsedPets[args[3]]);
//   }
//
// }
// })
// process.exit(1)
