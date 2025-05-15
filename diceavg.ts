interface Part { probability: number; value: number };

const dN = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ probability: 1 / n, value: i + 1 }));

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
    if (!(count in temp)) {
      temp[count] = 0;
    }
    temp[count] += prob;
  }

  const out: Part[] = [];
  let total = 0;

  for (const [count, prob] of Object.entries(temp)) {
    out.push({ value: Number(count), probability: prob });
    total += prob;
  }

  out.forEach((q) => q.probability /= total);
  return out;
}

function highest(exps: Part[][], N: number): Part[][] {
  const out: Part[][] = [];
  for (const exp of exps) {
    let temp: Part[] = [];
    for (const part of exp) {
      if (temp.length < N) {
        temp.push(part);
      } else {
        if (part.value > temp[0].value) {
          temp[0] = part;
        }
      }
      temp.sort((a, b) => a.value - b.value);
    }
    out.push(temp);
  }
  return out;
}

const xdykhz = (x: number, y: number, z: number) => {
  // Generate individual rolls
  const roll = Array.from({ length: x >= 1 ? x : 1 }, () => dN(y));
  // Generate all combinations
  const out = product(roll);
  // Generate distribution
  const dist = psum(highest(out, z));
  // Calculate mean
  return dist.reduce(
    (partialSum, exp) => partialSum + exp.value * exp.probability,
    0
  );
};

console.log(xdykhz(2, 20, 1)); // 13.825
console.log(xdykhz(4, 6, 3)); // 12.2445987654321
