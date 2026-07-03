// グルーピング結果の凡例(グループ構成と友好度合計を表示)
export default function GroupLegend({ grouping }) {
  return (
    <section className="legend">
      <h2>友好度グルーピング結果(友好度合計: {grouping.total})</h2>
      <ul>
        {grouping.groups.map((members, g) => (
          <li key={g}>
            <span className={`swatch group-${g}`} aria-hidden="true" />
            グループ{g + 1}: {members.join("、")}
            (グループ内友好度: {grouping.groupTotals[g]})
          </li>
        ))}
      </ul>
    </section>
  );
}

