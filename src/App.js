import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("masuk");
  const [editIndex, setEditIndex] = useState(null);

  // state laporan bulanan
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!description || !amount) return;

    const newTransaction = {
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString(),
    };

    if (editIndex !== null) {
      const updated = [...transactions];
      updated[editIndex] = newTransaction;
      setTransactions(updated);
      setEditIndex(null);
    } else {
      setTransactions([...transactions, newTransaction]);
    }

    setDescription("");
    setAmount("");
  };

  const deleteTransaction = (index) => {
    const updated = [...transactions];
    updated.splice(index, 1);
    setTransactions(updated);
  };

  const editTransaction = (index) => {
    const t = transactions[index];
    setDescription(t.description);
    setAmount(t.amount);
    setType(t.type);
    setEditIndex(index);
  };

  // langsung sort terbaru ke lama (default)
const sortedTransactions = [...transactions].sort(
  (a, b) => new Date(a.date) - new Date(b.date)
);

const filteredTransactions = sortedTransactions.filter((t) => {
  const tDate = new Date(t.date);
  return (
    tDate.getMonth() + 1 === selectedMonth &&
    tDate.getFullYear() === selectedYear
  );
});

  // total
  const totalMasuk = filteredTransactions
    .filter((t) => t.type === "masuk")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalKeluar = filteredTransactions
    .filter((t) => t.type === "keluar")
    .reduce((sum, t) => sum + t.amount, 0);

  const saldo = totalMasuk - totalKeluar;

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: "30px",
        background: "#001f3f",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "50px" }}>
        📊 Catatan Keuangan
      </h2>

      {/* Input transaksi */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Keterangan"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            minWidth: "180px",
          }}
        />
        <input
          type="number"
          placeholder="Jumlah"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            minWidth: "140px",
          }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="masuk">Masuk</option>
          <option value="keluar">Keluar</option>
        </select>
        <button
          onClick={addTransaction}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "none",
            background: "#28a745",
            color: "white",
            cursor: "pointer",
          }}
        >
          {editIndex !== null ? "Update" : "Tambah"}
        </button>
      </div>

      {/* Filter laporan */}
      <div
        style={{
          marginBottom: "20px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginRight: "6px",
            }}
          >
            Bulan:
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "6px",
            }}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginRight: "6px",
            }}
          >
            Tahun:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "6px",
            }}
          >
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ringkasan */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: "#003366",
          borderRadius: "8px",
        }}
      >
        <h3>
          Laporan Bulan{" "}
          {new Date(0, selectedMonth - 1).toLocaleString("id-ID", {
            month: "long",
          })}{" "}
          {selectedYear}
        </h3>
        <p>
          <strong>Total Masuk:</strong> Rp{totalMasuk.toLocaleString()}
        </p>
        <p>
          <strong>Total Keluar:</strong> Rp{totalKeluar.toLocaleString()}
        </p>
        <p>
          <strong>Sisa Uang:</strong> Rp{saldo.toLocaleString()}
        </p>
      </div>

      {/* Daftar transaksi */}
      <h3>Daftar Transaksi</h3>
      {filteredTransactions.length === 0 ? (
        <p>Tidak ada transaksi bulan ini.</p>
      ) : (
        filteredTransactions.map((t, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              padding: "12px",
              background: "#004080",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span>
                {t.description} - Rp{t.amount.toLocaleString()} ({t.type})
              </span>
              <br />
              <small>
                {new Date(t.date).toLocaleString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>

            {/* Aksi */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => editTransaction(index)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "yellow",
                }}
              >
                <Pencil size={22} />
              </button>
              <button
                onClick={() => deleteTransaction(index)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "red",
                }}
              >
                <Trash2 size={22} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
