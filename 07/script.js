const startTime = performance.now()

const rl = require('readline').createInterface({
  input: require('fs').createReadStream('input')
})

let hands = []

let handTypes = {
  fiveOfAKind: 7,
  fourOfAKind: 6,
  fullHouse: 5,
  threeOfAKind: 4,
  twoPair: 3,
  onePair: 2,
  highCard: 1
}

let camelCards = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2
}

rl.on('line', line => {
  hands.push(new Hand(line.split(' ')[0], line.split(' ')[1]))
})

rl.on('close', () => {
  let useJokers = true
  console.log("Using jokers: ",useJokers)

  // sort hands to determine rank
  hands.sort(function (a, b) {
    let typeA = getType(a.getCards())
    let typeB = getType(b.getCards())
    if (useJokers) {
      typeA = getBestTypeUsingJokers(a.getCards())
      typeB = getBestTypeUsingJokers(b.getCards())
    }
    if (typeA !== typeB) return typeA - typeB

    let num = 0
    while (num < 5) {
      let cardA = a.getCard(num)
      let cardB = b.getCard(num)
      if (useJokers) {
        if (cardA == 11) cardA = 1
        if (cardB == 11) cardB = 1
      }
      if (cardA != cardB) return cardA - cardB
      else num++
    }

    // this is off spec
    throw new Error('found two identical cards.')
  })

  let sum = 0

  for (let num = 0; num < hands.length; num++) {
    // rank is based on sorted position
    let rank = num + 1
    let cards = hands[num].getCards()

    console.log(
      'Rank: ' +
        rank +
        ' Cards: ' +
        cards +
        ' Hand type: ' +
        getType(cards) +
        (useJokers? " Best jokered hand type: " + getBestTypeUsingJokers(cards) : "") +
        ' Bid: ' +
        hands[num].getBid()
    )

    sum = sum + rank * hands[num].getBid()
  }

  console.log('Sum: ', sum)
  const endTime = performance.now()
  const runtimeMs = endTime - startTime
  console.log(`runtime: ${runtimeMs} ms`)
})

function Hand (cards, bid) {
  this._cards = cards
  this._bid = bid

  this.getCard = function (num) {
    return camelCards[this._cards.charAt(num)] ?? null
  }

  this.getCards = function () {
    return this._cards
  }

  this.getBid = function () {
    return this._bid
  }
}

function getType (cards) {
  if (!cards) throw new Error('Missing input.')
  let cardsSorted = cards
    .split('')
    .sort(function (a, b) {
      return camelCards[a] - camelCards[b]
    })
    .join('')

  if (cardsSorted.match(/(.)\1{4}/)) {
    return handTypes.fiveOfAKind
  }
  if (cardsSorted.match(/(.)\1{3}/)) {
    return handTypes.fourOfAKind
  }
  if (cardsSorted.match(/(.)\1{2}(.)\2{1}|(.)\3{1}(.)\4{2}/)) {
    return handTypes.fullHouse
  }
  if (cardsSorted.match(/(.)\1{2}/)) {
    return handTypes.threeOfAKind
  }
  if (cardsSorted.match(/(.)\1{1}.?(.)\2{1}/)) {
    return handTypes.twoPair
  }
  if (cardsSorted.match(/(.)\1{1}/)) {
    return handTypes.onePair
  }
  return handTypes.highCard
}

function getBestTypeUsingJokers (cards) {
  if (!cards) throw new Error('Missing input.')

  let bestType = 0

  for (card in camelCards) {
    let cardsSorted = cards
      .replaceAll('J', card)
      .split('')
      .sort(function (a, b) {
        return camelCards[a] - camelCards[b]
      })
      .join('')

    let foundType

    if (cardsSorted.match(/(.)\1{4}/)) {
      foundType = handTypes.fiveOfAKind
    }
    if (!foundType && cardsSorted.match(/(.)\1{3}/)) {
      foundType = handTypes.fourOfAKind
    }
    if (!foundType && cardsSorted.match(/(.)\1{2}(.)\2{1}|(.)\3{1}(.)\4{2}/)) {
      foundType = handTypes.fullHouse
    }
    if (!foundType && cardsSorted.match(/(.)\1{2}/)) {
      foundType = handTypes.threeOfAKind
    }
    if (!foundType && cardsSorted.match(/(.)\1{1}.?(.)\2{1}/)) {
      foundType = handTypes.twoPair
    }
    if (!foundType && cardsSorted.match(/(.)\1{1}/)) {
      foundType = handTypes.onePair
    }
    if (!foundType) foundType = handTypes.highCard

    if (!bestType || foundType > bestType) {
      bestType = foundType
    }
  }
  return bestType
}
