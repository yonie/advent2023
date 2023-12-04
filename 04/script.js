const startTime = performance.now()

const readline = require('readline')
const fs = require('fs')

const fileStream = fs.createReadStream('input')

const rl = readline.createInterface({
  input: fileStream
})

let [sum, sum2] = [0, 0]
let cards = []

rl.on('line', line => {
  cards.push(line)
})

let reward = []
let cardStack = []

rl.on('close', () => {
  // first, setup array of win points per card
  cards.forEach(card => {
    let cardId = card.split(':')[0].match(/(\d)+/)[0]
    reward[cardId] = calculateReward(card)
    cardStack[cardId] = 1
  })

  // then, start working through the cards
  processCards()

  console.log('answer:', sum, sum2)
  const endTime = performance.now()
  const runtimeMs = endTime - startTime
  console.log(`runtime: ${runtimeMs} ms`)
})

function processCards () {
  for (let cardId = 1; cardId < cardStack.length; cardId++) {
    let cardsWon = reward[cardId]
    let multiplier = cardStack[cardId]

    // keep track for the answer
    sum2 += multiplier

    for (let n = cardId + 1; n < cardId + cardsWon + 1; n++) {
      // we need to multiply upcoming card amounts that we are winning
      cardStack[n] += multiplier
    }
  }
}

function calculateReward (card) {
  let points = 0
  let copies = 0

  card = card.replaceAll('  ', ' ')
  const winningNumbers = card.split(': ')[1].split(' | ')[0].split(' ')
  const myNumbers = card.split('| ')[1].split(' ')

  myNumbers.forEach(number => {
    if (winningNumbers.includes(number)) {
      if (points == 0) points = 1
      else points *= 2
      copies += 1
    }
  })

  sum += points
  return copies
}
