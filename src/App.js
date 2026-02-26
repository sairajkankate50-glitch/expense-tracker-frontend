import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://expense-tracker-backend-2-f78p.onrender.com/api/transactions";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setTransactions(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load data. Backend might be waking up...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API, form);
      setForm({ title: "", amount: "", type: "expense", category: "" });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to add transaction");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction");
    }
  };

  const balance = transactions.reduce((acc, item) => {
    const amount = Number(item.amount) || 0;
    return item.type === "income" ? acc + amount : acc - amount;
  }, 0);

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Expense Tracker</h2>
      <h3>Balance: ₹{balance}</h3>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
        <button type="submit">Add</button>
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