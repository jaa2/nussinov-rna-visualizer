enum Backtrace {
  Bifurcate,
  Left,
  Down,
  Matched,
  Unmatched,
}

function backtrack(bt: [Backtrace, number][][], pairs: [number, number][], i: number, j: number) {
  if (i < j) {
    const back: Backtrace = bt[i][j][0];
    if (back === Backtrace.Matched) {
      pairs.push([i, j]);
      backtrack(bt, pairs, i + 1, j - 1);
    } else if (back === Backtrace.Left) {
      backtrack(bt, pairs, i, j - 1);
    } else if (back === Backtrace.Down) {
      backtrack(bt, pairs, i + 1, j);
    } else if (back === Backtrace.Bifurcate) {
      const k = bt[i][j][1];
      backtrack(bt, pairs, i, k);
      backtrack(bt, pairs, k + 1, j);
    } else if (back === Backtrace.Unmatched) {
      backtrack(bt, pairs, i + 1, j - 1);
    }
  }
}

export default function nussinov(rna: string, pairs: Set<string> = new Set(['AU', 'UA', 'GC', 'CG'])) {
  const n = rna.length;
  const dp: number[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => 0));
  const bt: [Backtrace, number][][] = Array.from(
    { length: n },
    () => Array.from({ length: n }, () => [Backtrace.Unmatched, 0]),
  );

  for (let j = 0; j < n; j += 1) {
    for (let i = j - 1; i >= 0; i -= 1) {
      let m = dp[i + 1][j - 1];
      let back: [Backtrace, number] = [Backtrace.Unmatched, 0];
      if (pairs.has(rna.charAt(i) + rna.charAt(j))) {
        back = [Backtrace.Matched, 0];
        m += 1;
      }

      if (dp[i + 1][j] > m) {
        back = [Backtrace.Down, 0];
        m = dp[i + 1][j];
      } else if (dp[i][j - 1] > m) {
        back = [Backtrace.Left, 0];
        m = dp[i][j - 1];
      }

      for (let k = i + 1; k < j; k += 1) {
        if (dp[i][k] + dp[k + 1][j] > m) {
          back = [Backtrace.Bifurcate, k];
          m = dp[i][k] + dp[k + 1][j];
        }
      }

      dp[i][j] = m;
      bt[i][j] = back;
    }
  }

  const indexPairs: [number, number][] = [];
  backtrack(bt, indexPairs, 0, n - 1);
  return indexPairs;
}
