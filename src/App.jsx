import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("PKR");
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiKey = "8ZAnd0GPSmaJD4FX1PJ7oN8Impk0b1Ta";

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.apilayer.com/exchangerates_data/symbols?apikey=${apiKey}`);
        const data = await res.json();
        
        if(data.symbols){
          setCurrencies(Object.keys(data.symbols));
          setError("");
        } else {
          setError("Failed to load currency symbols");
        }
      } catch (error) {
        console.error("Error fetching currencies:", error);
        setError("Failed to load currency data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  const converter = async () => {
    if (!amount || amount <= 0) {
      setResult("0");
      setRate(null);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}&apikey=${apiKey}`
      );
      const data = await res.json();
      
      if (data.success) {
        setResult(data.result.toFixed(2));
        setRate(data.info?.rate);
        setError("");
      } else {
        setError(data.error?.info || "Conversion failed. Please try again.");
      }
    } catch (error) {
      console.error("Error converting currency:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Run converter whenever amount, from, or to changes
  useEffect(() => {
    if (currencies.length > 0 && amount > 0) {
      converter();
    }
  }, [amount, from, to]);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value === "" ? "" : Number(value));
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Currency Converter</h1>
          <p className="subtitle">Real-time exchange rates with live conversion</p>
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
                  value={loading ? "Calculating..." : result} 
                  placeholder={loading ? "Calculating..." : "0.00"}
                  readOnly 
                  className={loading ? "loading-shimmer" : ""}
                />
              </div>
                <div className="rate-info">
                  <p>1 {from} = {rate.toFixed(6)} {to}</p>
                </div>
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} Currency Converter • Real-time exchange rates</p>
        </footer>
      </div>
    </div>
  );
}

export default App;