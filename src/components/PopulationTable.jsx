// 人口テーブル: 横軸=都県、縦軸=西暦(降順)。列をグループ色で塗り分ける。
export default function PopulationTable({ population, prefs, assignment }) {
  const { years, byPref } = population;
  return (
    <div className="table-wrapper">
      <table className="population-table">
        <thead>
          <tr>
            <th className="year-col">西暦</th>
            {prefs.map((p, i) => (
              <th key={p} className={`group-${assignment[i]}`}>
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {years.map((year) => (
            <tr key={year}>
              <th className="year-col">{year}年</th>
              {prefs.map((p, i) => (
                <td key={p} className={`group-${assignment[i]}`}>
                  {byPref[p]?.[year] != null ? byPref[p][year].toLocaleString() : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

