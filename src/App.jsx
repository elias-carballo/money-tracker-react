import { useState, useEffect } from "react";
import { groupByMonth } from "./utils/groupByMonth";
import { getFilteredTransactions } from "./utils/filterTransactions";

function App() {
  const incomeCategories = ["salario", "regalo", "extra", "reintegros"];
  const expenseCategories = ["mensuales", "reparaciones/mantenimiento", "compras de una vez", "cafe"];
  
  const [typeFilter, setTypeFilter] = useState("todos");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [editingId, setEditingId] = useState(null);
  const [collapsedMonths, setCollapsedMonths] = useState({});
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("ingreso");
  const [category, setCategory] = useState("salario");
  
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);
  
  useEffect(() => {
  if (typeFilter === "todos") return;

  const validCategories =
    typeFilter === "ingreso" ? incomeCategories : expenseCategories;

  if (!validCategories.includes(categoryFilter)) {
    setCategoryFilter("todas");
  }
}, [typeFilter]);

  const currentCategories = type === "ingreso" ? incomeCategories : expenseCategories;
  
  const filtered = getFilteredTransactions(
    transactions,
    categoryFilter,
    typeFilter
  );
  
  const grouped = groupByMonth(filtered);

  const balance = transactions.reduce((acc, mov) => {
    return mov.type === "ingreso" ? acc + mov.amount : acc - mov.amount;
  }, 0);

  function handleAdd() {
  if (!amount || !category) {
    alert("Completá los datos");
    return;
  }

  if (editingId) {
    setTransactions(prev =>
      prev.map(mov =>
        mov.id === editingId
          ? { ...mov, amount: parseFloat(amount), type, category }
          : mov
      )
    );

    setEditingId(null);
  } else {
    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      type,
      category,
      fecha: Date.now()
    };

    setTransactions(prev => [...prev, newTransaction]);
  }

  setAmount("");
  }

  

  return (
    <div>
      <h1>💸 Mi Dinero</h1>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={type} onChange={(e) => {
        setType(e.target.value);
        setCategory(e.target.value === "ingreso" ? "salario" : "mensuales");
      }}>
        <option value="ingreso">Ingreso</option>
        <option value="gasto">Gasto</option>
      </select>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {currentCategories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button onClick={handleAdd}>Agregar</button>

      <p>Balance: ${balance.toFixed(2)}</p>
      <p>Total: {transactions.length}</p>

      <h3>Filtrar</h3>

        <label>Type</label>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="ingreso">Ingresos</option>
          <option value="gasto">Gastos</option>
        </select>

        <label>Category</label>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="todas">Todas</option>
          {typeFilter === "todos" && (
            <>
              {incomeCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </>
          )}
          {typeFilter === "ingreso" && incomeCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          {typeFilter === "gasto" && expenseCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

      <ul>
        {Object.entries(grouped)
          .sort((a, b) => b[0].localeCompare(a[0])) // newest first
          .map(([month, items]) => (
            <li key={month}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button 
                  onClick={() => setCollapsedMonths(prev => ({
                    ...prev,
                    [month]: !prev[month]
                  }))}
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
                      backgroundColor: mov.type === "ingreso" ? "#d4edda" : "#f8d7da",
                      color: mov.type === "ingreso" ? "#155724" : "#721c24",
                      listStyleType: "none"
                    }}
                  >
                    {mov.type} - ${mov.amount} ({mov.category})
                    <button onClick={() => handleEdit(mov)}>✏️</button>
                    <button onClick={() => handleDelete(mov.id)}>❌</button>
                  </li>
                ))}
                </ul>
              )}
            </li>
          ))}
</ul>
    </div>
  );

  function toggleMonth(month) {
    setCollapsedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  }

  function handleEdit(mov) {
    setAmount(mov.amount);
    setType(mov.type);
    setCategory(mov.category);
    setEditingId(mov.id);
  }

  function handleDelete(id) {
    setTransactions(prev => prev.filter(mov => mov.id !== id));
  }

  
}

export default App; 