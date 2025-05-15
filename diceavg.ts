type Part = { probability: number; value: number };

function dN(n: number): Part[] {
  return Array.from({ length: n }, (_, i) => ({ probability: 1 / n, value: i + 1 }));
}

function product(lists: Part[][]): Part[][] {
  if (lists.length === 0) return [];

  let res: Part[][] = lists[0].map((el) => [el]);

  for (let i = 1; i < lists.length; i++) {
    const tmp: Part[][] = [];
    for (const r of res) {
      for (const element of lists[i]) {
        tmp.push([...r, element]);
      }
    }
    res = tmp;
  }
  return res;
}

function psum(exps: Part[][]): Part[] {
  const temp: Record<number, number> = {};

  for (const exp of exps) {
    let count = 0;
    let prob = 1.0;
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
  for (const [countStr, prob] of Object.entries(temp)) {
    const count = parseInt(countStr);
    out.push({ value: count, probability: prob });
    total += prob;
  }

  for (const q of out) {
    q.probability /= total;
  }

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
  const roll = Array.from({ length: x >= 1 ? x : 1 }, () => dN(y));
  const out = product(roll);
  const dist = psum(highest(out, z));
  return dist.reduce((partialSum, exp) => partialSum + exp.value * exp.probability, 0); // Calculate mean
};

console.log(xdykhz(2, 20, 1));
console.log(xdykhz(4, 6, 3));
