interface Part {
  probability: number;
  value: number;
}

const probabilityDistSummedValues = (exps: Part[][]) => {
  const totals = new Map<number, number>();

  for (const exp of exps) {
    const sum = exp.reduce(
      (acc, part) => {
        acc.value += part.value;
        acc.probability *= part.probability;
        return acc;
      },
      { value: 0, probability: 1 }
    );

    totals.set(sum.value, (totals.get(sum.value) || 0) + sum.probability);
  }

  const totalProb = Array.from(totals.values()).reduce((a, b) => a + b, 0);

  return Array.from(totals.entries()).map(([value, prob]) => ({
    value,
    probability: prob / totalProb,
  }));
};

const highest = (
  expressions: Part[][],
  numToKeep: number,
  advantage: boolean
) => {
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
  const dist = probabilityDistSummedValues(highest(out, numToKeep, advantage));
  // Calculate mean
  return dist.reduce(
    (partialSum, exp) => partialSum + exp.value * exp.probability,
    0
  );
};

console.log(advantage_mean(2, 20, 1, true)); // 13.825
console.log(advantage_mean(2, 20, 1, false)); // 7.175
console.log(advantage_mean(4, 6, 3, true)); // 12.2445987654321

export default advantage_mean;