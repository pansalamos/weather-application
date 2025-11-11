// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const cities = [
  { name: "Άγιος Νικόλαος", query: "Agios Nikolaos, GR" },
  { name: "Αθήνα", query: "Athens, GR" },
  { name: "Αγρίνιο", query: "Agrinio, GR" },
  { name: "Αλεξανδρούπολη", query: "Alexandroupoli, GR" },
  { name: "Αργοστόλι", query: "Argostoli, GR" },
  { name: "Άρτα", query: "Arta, GR" },
  { name: "Βέροια", query: "Veria, GR" },
  { name: "Βόλος", query: "Volos, GR" },
  { name: "Γρεβενά", query: "Grevena, GR" },
  { name: "Δράμα", query: "Drama, GR" },
  { name: "Έδεσσα", query: "Edessa, GR" },
  { name: "Ερμούπολη", query: "Ermoupoli, GR" },
  { name: "Ηγουμενίτσα", query: "Igoumenitsa, GR" },
  { name: "Ηράκλειο", query: "Heraklion, GR" },
  { name: "Θεσσαλονίκη", query: "Thessaloniki, GR" },
  { name: "Ιωάννινα", query: "Ioannina, GR" },
  { name: "Καβάλα", query: "Kavala, GR" },
  { name: "Καλαμάτα", query: "Kalamata, GR" },
  { name: "Καρδίτσα", query: "Karditsa, GR" },
  { name: "Καρπενήσι", query: "Karpenisi, GR" },
  { name: "Κατερίνη", query: "Katerini, GR" },
  { name: "Καστοριά", query: "Kastoria, GR" },
  { name: "Κέρκυρα", query: "Corfu, GR" },
  { name: "Κιλκίς", query: "Kilkis, GR" },
  { name: "Κοζάνη", query: "Kozani, GR" },
  { name: "Κομοτηνή", query: "Komotini, GR" },
  { name: "Κόρινθος", query: "Korinthos, GR" },
  { name: "Λαμία", query: "Lamia, GR" },
  { name: "Λάρισα", query: "Larissa, GR" },
  { name: "Λευκάδα", query: "Lefkada, GR" },
  { name: "Λιβαδειά", query: "Livadeia, GR" },
  { name: "Μεσολόγγι", query: "Mesolongi, GR" },
  { name: "Μυτιλήνη", query: "Mytilene, GR" },
  { name: "Ναύπλιο", query: "Nafplio, GR" },
  { name: "Πάτρα", query: "Patras, GR" },
  { name: "Πολύγυρος", query: "Poligyros, GR" },
  { name: "Πρέβεζα", query: "Preveza, GR" },
  { name: "Πύργος", query: "Pyrgos, GR" },
  { name: "Ρέθυμνο", query: "Rethymno, GR" },
  { name: "Ρόδος", query: "Rhodes, GR" },
  { name: "Σάμος", query: "Samos, GR" },
  { name: "Σέρρες", query: "Serres, GR" },
  { name: "Σπάρτη", query: "Sparta, GR" },
  { name: "Τρίκαλα", query: "Trikala, GR" },
  { name: "Τρίπολη", query: "Tripoli, GR" },
  { name: "Φλώρινα", query: "Florina, GR" },
  { name: "Χαλκίδα", query: "Chalkida, GR" },
  { name: "Χανιά", query: "Chania, GR" },
  { name: "Χίος", query: "Chios, GR" },
  { name: "Ξάνθη", query: "Xanthi, GR" },
];

cities.sort((a, b) => a.name.localeCompare(b.name, "el-GR"));

export default function App() {
  const [selectedCity, setSelectedCity] = useState("Αθήνα");
  const [dataByCity, setDataByCity] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tempUnit, setTempUnit] = useState("C");
  const [aboutOpen, setAboutOpen] = useState(false);

  const API_KEY = "56980a5587034f7eab2100131250811";

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const out = {};
      for (const city of cities) {
        try {
          const res = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city.query}&days=7&aqi=no&alerts=no`
          );
          const json = await res.json();
          const daily = json.forecast.forecastday.map((day) => ({
            date: day.date,
            dayName: new Date(day.date).toLocaleDateString("el-GR", {
              weekday: "long",
            }),
            max: day.day.maxtemp_c,
            min: day.day.mintemp_c,
            condition: day.day.condition,
            hourly: day.hour.map((h) => ({
              time: h.time,
              temp: h.temp_c,
              condition: h.condition,
              humidity: h.humidity,
              rain: h.precip_mm,
            })),
          }));
          out[city.name] = { daily };
        } catch (err) {
          console.error("fetch error for", city.name, err);
          out[city.name] = { daily: [] };
        }
      }
      setDataByCity(out);
      setLoading(false);
      setSelectedDayIndex(0);
    };
    fetchAll();
  }, [API_KEY]);

  const dailyForecast = dataByCity[selectedCity]?.daily ?? [];
  const hourlyForSelectedDay = dailyForecast[selectedDayIndex]?.hourly ?? [];

  const bgColor = darkMode ? "#0f1226" : "#f3f6fb";
  const panelBg = darkMode ? "#171827" : "#fff";
  const textColor = darkMode ? "#e6eef8" : "#0b1a2b";
  const accent = darkMode ? "#ffcc00" : "#0077cc";

  if (loading)
    return (
      <div style={{ fontFamily: "'Manrope', sans-serif", padding: 24 }}>
        Φόρτωση δεδομένων...
      </div>
    );

  return (
    <div
      style={{
        fontFamily: "'Manrope', sans-serif",
        minHeight: "100vh",
        background: bgColor,
        color: textColor,
        padding: 20,
        position: "relative",
      }}
    >
      {/* Hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: "50%",
          border: "none",
          background: accent,
          color: "#fff",
          fontSize: 24,
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 300,
          height: "100%",
          background: panelBg,
          color: textColor,
          boxShadow: sidebarOpen ? "-4px 0 20px rgba(0,0,0,0.3)" : "none",
          transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
          padding: 20,
          zIndex: 999,
        }}
      >
        <h3>Μενού</h3>
        <button
          onClick={() => setTempUnit(tempUnit === "C" ? "F" : "C")}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Εναλλαγή °C / °F
        </button>
        <button
          onClick={() => setAboutOpen(true)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Λίγα λόγια για την ιστοσελίδα
        </button>
      </div>

      {/* Modal για "Λίγα λόγια" */}
      {aboutOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
          onClick={() => setAboutOpen(false)}
        >
          <div
            style={{
              background: panelBg,
              color: textColor,
              borderRadius: 10,
              padding: 20,
              width: "80%",
              maxWidth: 400,
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAboutOpen(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                border: "none",
                background: "transparent",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <p>
              Η Meteoℝ παρέχει καθημερινές και ωριαίες προβλέψεις καιρού για
              όλες τις πρωτεύουσες των νομών της Ελλάδας. Στόχος της είναι να
              δίνει γρήγορη και εύκολη πρόσβαση σε βασικές πληροφορίες καιρού,
              όπως θερμοκρασία, υγρασία και βροχόπτωση, με φιλικό και οπτικά
              ευχάριστο τρόπο.
            </p>
            <p>
              Σημείωση: Τα δεδομένα προέρχονται από WeatherAPI.com και δεν
              εγγυώνται 100% ακρίβεια.
            </p>
            <p>
              Με εκτίμηση,
              <br />
              Σ.Π.
            </p>
          </div>
        </div>
      )}

      <h1 style={{ fontWeight: 700 }}>
        Meteoℝ - Καθημερινές Προγνώσεις Καιρού
      </h1>

      {/* Dropdown επιλογής πόλης & dark mode */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedDayIndex(0);
          }}
          style={{ padding: 6, borderRadius: 8 }}
        >
          {cities.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setDarkMode((s) => !s)}
          style={{ padding: 6, borderRadius: 8 }}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Day tabs σε grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 12,
        }}
      >
        {dailyForecast.map((d, i) => (
          <div
            key={d.date}
            onClick={() => setSelectedDayIndex(i)}
            style={{
              padding: 10,
              borderRadius: 10,
              background: selectedDayIndex === i ? accent : panelBg,
              cursor: "pointer",
              textAlign: "center",
              color:
                selectedDayIndex === i
                  ? darkMode
                    ? "#000"
                    : "#fff"
                  : textColor,
            }}
          >
            <div>
              {d.dayName},{" "}
              {new Date(d.date).toLocaleDateString("el-GR", {
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
            <img
              src={d.condition.icon}
              alt="icon"
              style={{ width: 40, height: 40 }}
            />
            <div>
              {tempUnit === "C"
                ? `${d.min.toFixed(1)}°C — ${d.max.toFixed(1)}°C`
                : `${((d.min * 9) / 5 + 32).toFixed(1)}°F — ${(
                    (d.max * 9) / 5 +
                    32
                  ).toFixed(1)}°F`}
            </div>
          </div>
        ))}
      </div>

      {/* Hourly table */}
      <h2>
        Πρόγνωση ανά ώρα — {dailyForecast[selectedDayIndex]?.dayName},{" "}
        {new Date(dailyForecast[selectedDayIndex]?.date).toLocaleDateString(
          "el-GR",
          { day: "2-digit", month: "2-digit" }
        )}
      </h2>
      <div
        style={{
          overflowX: "auto",
          background: panelBg,
          borderRadius: 10,
          padding: 10,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: textColor,
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "6px 10px" }}>Ώρα</th>
              <th style={{ textAlign: "left", padding: "6px 10px" }}>
                Θερμοκρασία
              </th>
              <th style={{ textAlign: "left", padding: "6px 10px" }}>
                Εικονίδιο
              </th>
              <th style={{ textAlign: "left", padding: "6px 10px" }}>
                Υγρασία
              </th>
              <th style={{ textAlign: "left", padding: "6px 10px" }}>
                Βροχή (mm)
              </th>
            </tr>
          </thead>
          <tbody>
            {hourlyForSelectedDay.map((h) => (
              <tr
                key={h.time}
                style={{
                  borderBottom: `1px solid ${darkMode ? "#222" : "#eee"}`,
                }}
              >
                <td style={{ padding: "6px 10px" }}>{h.time.slice(11, 16)}</td>
                <td style={{ padding: "6px 10px" }}>
                  {tempUnit === "C"
                    ? `${h.temp.toFixed(1)}°C`
                    : `${((h.temp * 9) / 5 + 32).toFixed(1)}°F`}
                </td>
                <td style={{ padding: "6px 10px" }}>
                  <img
                    src={h.condition.icon}
                    alt="icon"
                    style={{ width: 28, height: 28 }}
                  />
                </td>
                <td style={{ padding: "6px 10px" }}>{h.humidity}%</td>
                <td style={{ padding: "6px 10px" }}>{h.rain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <h3 style={{ marginTop: 16 }}>Διάγραμμα Θερμοκρασίας & Βροχής</h3>
      <div style={{ background: panelBg, borderRadius: 10, padding: 10 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={hourlyForSelectedDay.map((h) => ({
              time: h.time.slice(11, 16),
              temp: tempUnit === "C" ? h.temp : (h.temp * 9) / 5 + 32,
              rain: h.rain,
            }))}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#222" : "#eee"}
            />
            <XAxis dataKey="time" stroke={textColor} />
            <YAxis
              yAxisId="left"
              stroke="#ffcc00"
              name={`Θερμοκρασία (${tempUnit})`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#00e0ff"
              name="Βροχή (mm)"
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temp"
              name={`Θερμοκρασία (${tempUnit})`}
              stroke="#ffcc00"
              strokeWidth={3}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rain"
              name="Βροχή (mm)"
              stroke="#00e0ff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: 20, textAlign: "center", fontSize: 12 }}>
        Δεδομένα από WeatherAPI.com — Version: V1.1
      </footer>
    </div>
  );
}
