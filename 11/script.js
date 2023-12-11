const startTime = performance.now()

const file = 'input'

const rl = require('readline').createInterface({
  input: require('fs').createReadStream(file)
})

const universe = []

rl.on('line', line => {
  universe.push(line)
})

rl.on('close', () => {
  const expandedUniverse = expandUniverse(universe)
  const galaxies = findGalaxies(expandedUniverse)

  let sumDistance = 0
  for (let indexA = 0; indexA < galaxies.length; indexA++) {
    for (let indexB = 0; indexB < galaxies.length; indexB++) {
      if (indexA === indexB) continue
      sumDistance += calculateShortestDistance(
        galaxies[indexA],
        galaxies[indexB]
      )
    }
  }
  console.log('answer 1', sumDistance / 2)
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

function expandUniverse (universe) {
  const expandedUniverse = []

  // vertical expansion
  for (let y = 0; y < universe.length; y++) {
    expandedUniverse.push(universe[y])
    if (universe[y].split('').every(val => val === '.')) {
      expandedUniverse.push(universe[y])
    }
  }

  // horizontal expansion
  const expandX = []
  for (let x = 0; x < universe[0].length; x++) {
    let alldots = true
    for (let y = 0; y < universe.length; y++) {
      if (universe[y].charAt(x) !== '.') alldots = false
    }
    if (alldots) {
      expandX.push(x)
    }
  }
  let dx = 0
  expandX.forEach(x => {
    for (let y = 0; y < expandedUniverse.length; y++) {
      expandedUniverse[y] =
        expandedUniverse[y].substring(0, x + dx) +
        '.' +
        expandedUniverse[y].substring(x + dx)
    }
    dx++
  })

  return expandedUniverse
}

function calculateShortestDistance (galA, galB) {
  const x1 = galA[1]
  const x2 = galB[1]
  const y1 = galA[2]
  const y2 = galB[2]
  const dx = Math.abs(x1 - x2)
  const dy = Math.abs(y1 - y2)
  return dx + dy
}
