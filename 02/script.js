const startTime = performance.now();

const readline = require("readline");
const fs = require("fs");

const fileStream = fs.createReadStream("input");

const rl = readline.createInterface({
  input: fileStream,
});

let [sum, sum2] = [0, 0];
const totalDiceInBag = { red: 12, green: 13, blue: 14 };

rl.on("line", (game) => {
  let gameId = Number(game.substring(5).split(":")[0]);
  let [possible, power] = isGamePossible(game);
  if (possible) sum += gameId;
  sum2 += power;
});

function isGamePossible(game) {
  const minimumDiceNeeded = [];
  let possible = true;
  let minNeeded = [];
  sets = game.split(": ")[1].split("; ");
  sets.forEach((set) => {
    parts = set.split(", ");
    parts.forEach((part) => {
      let numberOfDice = Number(part.split(" ")[0]);
      let diceColor = part.split(" ")[1];
      if (numberOfDice > totalDiceInBag[diceColor]) possible = false;
      if (
        !minimumDiceNeeded[diceColor] ||
        minimumDiceNeeded[diceColor] < numberOfDice
      )
        minimumDiceNeeded[diceColor] = numberOfDice;
    });
  });

  // we also need to return the power of the minimum dice needed
  return [
    possible,
    minimumDiceNeeded["red"] *
      minimumDiceNeeded["blue"] *
      minimumDiceNeeded["green"],
  ];
}

rl.on("close", () => {
  console.log("answer:", sum, sum2);
  const endTime = performance.now();
  const runtimeMs = endTime - startTime;
  console.log(`runtime: ${runtimeMs} ms`);
});
