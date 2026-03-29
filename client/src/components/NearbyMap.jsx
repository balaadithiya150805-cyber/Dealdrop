import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons (Leaflet + bundler issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "user-marker",
});

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

function NearbyMap() {
  const [position, setPosition] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });

        fetch(
          `http://localhost:5000/api/nearby?lat=${latitude}&lng=${longitude}`
        )
          .then((res) => res.json())
          .then((data) => {
            setProducts(data.products || []);
            setLoading(false);
          })
          .catch(() => {
            setError("Failed to fetch nearby products");
            setLoading(false);
          });
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <p style={styles.message}>📍 Getting your location...</p>;
  if (error) return <p style={styles.message}>❌ {error}</p>;
  if (!position) return null;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📍 Nearby Products</h2>
      <p style={styles.subtext}>
        Found <strong>{products.length}</strong> product(s) near you
      </p>

      <MapContainer
        center={[position.lat, position.lng]}
        zoom={14}
        style={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap lat={position.lat} lng={position.lng} />

        {/* User location marker */}
        <Marker position={[position.lat, position.lng]} icon={userIcon}>
          <Popup>📍 You are here</Popup>
        </Marker>

        {/* Product markers */}
        {products.map((product) => (
          <Marker
            key={product._id}
            position={[
              product.location.coordinates[1],
              product.location.coordinates[0],
            ]}
          >
            <Popup>
              <strong>{product.name}</strong>
              <br />
              ₹{product.price}
              <br />
              🏪 {product.shopName}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    fontSize: "1.5rem",
    marginBottom: "4px",
  },
  subtext: {
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "12px",
  },
  map: {
    height: "500px",
    width: "100%",
    borderRadius: "10px",
    border: "2px solid #ddd",
  },
  message: {
    textAlign: "center",
    marginTop: "40px",
    fontSize: "1.1rem",
  },
};

export default NearbyMap;
