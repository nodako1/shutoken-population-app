// e-Stat API (ver 3.0) クライアント
// 仕様書: https://www.e-stat.go.jp/api/api-info/e-stat-manual3-0
//   - 統計データ取得(JSON): /rest/3.0/app/json/getStatsData?<params>
//   - HTTPメソッドは GET のみ
//
// appId は .env(VITE_ESTAT_APP_ID)から読む。リポジトリにはコミットしない。

// ※ statsDataId は getStatsList(検索語:「全国総人口に占める人口割合」等)で
//    特定したものを config.js に定義している。

const DIRECT_BASE = "https://api.e-stat.go.jp";
const PROXY_BASE = "/api-estat"; // vite.config.js の server.proxy 参照

function buildUrl(base, path, params) {
  const q = new URLSearchParams(params).toString();
  return `${base}${path}?${q}`;
}

async function getJson(path, params) {
  // まず直接アクセス(公式仕様でJSONエンドポイントはCORS対応)。
  // 失敗時は開発用プロキシへフォールバック。
  try {
    const res = await fetch(buildUrl(DIRECT_BASE, path, params));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    const res = await fetch(buildUrl(PROXY_BASE, path, params));
    if (!res.ok) throw new Error(`e-Stat API error: HTTP ${res.status}`);
    return await res.json();
  }
}

/** 統計データ取得 */
export async function getStatsData({ appId, statsDataId, extraParams = {} }) {
  const json = await getJson("/rest/3.0/app/json/getStatsData", {
    appId,
    statsDataId,
    metaGetFlg: "Y",
    ...extraParams,
  });
  const root = json?.GET_STATS_DATA;
  const status = root?.RESULT?.STATUS;
  if (status !== 0) {
    throw new Error(root?.RESULT?.ERROR_MSG ?? "e-Stat APIからエラーが返されました");
  }
  return root.STATISTICAL_DATA;
}

/**
 * STATISTICAL_DATA から {years(降順), byPref: {都県名: {年: 人口}}} に整形する。
 * CLASS_INF(メタ情報)で area/time のコード→名称を解決するため、
 * 統計表の種類が変わっても動くようにしている。
 */
export function shapePopulationData(statisticalData, targetPrefs) {
  const classObjs = statisticalData.CLASS_INF.CLASS_OBJ;
  const asArray = (x) => (Array.isArray(x) ? x : [x]);

  const findMap = (id) => {
    const obj = classObjs.find((o) => o["@id"] === id);
    const map = new Map();
    if (obj) for (const c of asArray(obj.CLASS)) map.set(c["@code"], c["@name"]);
    return map;
  };
  const areaMap = findMap("area");
  const timeMap = findMap("time");

  const values = asArray(statisticalData.DATA_INF.VALUE);
  const byPref = {};
  const yearSet = new Set();

  for (const v of values) {
    const areaName = (areaMap.get(v["@area"]) ?? "").trim();
    // 「東京都」「神奈川県」など対象8都県のみ拾う
    const pref = targetPrefs.find((p) => areaName === p);
    if (!pref) continue;
    const timeName = timeMap.get(v["@time"]) ?? v["@time"];
    const yearMatch = String(timeName).match(/(\d{4})/);
    if (!yearMatch) continue;
    const year = Number(yearMatch[1]);
    const num = Number(v["$"]);
    if (Number.isNaN(num)) continue; // 「-」等の欠測値はスキップ
    (byPref[pref] ??= {})[year] = num;
    yearSet.add(year);
  }

  const years = [...yearSet].sort((a, b) => b - a); // 西暦は降順
  return { years, byPref, unit: values[0]?.["@unit"] ?? "" };
}

