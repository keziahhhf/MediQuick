require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const PORT = 5000;

// Symptom analyzer (unchanged)
app.post("/analyze", (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) return res.json({ advice: "Please enter symptoms" });

    const input = symptoms.toLowerCase();
    let score = { emergency: 0, moderate: 0, mild: 0 };

    if (input.includes("chest pain")) score.emergency += 3;
    if (input.includes("breathing")) score.emergency += 3;
    if (input.includes("unconscious")) score.emergency += 5;

    if (input.includes("fever")) score.moderate += 2;
    if (input.includes("vomiting")) score.moderate += 2;
    if (input.includes("infection")) score.moderate += 2;

    if (input.includes("cold")) score.mild += 1;
    if (input.includes("headache")) score.mild += 1;
    if (input.includes("cough")) score.mild += 1;

    let advice = "Consult a doctor";
    if (score.emergency >= 3) advice = "🚨 Emergency! Go to hospital immediately";
    else if (score.moderate >= 2) advice = "⚠️ Visit a doctor soon";
    else advice = "🙂 Home care is fine for now";

    res.json({ advice, score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analyzer failed" });
  }
});

// Hackathon-ready hospitals route
app.get("/hospitals", (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "Location required" });

  const userLat = parseFloat(lat);
  const userLon = parseFloat(lon);

  // 🔥 More hospitals with ratings and reviews
  const hospitals = [
    { id: 1, name: "Apollo Hospital", lat: 13.0500, lon: 80.2500, address: "Greams Rd", rating: 4.5, reviews: 120 },
    { id: 2, name: "Fortis Malar", lat: 13.0400, lon: 80.2400, address: "Mylapore", rating: 4.2, reviews: 80 },
    { id: 3, name: "MIOT Hospital", lat: 13.0300, lon: 80.2200, address: "Manapakkam", rating: 4.7, reviews: 200 },
    { id: 4, name: "SIMS Hospital", lat: 13.0250, lon: 80.2700, address: "Vadapalani", rating: 4.1, reviews: 60 },
    { id: 5, name: "Global Hospital", lat: 13.0450, lon: 80.2600, address: "Adyar", rating: 4.6, reviews: 150 },
    { id: 6, name: "VGM Hospital", lat: 13.0600, lon: 80.2800, address: "Royapettah", rating: 4.3, reviews: 70 },
    { id: 7, name: "Madhuram Hospital", lat: 13.0350, lon: 80.2000, address: "Nungambakkam", rating: 4.4, reviews: 90 },
    { id: 8, name: "Vasan Eye Care", lat: 13.0480, lon: 80.2550, address: "Anna Salai", rating: 4.8, reviews: 180 },
    { id: 9, name: "Sri Ram Hospital", lat: 13.0200, lon: 80.2300, address: "T Nagar", rating: 4.0, reviews: 50 },
    { id: 10, name: "Kauvery Hospital", lat: 13.0550, lon: 80.2650, address: "Velachery", rating: 4.6, reviews: 130 },
    { id: 11, name: "Hindu Mission Hospital", lat: 13.0650, lon: 80.2700, address: "Guindy", rating: 4.5, reviews: 100 },
    { id: 12, name: "Billroth Hospital", lat: 13.0580, lon: 80.2400, address: "Nungambakkam", rating: 4.7, reviews: 160 },
  ];

  // 🔥 Recommendation logic: highest rating first, tie-breaker = nearest
  let recommended = hospitals[0];
  hospitals.forEach(h => {
    if (h.rating > recommended.rating) {
      recommended = h;
    } else if (h.rating === recommended.rating) {
      const distH = Math.hypot(h.lat - userLat, h.lon - userLon);
      const distRec = Math.hypot(recommended.lat - userLat, recommended.lon - userLon);
      if (distH < distRec) recommended = h;
    }
  });

  res.json({ elements: hospitals, recommended });
});

app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));