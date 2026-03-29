import { BrowserRouter, Routes, Route } from "react-router-dom";
import NearbyMap from "./components/NearbyMap";
import StorePage from "./components/StorePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1 style={{ textAlign: "center", padding: "16px 0 0", fontFamily: "'Segoe UI', sans-serif" }}>
                DealDrop+
              </h1>
              <NearbyMap />
            </div>
          }
        />
        <Route path="/store/:shopName" element={<StorePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;