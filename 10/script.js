const startTime = performance.now()

const rl = require('readline').createInterface({
  input: require('fs').createReadStream('input')
})

const maze = []

rl.on('line', line => {
  maze.push(line)
})

rl.on('close', () => {
  const startPos = getStartPosition()
  let step = 1
  const pos1 = { x: 38, y: 16 }
  const pos2 = { x: 36, y: 16 }
  const lastpos1 = {}
  const lastpos2 = {}
  lastpos1.x = startPos.x
  lastpos1.y = startPos.y
  lastpos2.x = startPos.x
  lastpos2.y = startPos.y
  while (true) {
    const delta1 = getNextPosition(pos1, lastpos1)
    const delta2 = getNextPosition(pos2, lastpos2)
    lastpos1.x = pos1.x
    lastpos1.y = pos1.y
    lastpos2.x = pos2.x
    lastpos2.y = pos2.y
    pos1.x += delta1[0]
    pos1.y += delta1[1]
    pos2.x += delta2[0]
    pos2.y += delta2[1]
    step++
    console.log('step', step)
    console.log('new location pos1:', pos1, 'char is', maze[pos1.y][pos1.x])
    console.log('new location pos2:', pos2, 'char is', maze[pos2.y][pos2.x])
    if (pos1.x === pos2.x && pos1.y === pos2.y) break
  }
  const endTime = performance.now()
  const runtime = endTime - startTime
  console.log(`runtime: ${runtime} ms`)
})

function getNextPosition (pos, lastpos) {
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
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[0].length; x++) {
      if (maze[y][x] === 'S') return { x: x, y: y }
    }
  }
}
