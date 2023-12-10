const startTime = performance.now()

const file = 'input'

const rl = require('readline').createInterface({
  input: require('fs').createReadStream(file)
})

const maze = []
const shadowMaze = []

rl.on('line', line => {
  maze.push(line)
})

rl.on('close', () => {
  // hardcoded start pos. see below
  let currentPos
  if (file.startsWith('input')) currentPos = { x: 38, y: 16 }
  else if (file.startsWith('test2')) currentPos = { x: 3, y: 0 }
  const startPos = getStartPosition()

  // we start counting at step 1 because we are hardcoding the first step.
  let stepsTravelled = 1
  const lastpos = {}
  lastpos.x = startPos.x
  lastpos.y = startPos.y

  while (true) {
    // contains only the travelled path
    shadowMaze[lastpos.y][lastpos.x] = maze[lastpos.y][lastpos.x]

    const vector = getNextStepVector(currentPos, lastpos)
    lastpos.x = currentPos.x
    lastpos.y = currentPos.y
    currentPos.x += vector[0]
    currentPos.y += vector[1]
    stepsTravelled++

    // check if we are done with our full loop
    if (currentPos.x === startPos.x && currentPos.y === startPos.y) {
      // update one final time
      shadowMaze[lastpos.y][lastpos.x] = maze[lastpos.y][lastpos.x]
      break
    }
  }
  console.log('first answer:', stepsTravelled / 2)

  let sumTiles = 0

  shadowMaze.forEach(row => {
    let tilesInRow = 0
    const mazeRow = row.join('')
    // keeps track if we are in the loop or not
    let isInLoop = false
    for (let c = 0; c < mazeRow.length; c++) {
      if (mazeRow[c].match(/[F|7]/)) {
        // detected an edge, switch
        isInLoop = !isInLoop
      } else if (isInLoop && mazeRow[c].match(/[·S]/)) {
        // note: we are ignoring S as it appears as entry and exit in the same row
        tilesInRow++
      }
    }
    sumTiles += tilesInRow
  })
  console.log('second answer:', sumTiles)
  const endTime = performance.now()
  const runtime = endTime - startTime
  console.log(`runtime: ${runtime} ms`)
})

function getNextStepVector (pos, lastpos) {
  // came from below, moving up
  if (maze[pos.y][pos.x] === '|' && lastpos.y === pos.y + 1) return [0, -1]
  // from left moving up
  if (maze[pos.y][pos.x] === 'J' && lastpos.x === pos.x - 1) return [0, -1]
  // from right moving up
  if (maze[pos.y][pos.x] === 'L' && lastpos.x === pos.x + 1) return [0, -1]
  // came from above, moving down
  if (maze[pos.y][pos.x] === '|' && lastpos.y === pos.y - 1) return [0, 1]
  // from left moving down
  if (maze[pos.y][pos.x] === '7' && lastpos.x === pos.x - 1) return [0, 1]
  // from right moving down
  if (maze[pos.y][pos.x] === 'F' && lastpos.x === pos.x + 1) return [0, 1]
  // came from right, moving left
  if (maze[pos.y][pos.x] === '-' && lastpos.x === pos.x + 1) return [-1, 0]
  // from below moving left
  if (maze[pos.y][pos.x] === '7' && lastpos.y === pos.y + 1) return [-1, 0]
  // from above moving left
  if (maze[pos.y][pos.x] === 'J' && lastpos.y === pos.y - 1) return [-1, 0]
  // came from left, moving right
  if (maze[pos.y][pos.x] === '-' && lastpos.x === pos.x - 1) return [1, 0]
  // from below moving right
  if (maze[pos.y][pos.x] === 'F' && lastpos.y === pos.y + 1) return [1, 0]
  // from above moving right
  if (maze[pos.y][pos.x] === 'L' && lastpos.y === pos.y - 1) return [1, 0]
  throw new Error('Got lost in maze.')
}

function getStartPosition () {
  let startpos = {}
  for (let searchY = 0; searchY < maze.length; searchY++) {
    for (let searchX = 0; searchX < maze[0].length; searchX++) {
      if (maze[searchY][searchX] === 'S') startpos = { x: searchX, y: searchY }
      if (!shadowMaze[searchY]) shadowMaze[searchY] = []
      shadowMaze[searchY] = maze[searchY].replaceAll(/[LF7|J.-]/g, '·').split('')
    }
  }
  return startpos
}
