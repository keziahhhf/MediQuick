import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const [symptoms, setSymptoms] = useState("");
  const [advice, setAdvice] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [position, setPosition] = useState([13.0827, 80.2707]); // Default Chennai
  const [recommended, setRecommended] = useState(null);

  // Initialize static hospitals on mount
  useEffect(() => {
    const initialHospitals = [
      { id: 1, name: "Apollo Hospital", lat: 13.0500, lon: 80.2500, address: "Greams Rd", rating: 4.5 },
      { id: 2, name: "Fortis Malar", lat: 13.0400, lon: 80.2400, address: "Mylapore", rating: 4.2 },
      { id: 3, name: "MIOT Hospital", lat: 13.0300, lon: 80.2200, address: "Manapakkam", rating: 4.0 },
      { id: 4, name: "SIMS Hospital", lat: 13.0250, lon: 80.2700, address: "Vadapalani", rating: 4.3 },
      { id: 5, name: "Global Hospital", lat: 13.0450, lon: 80.2600, address: "Adyar", rating: 4.1 },
    ];
    setHospitals(initialHospitals);
    pickRecommended(initialHospitals);
  }, []);

  const handleAnalyze = () => {
    const input = symptoms.toLowerCase();
    let score = { emergency: 0, moderate: 0, mild: 0 };
    if (input.includes("chest pain") || input.includes("breathing") || input.includes("unconscious")) score.emergency += 3;
    if (input.includes("fever") || input.includes("vomiting") || input.includes("infection")) score.moderate += 2;
    if (input.includes("cold") || input.includes("headache") || input.includes("cough")) score.mild += 1;

    if (score.emergency >= 3) setAdvice("🚨 Emergency! Go to hospital immediately");
    else if (score.moderate >= 2) setAdvice("⚠️ Visit a doctor soon");
    else setAdvice("🙂 Home care is fine for now");
  };

  const pickRecommended = (list) => {
    if (!list.length) return;
    let rec = list[0];
    list.forEach(h => { if (h.rating > rec.rating) rec = h; });
    setRecommended(rec);
  };

  const addHospital = (name, lat, lon, address, rating) => {
    if (!name || !lat || !lon || !rating) return alert("Please fill all required fields!");
    const h = { id: Date.now(), name, lat: parseFloat(lat), lon: parseFloat(lon), address, rating: parseFloat(rating) };
    const updated = [...hospitals, h];
    setHospitals(updated);
    pickRecommended(updated);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>MediQuick 🏥</h1>

      {/* Symptom Analyzer */}
      <div style={{ marginBottom: "20px" }}>
        <input
          style={{ padding: "10px", width: "60%" }}
          placeholder="Enter symptoms"
          value={symptoms}
          onChange={e => setSymptoms(e.target.value)}
        />
        <button style={{ padding: "10px 15px", marginLeft: "10px" }} onClick={handleAnalyze}>Analyze</button>
        <h3>{advice}</h3>
      </div>

      {/* Add Hospital */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Add Hospital</h4>
        <input placeholder="Name" id="hName" style={{ marginRight:"5px" }} />
        <input placeholder="Lat" id="hLat" style={{ marginRight:"5px" }} />
        <input placeholder="Lon" id="hLon" style={{ marginRight:"5px" }} />
        <input placeholder="Address" id="hAddr" style={{ marginRight:"5px" }} />
        <input placeholder="Rating" id="hRate" style={{ marginRight:"5px", width:"60px" }} />
        <button onClick={() => addHospital(
          document.getElementById("hName").value,
          document.getElementById("hLat").value,
          document.getElementById("hLon").value,
          document.getElementById("hAddr").value,
          document.getElementById("hRate").value
        )}>Add</button>
      </div>

      {/* Map */}
      <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User location */}
        <Marker position={position}><Popup>Your location</Popup></Marker>

        {/* Hospitals */}
        {hospitals.map(h => (
          <CircleMarker
            key={h.id}
            center={[h.lat, h.lon]}
            radius={recommended?.id === h.id ? 15 : 8}
            color={recommended?.id === h.id ? "red" : "blue"}
          >
            <Popup>
              <strong>{h.name}</strong><br />
              {h.address}<br />
              ⭐ {h.rating} {recommended?.id === h.id ? "✅ Recommended" : ""}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;