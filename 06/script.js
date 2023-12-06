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
    const distances = getPossibleDistances(race[0])
    const winningDistances = []
    distances?.forEach(distance => {
      if (distance > race[1]) winningDistances.push(distance)
    })
    console.log(
      `Race: (${race}). Winning distances count:`,
      winningDistances.length
    )
    sum = sum ? sum * winningDistances.length : winningDistances.length
    console.log('Sum so far:', sum)
  })

  const endTime = performance.now()
  const runtimeMs = endTime - startTime
  console.log(`runtime: ${runtimeMs} ms`)
})

function getPossibleDistances (racetime) {
  const distances = []
  let chargeTime = 0
  while (chargeTime <= racetime) {
    const velocity = chargeTime
    const movementDuration = racetime - chargeTime
    const travelDistance = movementDuration * velocity
    distances.push(travelDistance)
    chargeTime++
  }
  return distances
}
