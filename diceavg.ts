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

function parse(
  text: string,
  sumResult: boolean = false
): Part[][] | Part[] {
  let value = 0,
    count = 0,
    die = 0;
  text = text.trim();

  for (const c of text) {
    if (c >= "0" && c <= "9") {
      value = parseInt(c) + 10 * value;
    } else if (c === "d") {
      count = value;
      value = 0;
    }
  }
  die = value;
  if (count === 0) count = 1;

  const roll = Array.from({ length: count }, () => dN(die));
  const out = product(roll);
  if (sumResult) return psum(out);
  return out;
}

const xdykhz = (x: number, y: number, z: number) => {
  let out = parse(`${x}d${y}`) as Part[][];
  const dist = psum(highest(out, z));
  return dist.reduce((partialSum, exp) => partialSum + exp.value * exp.probability, 0); // Calculate mean
};

console.log(xdykhz(2, 20, 1));
console.log(xdykhz(4, 6, 3));
