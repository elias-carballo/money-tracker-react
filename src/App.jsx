import { useState } from "react";

function App() {
  const [editingId, setEditingId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("ingreso");
  const [category, setCategory] = useState("salario");

  function handleAdd() {
  if (!amount || !category) {
    alert("Completá los datos");
    return;
  }

  if (editingId) {
    // ✏️ EDIT MODE
    setTransactions(prev =>
      prev.map(mov =>
        mov.id === editingId
          ? { ...mov, amount: parseFloat(amount), type, category }
          : mov
      )
    );

    setEditingId(null);
  } else {
    // ➕ CREATE MODE
    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      type,
      category,
      fecha: Date.now(),
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

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="ingreso">Ingreso</option>
        <option value="gasto">Gasto</option>
      </select>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="salario">Salario</option>
        <option value="regalo">Regalo</option>
        <option value="extra">Extra</option>
      </select>

      <button onClick={handleAdd}>Agregar</button>

      <p>Total: {transactions.length}</p>

      <ul>
        {transactions.map((mov) => (
          <li key={mov.id}>
            {mov.type} - ${mov.amount} ({mov.category})
            <button onClick={() => handleEdit(mov)}>✏️</button>
            <button onClick={() => handleDelete(mov.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );

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