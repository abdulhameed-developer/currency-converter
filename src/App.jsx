import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("PKR");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiKey = "29eea4ca01945290d713b507";

  // Fetch all currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
        );
        const data = await response.json();

        if (data.conversion_rates) {
          setCurrencies(Object.keys(data.conversion_rates));
          setError("");
        } else {
          throw new Error("Invalid currency data");
        }
      } catch (err) {
        console.error("Unable to Fetch Currencies: ", err);
        setError("Failed to load currency list.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  // Convert currency whenever inputs change
  useEffect(() => {
    const convertCurrency = async () => {
      if (!amount || amount <= 0) {
        setResult("");
        setRate(null);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`
        );
        const data = await res.json();

        if (!data.conversion_rates) throw new Error("Invalid API response");

        const newRate = data.conversion_rates[to];
        setRate(newRate);
        setResult((amount * newRate).toFixed(2));
        setError("");
      } catch (err) {
        console.error("Error converting currency:", err);
        setError("Conversion failed. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (currencies.length > 0 && amount !== "") {
      convertCurrency();
    }
  }, [amount, from, to, currencies]);

  // Swap currencies
  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  // Handle input
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value === "" ? "" : Number(value));
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Currency Converter</h1>
          <p className="subtitle">
            Real-time exchange rates with live conversion
          </p>
        </header>

        <main className="main-content">
          <div className="converter-card">
            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <div className="input-field">
                <label htmlFor="amount">Amount</label>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  min="0"
                  placeholder="Enter amount"
                  className={loading ? "loading-shimmer" : ""}
                />
              </div>
            </div>

            <div className="currency-selectors">
              <div className="currency-field">
                <label htmlFor="from">From Currency</label>
                <select
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  disabled={loading}
                  className={loading ? "loading-shimmer" : ""}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="swap-button"
                onClick={swapCurrencies}
                aria-label="Swap currencies"
                disabled={loading}
                type="button"
              >
                ⇄
              </button>

              <div className="currency-field">
                <label htmlFor="to">To Currency</label>
                <select
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  disabled={loading}
                  className={loading ? "loading-shimmer" : ""}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="result-section">
              <div className="result-field">
                <label htmlFor="result">Converted Amount</label>
                <input
                  id="result"
                  type="text"
                  value={loading ? "Converting..." : result}
                  placeholder={loading ? "Converting..." : "0.00"}
                  readOnly
                  className={loading ? "loading-shimmer" : ""}
                />
              </div>
                <div className="rate-info">
                  <p>
                    1 {from} = {rate} {to}
                  </p>
                </div>
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>
            © {new Date().getFullYear()} Currency Converter • Real-time exchange
            rates
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;