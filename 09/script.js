const startTime = performance.now()

const rl = require('readline').createInterface({
  input: require('fs').createReadStream('input')
})

let sum = 0
let sum2 = 0

rl.on('line', line => {
  const input = line.split(' ')
  const nextValue = getNextValue(input)
  sum += nextValue
  const previousValue = getPreviousValue(input)
  sum2 += previousValue
})

rl.on('close', () => {
  console.log('sum:', sum, 'sum 2:', sum2)
  const endTime = performance.now()
  const runtime = endTime - startTime
  console.log(`runtime: ${runtime} ms`)
})

function getNextValue (input) {
  // check if this is the (semi) bottom sequence
  if (input.every(elem => elem === input[0])) {
    return input[0]
  } else {
    const deltas = []
    for (let c = 0; c < input.length - 1; c++) {
      deltas[c] = input[c + 1] - input[c]
    }
    // recursively find next value for array level deeper
    const nextDelta = getNextValue(deltas)
    // add it to the last known input array element
    const nextValue = Number(input[input.length - 1]) + nextDelta
    return nextValue
  }
}

function getPreviousValue (input) {
  // check if this is the (semi) bottom sequence
  if (input.every(elem => elem === input[0])) {
    return input[0]
  } else {
    const deltas = []
    for (let c = 0; c < input.length - 1; c++) {
      deltas[c] = input[c + 1] - input[c]
    }
    // recursively find prev value for array level deeper
    const previousDelta = getPreviousValue(deltas)
    // substract from first known input array element
    const previousValue = Number(input[0]) - previousDelta
    return previousValue
  }
}
