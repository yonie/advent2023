const startTime = performance.now()

const readline = require('readline')
const fs = require('fs')

const fileStream = fs.createReadStream('input')

const rl = readline.createInterface({
  input: fileStream
})

let [sum, sum2] = [0, 0]

rl.on('line', line => {
  sum += getCalibrationValue(line)
  sum2 += getCalibrationValue(line, true)
})

rl.on('close', () => {
  console.log('answer:', sum, sum2)
  const endTime = performance.now()
  const runtimeMs = endTime - startTime
  console.log(`runtime: ${runtimeMs} ms`)
})

function getCalibrationValue (line, includeStrings) {
  let regex = /\d/g
  if (includeStrings) {
    regex = /\d|one|two|three|four|five|six|seven|eight|nine/g
  }

  let matches = []
  let cursor = 0

  // to deal with overlaps, we use a simple cursor
  while (cursor < line.length) {
    const hits = line.substring(cursor).match(regex)
    if (hits) matches.push(hits[0])
    cursor++
  }

  if (!matches) return

  // convert any found words to single digits
  matches = matches.map(match => wordToDigit(match))

  // combine the digits to form a number
  return Number(matches[0] + matches[matches.length - 1])
}

function wordToDigit (word) {
  const words = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9'
  }

  return word in words ? words[word] : word
}
