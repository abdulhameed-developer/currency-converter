import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);

  // Fetch currency symbols
  useEffect(() => {
    fetch("https://api.exchangerate.host/symbols")
      .then((res) => res.json())
      .then((data) => setCurrencies(Object.keys(data.symbols)))
      .catch((err) => console.error("Error fetching symbols:", err));
  }, []);

  // Convert currency
  const convertCurrency = async () => {
    if (!amount || amount <= 0) return;
    const res = await fetch(
      `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
    );
    const data = await res.json();
    setResult(data.result);
    setRate(data.info.rate);
  };

  // Swap currencies
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult(null);
    setRate(null);
  };

  return (
    <div className="app">
      <h1>💰 Currency Converter</h1>

      <div className="converter-box">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <div className="dropdowns">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <button className="swap-btn" onClick={swapCurrencies}>
            🔁
          </button>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        <button onClick={convertCurrency}>Convert</button>

        {result !== null && (
          <div className="result">
            <h2>
              {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
            </h2>
            {rate && (
              <p className="rate">
                1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
