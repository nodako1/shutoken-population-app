// 友好度グルーピング: n都県を最大3グループに分割し、
// グループ内ペアの友好度総和を最大化する(全探索による厳密解)。
//
// 【アルゴリズムの説明】
// ・各県にグループ番号 0/1/2 を割り当てる組合せは 3^n 通り(n=8 で 6561)。
//   この規模なら全探索で厳密解が出せるため、近似アルゴリズムは使わない。
// ・グループ番号の入れ替え(例: {0,1} と {1,0})は同じ分割なので、
//   「県iに使えるラベルは、それまでに使った最大ラベル+1 まで」という
//   制約付き探索(restricted growth string)で重複を除去している。
// ・この問題は重み付きグラフの「最大重みクラスタリング(max-agree partition)」
//   に相当し、一般には NP困難だが、n が小さいので全探索が最適解を保証する。

/** CSVテキストをパースして {prefs, matrix} を返す。'-' は「対称セル or 自分自身」の意味 */
export function parseFriendshipCsv(text) {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((s) => s.trim()));
  const prefs = rows[0].slice(1);
  const n = prefs.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 1; i < rows.length; i++) {
    const rowPref = rows[i][0];
    const r = prefs.indexOf(rowPref);
    for (let j = 1; j < rows[i].length; j++) {
      const c = j - 1;
      // 全角マイナス(−)等が混在しても数値化できるように正規化
      const raw = rows[i][j].replace(/[−ー–]/g, "-");
      if (raw === "-" || raw === "") continue;
      const v = Number(raw);
      if (!Number.isNaN(v) && r !== -1 && r !== c) {
        matrix[r][c] = v;
        matrix[c][r] = v; // 上三角のみ記載のCSVを対称行列に展開
      }
    }
  }
  return { prefs, matrix };
}

/**
 * 最大 maxGroups グループへの分割の厳密解を返す
 * @returns {{ assignment: number[], groups: string[][], total: number }}
 */
export function findBestGrouping(prefs, matrix, maxGroups = 3) {
  const n = prefs.length;
  let bestTotal = -Infinity;
  let bestAssignment = null;
  const assignment = new Array(n).fill(0);

  const dfs = (i, maxLabelUsed, partialSum) => {
    if (i === n) {
      if (partialSum > bestTotal) {
        bestTotal = partialSum;
        bestAssignment = [...assignment];
      }
      return;
    }
    const limit = Math.min(maxLabelUsed + 1, maxGroups - 1);
    for (let g = 0; g <= limit; g++) {
      // 県iをグループgに入れたときの増分(同グループ既存メンバーとの友好度)
      let gain = 0;
      for (let j = 0; j < i; j++) if (assignment[j] === g) gain += matrix[i][j];
      assignment[i] = g;
      dfs(i + 1, Math.max(maxLabelUsed, g), partialSum + gain);
    }
  };
  dfs(0, -1, 0);

  const groups = [];
  const groupTotals = [];
  for (let g = 0; g < maxGroups; g++) {
    const idx = [];
    for (let i = 0; i < n; i++) if (bestAssignment[i] === g) idx.push(i);
    if (idx.length === 0) continue;
    let sub = 0;
    for (let a = 0; a < idx.length; a++)
      for (let b = a + 1; b < idx.length; b++) sub += matrix[idx[a]][idx[b]];
    groups.push(idx.map((i) => prefs[i]));
    groupTotals.push(sub);
  }
  return { assignment: bestAssignment, groups, groupTotals, total: bestTotal };
}

