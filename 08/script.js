const startTime = performance.now()

const rl = require('readline').createInterface({
  input: require('fs').createReadStream('input')
})

let instructions
const maze = new Map()

rl.on('line', line => {
  if (!instructions) instructions = line
  else if (line !== '') {
    const locations = [...line.matchAll(/\w{3}/g)]
    const source = locations[0][0]
    const targetLeft = locations[1][0]
    const targetRight = locations[2][0]
    maze.set(source, [targetLeft, targetRight])
  }
})

rl.on('close', () => {
  // part 1
  let currentLocation = 'AAA'
  let steps = 0

  while (currentLocation !== 'ZZZ') {
    for (let counter = 0; counter < instructions.length; counter++) {
      if (instructions[counter] === 'L') {
        currentLocation = maze.get(currentLocation)[0]
      }
      if (instructions[counter] === 'R') {
        currentLocation = maze.get(currentLocation)[1]
      }
      steps++
    }
  }
  console.log('Total steps (part 1): ' + steps)

  // part 2
  const currentLocations = [...maze.keys()].filter(key => key.charAt(2) === 'A')
  const numLocations = currentLocations.length
  const intervals = []
  let stepsLcm = null
  steps = 0

  // the locations all repeat after X steps
  // their intervals all start at 0
  // so, simply lcm for each of the location "cycles"
  while (!stepsLcm) {
    for (
      let instructionCounter = 0;
      instructionCounter < instructions.length;
      instructionCounter++
    ) {
      steps++
      for (let locations = 0; locations < numLocations; locations++) {
        if (instructions[instructionCounter] === 'L') {
          currentLocations[locations] = maze.get(currentLocations[locations])[0]
        } else {
          currentLocations[locations] = maze.get(currentLocations[locations])[1]
        }
      }
      for (
        let locationIndex = 0;
        locationIndex < numLocations;
        locationIndex++
      ) {
        if (currentLocations[locationIndex].charAt(2) === 'Z') {
          if (!intervals[locationIndex]) {
            intervals[locationIndex] = steps
            // keep trying to run until we have all intervals
            stepsLcm = lcmOfArray(intervals)
          }
        }
      }
    }
  }
  console.log('Total steps (part 2): ' + stepsLcm)

  const endTime = performance.now()
  const runtimeMs = endTime - startTime
  console.log(`runtime: ${runtimeMs} ms`)
})

function gcd (a, b) {
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

function lcm (a, b) {
  return (a * b) / gcd(a, b)
}

function lcmOfArray (arr) {
  if (!arr[0]) return null
  let currentLcm = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (!arr[i]) return null
    currentLcm = lcm(currentLcm, arr[i])
  }
  return currentLcm
}
