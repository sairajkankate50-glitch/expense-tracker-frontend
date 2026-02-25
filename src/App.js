import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/transactions";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: ""
  });

  const fetchData = async () => {
    const res = await axios.get(API);
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API, form);
    setForm({ title: "", amount: "", type: "expense", category: "" });
    fetchData();
  };

  const deleteItem = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchData();
  };

  const balance = transactions.reduce(
    (acc, item) =>
      item.type === "income"
        ? acc + item.amount
        : acc - item.amount,
    0
  );

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Expense Tracker</h2>
      <h3>Balance: ₹{balance}</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
          required
        />
        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />
        <button>Add</button>
      </form>

      <ul>
        {transactions.map(t => (
          <li key={t._id}>
            {t.title} - ₹{t.amount}
            <button onClick={() => deleteItem(t._id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;