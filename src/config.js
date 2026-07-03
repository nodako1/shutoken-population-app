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

// e-Stat 統計表ID。
// getStatsList を「全国総人口に占める人口割合」等で検索して特定する。
// TODO: appId取得後に実際のAPI検索で確定させる
export const STATS_DATA_ID = "REPLACE_ME";

// getStatsData への絞り込みパラメータ(統計表確定後に調整)
export const STATS_EXTRA_PARAMS = {};

export const APP_ID = import.meta.env.VITE_ESTAT_APP_ID ?? "";

