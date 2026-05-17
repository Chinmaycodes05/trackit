import { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./App.css";

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [alertSet, setAlertSet] = useState(false);

  const handleTrack = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setProduct(null);
    setHistory([]);

    try {
     const res = await axios.post("https://trackit-backend-whr8.onrender.com/scrape", { url });
const histRes = await axios.get(`https://trackit-backend-whr8.onrender.com/products/${res.data.id}`);

    } catch (e) {
      setError("Failed to fetch product. Please check the URL and try again.");
    }
    setLoading(false);
  };

  const handleAlert = () => {
    if (email && targetPrice) setAlertSet(true);
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Track<span>IT</span></div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Tracked items</a>
          <a href="#">Alerts</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <h1>Never overpay again</h1>
        <p>Paste any Amazon.in product URL and TrackIT watches the price for you — 24/7.</p>
        <div className="search-bar">
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Paste an Amazon.in product URL here..."
            onKeyDown={e => e.key === "Enter" && handleTrack()}
          />
          <button onClick={handleTrack} disabled={loading}>
            {loading ? "Tracking..." : "Track price"}
          </button>
        </div>
        <div className="stats">
          <div className="stat"><div className="stat-num">1,240</div><div className="stat-label">products tracked</div></div>
          <div className="stat"><div className="stat-num">24/7</div><div className="stat-label">price monitoring</div></div>
          <div className="stat"><div className="stat-num">Free</div><div className="stat-label">always</div></div>
        </div>
      </div>

      <div className="section">

        {/* Error */}
        {error && <div className="error-bar">{error}</div>}

        {/* Loading */}
        {loading && (
          <div className="loading-card">
            <div className="spinner"></div>
            <p>Fetching price from Amazon India... this takes ~15 seconds</p>
          </div>
        )}

        {/* Product Result */}
        {product && (
          <>
            <div className="product-result">
              <div className="product-info">
                <div className="product-store-badge">{product.store}</div>
                <h2 className="product-title">{product.title}</h2>
                <div className="product-price">{product.price}</div>
                <a href={product.url} target="_blank" rel="noreferrer" className="btn-view">
                  View on Amazon →
                </a>
              </div>
            </div>

            {/* Price History Chart */}
            {history.length > 1 && (
              <div className="chart-card">
                <h3>Price history</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
                    <Line type="monotone" dataKey="price" stroke="#378ADD" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Alert Setup */}
            {!alertSet ? (
              <div className="alert-bar">
                <div className="alert-bar-text">
                  <h3>Set a price drop alert</h3>
                  <p>Get an email the moment this product hits your target price</p>
                </div>
                <div className="alert-inputs">
                  <input
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <input
                    placeholder="Target price e.g. 40000"
                    value={targetPrice}
                    onChange={e => setTargetPrice(e.target.value)}
                    type="number"
                  />
                  <button onClick={handleAlert}>Set alert</button>
                </div>
              </div>
            ) : (
              <div className="alert-success">
                Alert set! We'll email {email} when the price drops below ₹{parseInt(targetPrice).toLocaleString()}.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}