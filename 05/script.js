const startTime = performance.now()

const readline = require('readline')
const fs = require('fs')

const fileStream = fs.createReadStream('input')

const rl = readline.createInterface({
  input: fileStream
})

let lastSeenMapType
const maps = []
let seeds = []
let seedRanges = []

rl.on('line', line => {
  // parse seeds and cast to number
  if (line.startsWith('seeds:')) {
    seeds = line
      .split(': ')[1]
      .split(' ')
      .map(val => {
        return Number(val)
      })

    seedRanges = [...line.split(': ')[1].matchAll(/(\d+)\s+(\d+)/g)]
  }

  // notice and initialize new map type
  if (line.indexOf('map:') > -1) {
    lastSeenMapType = line.split(' ')[0]
    maps[lastSeenMapType] = new LargeRangeMap()
  }

  // parse map data to last observed map
  if (line.match(/^\d/)) {
    const mapData = line.split(' ')
    const destinationRangeStart = Number(mapData[0])
    const sourceRangeStart = Number(mapData[1])
    const rangeLength = Number(mapData[2])
    maps[lastSeenMapType].addRange(
      destinationRangeStart,
      sourceRangeStart,
      rangeLength
    )
  }
})

rl.on('close', () => {
  // part 1
  let lowestLocation
  seeds.forEach(seed => {
    const location = findLocation(seed)
    if (!lowestLocation || location < lowestLocation) lowestLocation = location
  })

  // part 2 using reverse search (starting from lowest location)
  let lowestLocation2 = -1
  for (let location = 0; lowestLocation2 < 0; location++) {
    const seed = findSeed(location)
    for (let counter = 0; counter < seedRanges.length; counter++) {
      const rangeStart = Number(seedRanges[counter][1])
      if (seed < rangeStart) continue

      const rangeLength = Number(seedRanges[counter][2])
      if (seed > rangeStart + rangeLength) continue

      lowestLocation2 = location
      break
    }
  }

  console.log('answer:', lowestLocation, lowestLocation2)
  const endTime = performance.now()
  const runtimeMs = endTime - startTime
  console.log(`runtime: ${runtimeMs} ms`)
})

function findLocation (seed) {
  const soil = getDestinationFromMap('seed-to-soil', seed)
  const fertilizer = getDestinationFromMap('soil-to-fertilizer', soil)
  const water = getDestinationFromMap('fertilizer-to-water', fertilizer)
  const light = getDestinationFromMap('water-to-light', water)
  const temperature = getDestinationFromMap('light-to-temperature', light)
  const humidity = getDestinationFromMap('temperature-to-humidity', temperature)
  const location = getDestinationFromMap('humidity-to-location', humidity)
  return location
}

// optimized to run faster vs findLocation
function findSeed (location) {
  const humidity = maps['humidity-to-location'].getSource(location)
  const temperature = maps['temperature-to-humidity'].getSource(humidity)
  const light = maps['light-to-temperature'].getSource(temperature)
  const water = maps['water-to-light'].getSource(light)
  const fertilizer = maps['fertilizer-to-water'].getSource(water)
  const soil = maps['soil-to-fertilizer'].getSource(fertilizer)
  const seed = maps['seed-to-soil'].getSource(soil)
  return seed
}

function getDestinationFromMap (type, source) {
  return maps[type].getDestination(source) || source
}

class LargeRangeMap {
  constructor () {
    this._ranges = []
  }

  getDestination (source) {
    let found = null
    this._ranges.forEach(range => {
      const sourceRangeStart = range[1]
      const rangeLength = range[2]
      if (
        source >= sourceRangeStart &&
        source < sourceRangeStart + rangeLength
      ) {
        const destinationRangeStart = range[0]
        const delta = destinationRangeStart - sourceRangeStart
        found = source + delta
      }
    })
    return found
  }

  getSource (destination) {
    const numRanges = this._ranges.length
    for (let counter = 0; counter < numRanges; counter++) {
      const destinationRangeStart = this._ranges[counter][0]
      if (destination < destinationRangeStart) continue

      const rangeLength = this._ranges[counter][2]
      if (destination > destinationRangeStart + rangeLength) continue

      const sourceRangeStart = this._ranges[counter][1]
      const delta = destinationRangeStart - sourceRangeStart
      return destination - delta
    }
    return destination
  }

  addRange (destinationRangeStart, sourceRangeStart, rangeLength) {
    this._ranges.push([destinationRangeStart, sourceRangeStart, rangeLength])
    this._ranges.sort((a, b) => b[2] - a[2])
  }
}
