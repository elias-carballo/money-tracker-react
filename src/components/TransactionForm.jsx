export default function TransactionForm({
  amount,
  setAmount,
  type,
  setType,
  category,
  setCategory,
  incomeCategories,
  expenseCategories,
  onAdd={handleAdd}
}) {
  const currentCategories =
    type === "ingreso" ? incomeCategories : expenseCategories;

  return (
    <>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        value={type}
        onChange={(e) => {
          setType(e.target.value);
          setCategory(
            e.target.value === "ingreso" ? "salario" : "mensuales"
          );
        }}
      >
        <option value="ingreso">Ingreso</option>
        <option value="gasto">Gasto</option>
      </select>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {currentCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <button onClick={onAdd}>Agregar</button>
    </>
  );
}