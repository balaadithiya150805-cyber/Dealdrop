import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function StorePage() {
  const { shopName } = useParams();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/store/${shopName}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load store products");
        setLoading(false);
      });
  }, [shopName]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const cartCount = cart.length;

  if (loading) return <p style={styles.center}>⏳ Loading store...</p>;
  if (error) return <p style={styles.center}>❌ {error}</p>;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Map</Link>
        <h2 style={styles.storeName}>🏪 {decodeURIComponent(shopName)}</h2>
        <div style={styles.cartBadge}>🛒 {cartCount}</div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <p style={styles.center}>No products found in this store.</p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product._id} style={styles.card}>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.price}>₹{product.price}</p>
              <p style={styles.stock}>
                {product.stock > 0
                  ? `📦 ${product.stock} in stock`
                  : "❌ Out of stock"}
              </p>
              <button
                style={{
                  ...styles.button,
                  ...(product.stock === 0 ? styles.buttonDisabled : {}),
                }}
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Cart Summary */}
      {cartCount > 0 && (
        <div style={styles.cartSummary}>
          <strong>🛒 Cart ({cartCount})</strong>
          <span style={styles.cartTotal}>
            Total: ₹{cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "2px solid #eee",
  },
  backLink: {
    textDecoration: "none",
    color: "#4a90d9",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  storeName: {
    margin: 0,
    fontSize: "1.4rem",
  },
  cartBadge: {
    background: "#4a90d9",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "0.95rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
  },
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "16px",
    background: "#fafafa",
    transition: "box-shadow 0.2s",
  },
  productName: {
    margin: "0 0 8px",
    fontSize: "1.1rem",
  },
  price: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#2e7d32",
    margin: "4px 0",
  },
  stock: {
    fontSize: "0.85rem",
    color: "#666",
    margin: "4px 0 12px",
  },
  button: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    background: "#4a90d9",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  buttonDisabled: {
    background: "#ccc",
    cursor: "not-allowed",
  },
  cartSummary: {
    marginTop: "24px",
    padding: "14px 20px",
    background: "#f0f4ff",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1rem",
  },
  cartTotal: {
    fontWeight: "bold",
    color: "#2e7d32",
  },
  center: {
    textAlign: "center",
    marginTop: "40px",
    fontSize: "1.1rem",
  },
};

export default StorePage;
