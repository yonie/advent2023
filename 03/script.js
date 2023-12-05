const startTime = performance.now()

const readline = require('readline')
const fs = require('fs')

const fileStream = fs.createReadStream('input')

const rl = readline.createInterface({
  input: fileStream
})

let [sum, sum2] = [0, 0]
const engineSchematic = []

rl.on('line', line => {
  engineSchematic.push(line)
})

rl.on('close', () => {
  processEngineSchematic()

  console.log('answer:', sum, sum2)
  const endTime = performance.now()
  const runtimeMs = endTime - startTime
  console.log(`runtime: ${runtimeMs} ms`)
})

function processEngineSchematic () {
  for (let y = 0; y < engineSchematic.length; y++) {
    const partsInSchematicRow = engineSchematic[y].matchAll(/([0-9]+)/g)

    for (const foundPart of partsInSchematicRow) {
      // we validate if the part is connected to a symbol in the schematic
      if (validatePartNumber(y, foundPart.index, foundPart[0])) {
        sum += Number(foundPart[0])
      }
    }
  }
}

const gearsWithPartNumbers = {}

function validatePartNumber (locationY, locationX, partNumber) {
  // search 'around' the found part for nearby symbols
  for (let searchY = locationY - 1; searchY <= locationY + 1; searchY++) {
    for (
      let searchX = locationX - 1;
      searchX <= locationX + partNumber.length;
      searchX++
    ) {
      if (searchX < 0 || searchY < 0) continue
      if (!engineSchematic[searchY]) continue
      const char = engineSchematic[searchY][searchX]
      if (char === '*') {
        // this means we found a gear
        const coordinates = `${searchY},${searchX}`
        // we store the first found part number, and multiply for the result if we find the second one
        if (gearsWithPartNumbers[coordinates]) {
          sum2 += gearsWithPartNumbers[coordinates] * partNumber
        } else gearsWithPartNumbers[coordinates] = partNumber
      }
      if (acceptedChars.includes(char)) return true
    }
  }
  return false
}

const acceptedChars = ['*', '#', '&', '@', '$', '!', '+', '-', '=', '%', '/']
