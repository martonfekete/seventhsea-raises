export function rollAndRaise(dice, options = {}) {
  const diceCount = options.legendary ? dice - 1 : dice;
  let results = roll(diceCount);
  if (options.legendary) {
    results.unshift(10);
  }
  if (options.explode) {
    results = explode(results);
  }
  const simpleRaises = Math.floor(
    results.reduce((res, curr) => (curr += res), 0) / 10
  );
  if (options.fifteens) {
    const doubledSimpleRaises = Math.floor(
      (results.reduce((res, curr) => (curr += res), 0) * 2) / 15
    );
    return doubledSimpleRaises > simpleRaises
      ? doubledSimpleRaises
      : simpleRaises;
  }
  return simpleRaises;
}

function roll(dice) {
  const results = [];
  for (let i = 0; i < dice; i++) {
    results.push(Math.floor(Math.random() * 10 + 1));
  }
  results.sort((a, b) => b - a);
  return results;
}

function explode(results = [], i = 0) {
  if (!results.includes(10)) {
    return results;
  }
  while (results.includes(10)) {
    i++;
    results.shift();
    results.push(Math.floor(Math.random() * 10 + 1));
    results.sort((a, b) => b - a);
  }
  for (let j = 0; j < i; j++) {
    results.unshift(10);
  }
  return results;
}
