const startTime = performance.now()

const file = 'input'
// define *additional* steps counted for each boundary
// eg. part one uses '1' and part two uses '1000000-1'
const boundaryDistance = 1000000 - 1

const rl = require('readline').createInterface({
  input: require('fs').createReadStream(file)
})

const universe = []

rl.on('line', line => {
  universe.push(line)
})

rl.on('close', () => {
  const boundaries = findBoundaries(universe)
  const galaxies = findGalaxies(universe)

  let sumDistances = 0
  for (let indexA = 0; indexA < galaxies.length; indexA++) {
    for (let indexB = 0; indexB < galaxies.length; indexB++) {
      if (indexA >= indexB) continue
      sumDistances += calculateShortestDistance(
        galaxies[indexA],
        galaxies[indexB],
        boundaries,
        boundaryDistance
      )
    }
  }
  console.log('answer', sumDistances)
  const endTime = performance.now()
  const runtime = endTime - startTime
  console.log(`runtime: ${runtime} ms`)
})

function findGalaxies (universe) {
  const galaxies = []

  // numbering galaxies starts at 1
  let num = 1
  for (let line = 0; line < universe.length; line++) {
    const foundgalaxies = [...universe[line].matchAll(/[#]/g)]
    foundgalaxies.forEach(gal => {
      galaxies.push([num, Number(gal.index), line])
      num++
    })
  }
  return galaxies
}

function findBoundaries (universe) {
  // horizontal boundaries
  const bx = []
  for (let x = 0; x < universe[0].length; x++) {
    let isBoundary = true
    for (let y = 0; y < universe.length; y++) {
      if (universe[y].charAt(x) !== '.') isBoundary = false
    }
    if (isBoundary) {
      bx.push(x)
    }
  }

  // vertical boundaries
  const by = []
  for (let y = 0; y < universe.length; y++) {
    if (universe[y].split('').every(val => val === '.')) {
      by.push(y)
    }
  }

  return { x: bx, y: by }
}

function calculateShortestDistance (
  source,
  destination,
  boundaries,
  boundaryDistance
) {
  const sourceX = source[1]
  const destinationX = destination[1]
  const sourceY = source[2]
  const destinationY = destination[2]
  let dx = Math.abs(sourceX - destinationX)
  let dy = Math.abs(sourceY - destinationY)
  boundaries.x.forEach(boundaryX => {
    if (
      (sourceX < boundaryX && destinationX > boundaryX) ||
      (destinationX < boundaryX && sourceX > boundaryX)
    ) {
      dx += boundaryDistance
    }
  })
  boundaries.y.forEach(boundaryY => {
    if (
      (sourceY < boundaryY && destinationY > boundaryY) ||
      (destinationY < boundaryY && sourceY > boundaryY)
    ) {
      dy += boundaryDistance
    }
  })
  return dx + dy
}
