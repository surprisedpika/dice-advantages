interface Part {
  probability: number;
  value: number;
}

function psum(exps: Part[][]): Part[] {
  const temp: Record<number, number> = {};

  for (const exp of exps) {
    let count = 0;
    let prob = 1;
    for (const part of exp) {
      count += part.value;
      prob *= part.probability;
    }
    if (!(count in temp)) temp[count] = 0;
    temp[count] += prob;
  }

  const result: Part[] = [];
  let total = 0;

  for (const [count, prob] of Object.entries(temp)) {
    result.push({ value: Number(count), probability: prob });
    total += prob;
  }

  result.forEach((q) => (q.probability /= total));
  return result;
}

function highest(
  expressions: Part[][],
  numToKeep: number,
  advantage: boolean
): Part[][] {
  const result: Part[][] = [];
  for (const expression of expressions) {
    const temp: Part[] = expression.slice(0, numToKeep);
    temp.sort((a, b) => a.value - b.value);
    for (let i = numToKeep; i < expression.length; i++) {
      if (
        advantage
          ? expression[i].value > temp[0].value
          : expression[i].value < temp[0].value
      )
        temp[0] = expression[i];
    }
    result.push(temp);
  }
  return result;
}

const advantage_mean = (
  numDice: number,
  sides: number,
  numToKeep: number,
  advantage: boolean
) => {
  // Generate individual rolls
  const row = Array.from({ length: sides }, (_, i) => ({
    probability: 1 / sides,
    value: i + 1,
  }));
  const roll = Array.from({ length: numDice }, () => [...row]);
  // Generate all combinations
  const out = roll.reduce<Part[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
    [[]]
  );
  // Generate distribution
  const dist = psum(highest(out, numToKeep, advantage));
  // Calculate mean
  return dist.reduce(
    (partialSum, exp) => partialSum + exp.value * exp.probability,
    0
  );
};

console.log(advantage_mean(2, 20, 1, true)); // 13.825
console.log(advantage_mean(2, 20, 1, false)); // 7.175
console.log(advantage_mean(4, 6, 3, true)); // 12.2445987654321
