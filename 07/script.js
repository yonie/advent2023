const startTime = performance.now()

const rl = require('readline').createInterface({
  input: require('fs').createReadStream('test')
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
  // sort hands to determine rank
  hands.sort(function (a, b) {
    let typeA = a.getType()
    let typeB = b.getType()
    if (typeA !== typeB) return typeA - typeB

    let num = 0
    while (num < 5) {
      let cardA = a.getCard(num)
      let cardB = b.getCard(num)
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

    console.log(
      'Rank: ' +
        rank +
        ' Cards: ' +
        hands[num].getCards() +
        ' Sorted: ' + hands[num].getCardsSorted() +
        ' Hand type: ' +
        hands[num].getType() + 
        ' Bid: ' + hands[num].getBid()
    )

    sum = sum + (rank * hands[num].getBid())
  }

  console.log("Sum: ", sum)
  const endTime = performance.now()
  const runtimeMs = endTime - startTime
  console.log(`runtime: ${runtimeMs} ms`)
})

function Hand (cards, bid) {
  this._cards = cards
  this._cardsSorted = cards
    .split('')
    .sort(function (a, b) {
      return camelCards[b] - camelCards[a]
    })
    .join('')
  this._bid = bid

  this.getCard = function (num) {
    return camelCards[this._cards.charAt(num)] ?? null
  }

  this.getCards = function () {
    return this._cards
  }

  this.getCardsSorted = function () {
    return this._cardsSorted
  }

  this.getBid = function () {
    return this._bid
  }

  this.getType = function () {
    if (this._cardsSorted.match(/(.)\1{4}/)) {
      return handTypes.fiveOfAKind
    }
    if (this._cardsSorted.match(/(.)\1{3}/)) {
      return handTypes.fourOfAKind
    }
    if (this._cardsSorted.match(/(.)\1{2}(.)\2{1}|(.)\3{1}(.)\4{2}/)) {
      return handTypes.fullHouse
    }
    if (this._cardsSorted.match(/(.)\1{2}/)) {
      return handTypes.threeOfAKind
    }
    if (this._cardsSorted.match(/(.)\1{1}.?(.)\2{1}/)) {
      return handTypes.twoPair
    }
    if (this._cardsSorted.match(/(.)\1{1}/)) {
      return handTypes.onePair
    }
    return handTypes.highCard
  }
}
