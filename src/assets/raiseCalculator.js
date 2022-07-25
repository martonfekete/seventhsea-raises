export const OPTION_KEYS = {
  LEGENDARY: "legendary",
  FIFTEEN: "fifteen",
  PLUSONE: "plusOne",
  EXPLODE: "explode",
  REROLL: "reroll",
  VIVRE: "vivre",
};

export function rollAndCalculate(dice, options) {
  let rolls = [];
  if (options[OPTION_KEYS.LEGENDARY]) {
    --dice;
  }
  rolls = roll_dice(dice, options);
  if (options[OPTION_KEYS.LEGENDARY]) {
    rolls.unshift(10);
  }
  if (options[OPTION_KEYS.PLUSONE]) {
    rolls.map((roll) => (roll < 10 ? ++roll : roll));
  }
  if (rolls.length === 0) {
    return;
  }

  const raises = calculate_raises(rolls, options);
  return raises;
}

function swap(arr, a, b) {
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

function reverse_between(arr, start, end) {
  while (start < end) {
    swap(arr, start, end);
    start++;
    end--;
  }

  return arr;
}

function next_perm(arr, idx) {
  let k = arr.reduce(
    (acc, cur, idx, a) => (a[idx] < a[idx + 1] ? idx : acc),
    -1
  );

  if (k === -1) return undefined;

  let l = arr.reduce((acc, cur, idx, a) =>
    a[k] < a[idx] && idx > k ? idx : acc
  );

  swap(arr, k, l);

  reverse_between(arr, k + 1, arr.length - 1);

  return arr;
}

function showstr(str) {
  // document.getElementById("output").innerHTML += str + "<br>";
}

function roll_d10() {
  return Math.floor(Math.random() * Math.floor(10)) + 1;
}

function explode_dice(count) {
  if (count === 0) {
    return [];
  }

  showstr("Exploding " + count + (count === 1 ? " die!" : " dice!"));

  let rolls = roll_n_dice(count);
  let tens_count = rolls.filter((x) => x === 10).length;

  return rolls.concat(explode_dice(tens_count));
}

function roll_n_dice(count) {
  let rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(roll_d10());
  }
  return rolls;
}

function do_vivre(rolls, options) {
  let changed = 0;
  if (options[OPTION_KEYS.VIVRE]) {
    let skill = parseInt(document.getElementById("joieskill").value);
    for (let i = 0; i < rolls.length; i++) {
      if (rolls[i] <= skill) {
        rolls[i] = 10;
        changed++;
      }
    }

    if (changed > 0) {
      showstr(
        "Joie de Vivre triggered " +
          changed +
          " time" +
          (changed === 1 ? "!" : "s!")
      );
      showstr(rolls);
    }
  }

  return { roll: rolls, changed: changed };
}

function roll_dice(count, options) {
  let rolls = roll_n_dice(count);
  rolls = do_vivre(rolls, options).roll;

  if (options[OPTION_KEYS.REROLL]) {
    let lowest_die = rolls.reduce((acc, curr) => (acc < curr ? acc : curr));
    let newroll = roll_d10();
    rolls[rolls.indexOf(lowest_die)] = newroll;
    rolls = do_vivre(rolls, options).roll;
  }

  if (options[OPTION_KEYS.EXPLODE]) {
    let tens_count = rolls.filter((x) => x === 10).length;
    rolls = rolls.concat(explode_dice(tens_count));

    if (options[OPTION_KEYS.VIVRE]) {
      let vived = do_vivre(rolls);
      rolls = vived.roll;
      while (vived.changed > 0) {
        let sploders = explode_dice(vived.changed);
        let nat_tens = sploders.filter((x) => x === 10).length;
        vived = do_vivre(sploders);
        vived.changed += nat_tens;
        rolls = rolls.concat(vived.roll);
      }
    }
  }

  return rolls;
}

function sum(rolls) {
  if (Number.isInteger(rolls)) {
    return rolls;
  }

  return rolls.reduce((a, b) => a + b);
}

function greedy(rolls, remaining) {
  let toreturn = [];
  let thisgroup = [];
  let raises = 0;
  for (let i = 0; i < remaining.length; i++) {
    let roll = remaining[i];
    if (roll === 10) {
      toreturn.push([10]);
      raises += 1;
      continue;
    }
    thisgroup.push(roll);
    if (sum(thisgroup) >= 10) {
      toreturn.push(thisgroup);
      thisgroup = [];
      raises += 1;
    }
  }

  return {
    groups: toreturn,
    leftover: thisgroup,
    raises: raises,
    rolls,
  };
}

function greedy15(rolls) {
  let toreturn = [];
  let thisgroup = [];
  let raises = 0;
  for (let i = 0; i < rolls.length; i++) {
    let roll = rolls[i];
    thisgroup.push(roll);
    if (sum(thisgroup) >= 15) {
      toreturn.push(thisgroup);
      thisgroup = [];
      raises += 2;
    }
  }
  let tens = greedy(rolls, thisgroup);
  return {
    groups: toreturn.concat(tens.groups),
    leftover: tens.leftover,
    raises: raises + tens.raises,
    rolls,
  };
}

function is_better(newres, best) {
  if (newres.raises > best.raises) {
    return true;
  }

  if (newres.raises === best.raises) {
    return newres.leftover.length > best.leftover.length;
  }

  return false;
}

function min(a, b) {
  if (a < b) return a;

  return b;
}

function is_optimal(result, rolls) {
  //let tens_count = rolls.filter(x => x === 10).length;
  let max_raises = min((rolls.length / 2) | 0, (sum(rolls) / 10) | 0);

  return result.raises === max_raises;
}

function add_tens(result, tens) {
  let toreturn = {};
  toreturn = Object.assign(toreturn, result);
  toreturn.raises += tens.length;
  toreturn.groups = toreturn.groups.concat(tens);

  return toreturn;
}

function remove_ten_pairs(arr) {
  return split(
    arr,
    (x) => (Number.isInteger(x) || x.length === 2) && sum(x) === 10
  );
}

function check_raise_10(roll, best, idx, tens) {
  if (!best.printed) {
    best = add_tens(best, tens);
    best.printed = true;
  }

  for (let i = 0; i < 1000000; i++) {
    let update = false;
    let this_perm = next_perm(roll, idx);
    if (best.optimal === true || this_perm === undefined) {
      best = add_tens(best, tens);
      return best;
    }

    let result = greedy(best.rolls, this_perm);

    if (is_better(result, best)) {
      best = result;
      best.optimal = is_optimal(best, roll);
      best = add_tens(best, tens);
      best.printed = true;
      update = true;
      return best;
    }
    idx++;

    if (update) break;
  }
}

//false first, true second
function split(arr, func) {
  let toreturn = [[], []];

  for (let i = 0; i < arr.length; i++) {
    let elm = arr[i];
    toreturn[func(elm) + 0].push(elm);
  }

  return toreturn;
}

function is_optimal15(result, rolls) {
  // you can never have more raises than you have dice, so "result.raises === rolls.length" is a correct, but not very useful, rule.
  // since getting to that point requires nothing but pairs that add up to at least 15, I think being able to disregard a missing odd-numbered die will help.
  let max_raises = rolls.length - (rolls.length % 2);
  return result.raises === max_raises;
}

function check_raise_15(roll, best, idx) {
  // loadingbar.set(idx);
  if (!best.printed) {
    //handle the case where there's only one permutation
    // print_result(idx, best);
    best.printed = true;
  }

  for (let i = 0; i < 1000000; i++) {
    let this_perm = next_perm(roll, idx);
    if (best.optimal === true || this_perm === undefined) {
      return best;
    }

    let result = greedy15(this_perm);

    if (is_better(result, best)) {
      best = result;
      best.optimal = is_optimal15(best, roll);
      best.printed = true;
    }
    idx++;
  }
}

function find_remove_perfect_tens(rolls) {
  for (let i = 0; i < rolls.length; i++) {
    let thisroll = rolls[i];

    //we had a bug where if thisroll is a 5, this finds the same 5
    //start looking at the next position
    let pair_idx = rolls.indexOf(10 - thisroll, i + 1);

    if (pair_idx !== -1) {
      rolls.splice(i, 1);
      rolls.splice(pair_idx - 1, 1); //hope this is a good assumption
      let ret = find_remove_perfect_tens(rolls);
      ret.push([thisroll, 10 - thisroll]);
      return ret;
    }
  }

  return [];
}

function calculate_raises(rolls, options) {
  let best = { rolls, groups: [], leftover: [], raises: 0 };

  if (options[OPTION_KEYS.FIFTEEN]) {
    best = greedy15(rolls);
    const result = check_raise_15(rolls, best, 0);
    return result;
  }
  // SEPARATE TENS (pairs and naturals)
  let [restOfResults, tens] = remove_ten_pairs(rolls);
  tens = tens.map((x) => [x]); //for consistency
  tens = tens.concat(find_remove_perfect_tens(restOfResults));

  // NO REMAINDERS
  if (restOfResults.length === 0) {
    best.optimal = true;
    best = add_tens(best, tens);
    return best;
  }

  // REMAINDERS
  let remainingResults = new Uint8Array(restOfResults);
  remainingResults.sort();

  best = greedy(rolls, remainingResults);
  const result = check_raise_10(remainingResults, best, 0, tens);
  return result;
}
