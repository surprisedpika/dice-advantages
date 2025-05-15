interface Part {
  probability: number;
  value: number;
}

function product(lists: Part[][]): Part[][] {
  if (lists.length === 0) return [];
  let result: Part[][] = lists[0].map((el) => [el]);

  for (let i = 1; i < lists.length; i++) {
    const temp: Part[][] = [];
    for (const res of result) {
      for (const element of lists[i]) {
        temp.push([...res, element]);
      }
    }
    result = temp;
  }

  return result;
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

function highest(expressions: Part[][], N: number, advantage: boolean = true): Part[][] {
  const result: Part[][] = [];
  for (const expression of expressions) {
    const temp: Part[] = expression.slice(0, N);
    temp.sort((a, b) => a.value - b.value);
    for (let i = N; i < expression.length; i++) {
      if (advantage) {
        if (expression[i].value > temp[0].value) temp[0] = expression[i];
      } else {
        if (expression[i].value < temp[0].value) temp[0] = expression[i];
      }
    }
    result.push(temp);
  }
  return result;
}

const advantage_mean = (x: number, y: number, z: number, advantage: boolean = true) => {
  // Generate individual rolls
  const row = Array.from({ length: y }, (_, i) => ({
    probability: 1 / y,
    value: i + 1,
  }));
  const roll = Array.from({ length: x }, () => [...row]);
  // Generate all combinations
  const out = product(roll);
  // Generate distribution
  const dist = psum(highest(out, z, advantage));
  // Calculate mean
  return dist.reduce(
    (partialSum, exp) => partialSum + exp.value * exp.probability,
    0
  );
};

console.log(advantage_mean(2, 20, 1)); // 13.825
console.log(advantage_mean(2, 20, 1, false)); // 7.175
console.log(advantage_mean(4, 6, 3)); // 12.2445987654321
