const startTime = performance.now()

const readline = require('readline')
const fs = require('fs')

const fileStream = fs.createReadStream('input')

const rl = readline.createInterface({
  input: fileStream
})

let times
let distances
let sum

rl.on('line', line => {
  // parse the inputs
  if (line.startsWith('Time')) {
    times = [...line.matchAll(/\d+/g)]
  }
  if (line.startsWith('Distance')) {
    distances = [...line.matchAll(/\d+/g)]
  }
})

rl.on('close', () => {
  // construct the races
  const races = []
  let n = 0
  let combinedTime = ''
  let combinedDistances = ''
  times.forEach(time => {
    races.push([time[0], distances[n][0]])
    // needed for part 2
    combinedTime = combinedTime + time[0]
    n++
  })
  // needed for part 2
  distances.forEach(distance => {
    combinedDistances = combinedDistances + distance[0]
  })
  races.push([combinedTime, combinedDistances])

  races.forEach(race => {
    const numWinningDistances = getNumWinningDistances(race[0], race[1])
    console.log(
      `Race: (${race}). Winning distances count:`,
      numWinningDistances
    )
    sum = sum ? sum * numWinningDistances : numWinningDistances
    console.log('Sum so far:', sum)
  })

  const endTime = performance.now()
  const runtimeMs = endTime - startTime
  console.log(`runtime: ${runtimeMs} ms`)
})

function getNumWinningDistances (raceTime, recordDistance) {
  let num = 0
  let chargeTime = 0
  while (chargeTime <= raceTime / 2) {
    // note that velocity is the same as charge time
    const travelDistance = (raceTime - chargeTime) * chargeTime
    if (travelDistance > recordDistance) {
      // second half of the results is the same, mirrored
      num =
        num + (chargeTime === raceTime / 2 ? 1 : 2)
    }
    chargeTime++
  }
  return num
}
