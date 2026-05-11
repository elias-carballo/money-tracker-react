export default function TransactionList({
  grouped,
  collapsedMonths,
  setCollapsedMonths,
  onEdit,
  onDelete
}) {
  return (
    <ul>
      {Object.entries(grouped)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([month, items]) => (
          <li key={month}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() =>
                  setCollapsedMonths((prev) => ({
                    ...prev,
                    [month]: !prev[month],
                  }))
                }
                style={{ cursor: "pointer", padding: "5px 10px" }}
              >
                {collapsedMonths[month] ? "▶" : "▼"}
              </button>
              <h3 style={{ margin: 0 }}>{month}</h3>
            </div>

            {!collapsedMonths[month] && (
              <ul>
                {[...items].reverse().map((mov) => (
                  <li
                    key={mov.id}
                    style={{
                      padding: "8px 12px",
                      margin: "5px 0",
                      borderRadius: "5px",
                      backgroundColor:
                        mov.type === "ingreso" ? "#d4edda" : "#f8d7da",
                      color:
                        mov.type === "ingreso" ? "#155724" : "#721c24",
                      listStyleType: "none",
                    }}
                  >
                    {mov.type} - ${mov.amount} ({mov.category})
                    <button onClick={() => onEdit(mov)}>✏️</button>
                    <button onClick={() => onDelete(mov.id)}>❌</button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
    </ul>
  );
}