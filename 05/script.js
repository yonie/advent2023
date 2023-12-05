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
    maps[lastSeenMapType].set(
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
    for (const range of seedRanges) {
      const rangeStart = Number(range[1])
      const rangeLength = Number(range[2])
      if (seed >= rangeStart && seed < rangeStart + rangeLength) {
        lowestLocation2 = location
      }
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

function findSeed (location) {
  const humidity = getSourceFromMap('humidity-to-location', location)
  const temperature = getSourceFromMap('temperature-to-humidity', humidity)
  const light = getSourceFromMap('light-to-temperature', temperature)
  const water = getSourceFromMap('water-to-light', light)
  const fertilizer = getSourceFromMap('fertilizer-to-water', water)
  const soil = getSourceFromMap('soil-to-fertilizer', fertilizer)
  const seed = getSourceFromMap('seed-to-soil', soil)
  return seed
}

function getDestinationFromMap (type, source) {
  return maps[type].getDestination(source) || source
}

function getSourceFromMap (type, destination) {
  return maps[type].getSource(destination) || destination
}

class LargeRangeMap {
  constructor () {
    this._ranges = []
  }

  getDestination (source) {
    let found = null
    this._ranges.forEach(range => {
      if (found) return

      const sourceRangeStart = range[1]
      const rangeLength = range[2]
      if (
        source >= sourceRangeStart &&
        source < sourceRangeStart + rangeLength
      ) {
        const destinationRangeStart = range[0]
        const transposition = destinationRangeStart - sourceRangeStart
        found = source + transposition
      }
    })
    return found
  }

  getSource (destination) {
    let found = null
    this._ranges.forEach(range => {
      if (found) return

      const destinationRangeStart = range[0]
      const sourceRangeStart = range[1]
      const rangeLength = range[2]
      if (
        destination >= destinationRangeStart &&
        destination < destinationRangeStart + rangeLength
      ) {
        const transposition = destinationRangeStart - sourceRangeStart
        found = destination - transposition
      }
    })
    return found
  }

  set (destinationRangeStart, sourceRangeStart, rangeLength) {
    this._ranges.push([destinationRangeStart, sourceRangeStart, rangeLength])
  }
}
