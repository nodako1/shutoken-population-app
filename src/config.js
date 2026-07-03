// アプリ設定
// 首都圏 = 首都圏整備法における1都7県(東京・神奈川・埼玉・千葉・茨城・栃木・群馬・山梨)
// 参考: https://elaws.e-gov.go.jp/document?lawid=331AC0000000083 (首都圏整備法)
export const TARGET_PREFS = [
  "東京都",
  "神奈川県",
  "埼玉県",
  "千葉県",
  "茨城県",
  "栃木県",
  "群馬県",
  "山梨県",
];

// e-Stat 統計表ID: 社会・人口統計体系 都道府県データ 基礎データ
// getStatsList を課題ヒントの「全国総人口に占める人口割合」で検索して特定した。
// (この統計表の cat01 に A192001_全国総人口に占める人口割合 が含まれており、
//  総人口そのものは A1101_総人口)
export const STATS_DATA_ID = "0000010101";

// getStatsData への絞り込みパラメータ
// - cdCat01: A1101_総人口
// - cdArea: 対象8都県の地域コード(JIS X 0401の都道府県コード+000)
//   08000:茨城 09000:栃木 10000:群馬 11000:埼玉 12000:千葉 13000:東京 14000:神奈川 19000:山梨
export const STATS_EXTRA_PARAMS = {
  cdTab: "00001",
  cdCat01: "A1101",
  cdArea: "08000,09000,10000,11000,12000,13000,14000,19000",
};

export const APP_ID = import.meta.env.VITE_ESTAT_APP_ID ?? "";
