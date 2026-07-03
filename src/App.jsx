import { useEffect, useMemo, useState } from "react";
import { getStatsData, shapePopulationData } from "./api/estat.js";
import { parseFriendshipCsv, findBestGrouping } from "./logic/grouping.js";
import { TARGET_PREFS, STATS_DATA_ID, STATS_EXTRA_PARAMS, APP_ID } from "./config.js";
import PopulationTable from "./components/PopulationTable.jsx";
import GroupLegend from "./components/GroupLegend.jsx";
import "./styles.css";

export default function App() {
  const [population, setPopulation] = useState(null); // {years, byPref, unit}
  const [friendship, setFriendship] = useState(null); // {prefs, matrix}
  const [error, setError] = useState(null);

  // 1. e-Stat APIから人口データ取得
  useEffect(() => {
    if (!APP_ID) {
      setError("環境変数 VITE_ESTAT_APP_ID が設定されていません(.env を参照)");
      return;
    }
    getStatsData({ appId: APP_ID, statsDataId: STATS_DATA_ID, extraParams: STATS_EXTRA_PARAMS })
      .then((sd) => setPopulation(shapePopulationData(sd, TARGET_PREFS)))
      .catch((e) => setError(`人口データの取得に失敗しました: ${e.message}`));
  }, []);

  // 2. 友好度CSVの読み込み(public/friendship.csv)
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}friendship.csv`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => setFriendship(parseFriendshipCsv(text)))
      .catch((e) => setError(`友好度CSVの読み込みに失敗しました: ${e.message}`));
  }, []);

  // 3. 友好度総和が最大となるグルーピング(厳密解)
  const grouping = useMemo(
    () => (friendship ? findBestGrouping(friendship.prefs, friendship.matrix, 3) : null),
    [friendship]
  );

  return (
    <main className="container">
      <h1>首都圏 総人口ビューア</h1>
      <p className="description">
        e-Stat API(政府統計の総合窓口)から取得した首都圏1都7県の総人口を、
        友好度データに基づく最適グルーピングで色分けして表示します。
      </p>
      {error && <p className="error">{error}</p>}
      {!error && (!population || !grouping) && <p className="loading">読み込み中…</p>}
      {population && grouping && (
        <>
          <GroupLegend grouping={grouping} />
          <PopulationTable
            population={population}
            prefs={friendship.prefs}
            assignment={grouping.assignment}
          />
          <p className="credit">
            出典: 政府統計の総合窓口(e-Stat)のAPI機能により取得
            {population.unit && ` / 単位: ${population.unit}`}
          </p>
        </>
      )}
    </main>
  );
}

