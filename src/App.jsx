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
  { name: "Άγιος Νικόλαος", query: "Agios Nikolaos,GR" },
  { name: "Αθήνα", query: "Athens,GR" },
  { name: "Αλεξανδρούπολη", query: "Alexandroupoli,GR" },
  { name: "Αργοστόλι", query: "Argostoli,GR" },
  { name: "Άρτα", query: "Arta,GR" },
  { name: "Βέροια", query: "Veria,GR" },
  { name: "Βόλος", query: "Volos,GR" },
  { name: "Γρεβενά", query: "Grevena,GR" },
  { name: "Δράμα", query: "Drama,GR" },
  { name: "Έδεσσα", query: "Edessa,GR" },
  { name: "Ερμούπολη", query: "Ermoupoli,GR" },
  { name: "Ηγουμενίτσα", query: "Igoumenitsa,GR" },
  { name: "Ηράκλειο", query: "Heraklion,GR" },
  { name: "Θεσσαλονίκη", query: "Thessaloniki,GR" },
  { name: "Ιωάννινα", query: "Ioannina,GR" },
  { name: "Καβάλα", query: "Kavala,GR" },
  { name: "Καλαμάτα", query: "Kalamata,GR" },
  { name: "Καρδίτσα", query: "Karditsa,GR" },
  { name: "Καρπενήσι", query: "Karpenisi,GR" },
  { name: "Κατερίνη", query: "Katerini,GR" },
  { name: "Καστοριά", query: "Kastoria,GR" },
  { name: "Κέρκυρα", query: "Corfu,GR" },
  { name: "Κιλκίς", query: "Kilkis,GR" },
  { name: "Κοζάνη", query: "Kozani,GR" },
  { name: "Κομοτηνή", query: "Komotini,GR" },
  { name: "Κόρινθος", query: "Korinthos,GR" },
  { name: "Λαμία", query: "Lamia,GR" },
  { name: "Λάρισα", query: "Larissa,GR" },
  { name: "Λευκάδα", query: "Lefkada,GR" },
  { name: "Λιβαδειά", query: "Livadeia,GR" },
  { name: "Μεσολόγγι", query: "Mesolongi,GR" },
  { name: "Μυτιλήνη", query: "Mytilene,GR" },
  { name: "Ναύπλιο", query: "Nafplio,GR" },
  { name: "Πάτρα", query: "Patras,GR" },
  { name: "Πολύγυρος", query: "Poligyros,GR" },
  { name: "Πρέβεζα", query: "Preveza,GR" },
  { name: "Πύργος", query: "Pyrgos,GR" },
  { name: "Ρέθυμνο", query: "Rethymno,GR" },
  { name: "Ρόδος", query: "Rhodes,GR" },
  { name: "Σάμος", query: "Samos,GR" },
  { name: "Σέρρες", query: "Serres,GR" },
  { name: "Σπάρτη", query: "Sparta,GR" },
  { name: "Τρίκαλα", query: "Trikala,GR" },
  { name: "Τρίπολη", query: "Tripoli,GR" },
  { name: "Φλώρινα", query: "Florina,GR" },
  { name: "Χαλκίδα", query: "Chalkida,GR" },
  { name: "Χανιά", query: "Chania,GR" },
  { name: "Χίος", query: "Chios,GR" },
  { name: "Ξάνθη", query: "Xanthi,GR" },
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [dataByCity, setDataByCity] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const dailyForecast = dataByCity[selectedCity.name]?.daily ?? [];
  const hourlyForSelectedDay = dailyForecast[selectedDayIndex]?.hourly ?? [];

  const convertTemp = (c) => (isFahrenheit ? (c * 9) / 5 + 32 : c);
  const tempUnit = isFahrenheit ? "°F" : "°C";

  const bgColor = darkMode ? "#0f1226" : "#f3f6fb";
  const panelBg = darkMode ? "#171827" : "#fff";
  const textColor = darkMode ? "#e6eef8" : "#0b1a2b";
  const accent = darkMode ? "#ffcc00" : "#0077cc";

  const buttonStyle = {
    padding: "8px 14px",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    background: darkMode ? "#1b1e33" : "#fff",
    color: textColor,
    fontWeight: 600,
    boxShadow: darkMode
      ? "0 2px 6px rgba(255,204,0,0.15)"
      : "0 2px 6px rgba(0,0,0,0.1)",
    transition: "all 0.25s ease-in-out",
  };

  const selectStyle = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "none",
    outline: "none",
    fontWeight: 600,
    background: darkMode ? "#1b1e33" : "#fff",
    color: textColor,
    boxShadow: darkMode
      ? "0 2px 6px rgba(255,204,0,0.15)"
      : "0 2px 6px rgba(0,0,0,0.1)",
    transition: "all 0.25s ease-in-out",
    cursor: "pointer",
    appearance: "none",
  };

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
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontWeight: 700 }}>
          Meteoℝ - Καθημερινές Προγνώσεις Καιρού
        </h1>
        <button
          style={{
            ...buttonStyle,
            borderRadius: "50%",
            width: 48,
            height: 48,
            fontSize: 24,
          }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
      </div>

      {/* City selection & dark mode */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 12, marginTop: 12 }}
      >
        <select
          value={selectedCity.name}
          onChange={(e) => {
            const cityObj = cities.find((c) => c.name === e.target.value);
            setSelectedCity(cityObj);
            setSelectedDayIndex(0);
          }}
          style={{ ...selectStyle }}
        >
          {cities.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          style={{ ...buttonStyle }}
          onClick={() => setDarkMode((s) => !s)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Daily cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {dailyForecast.map((d, i) => (
          <div
            key={d.date}
            onClick={() => setSelectedDayIndex(i)}
            style={{
              cursor: "pointer",
              padding: "14px 10px",
              borderRadius: 12,
              textAlign: "center",
              background: selectedDayIndex === i ? accent : panelBg,
              color:
                selectedDayIndex === i
                  ? darkMode
                    ? "#000"
                    : "#fff"
                  : textColor,
              boxShadow:
                selectedDayIndex === i
                  ? darkMode
                    ? "0 0 10px #ffcc00a8"
                    : "0 0 10px #0077cc80"
                  : "0 2px 6px rgba(0,0,0,0.1)",
              transform: selectedDayIndex === i ? "scale(1.03)" : "scale(1)",
              transition: "all 0.25s ease-in-out",
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {d.dayName},{" "}
              {new Date(d.date).toLocaleDateString("el-GR", {
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
            <img
              src={d.condition.icon}
              alt="icon"
              style={{
                width: 42,
                height: 42,
                marginTop: 4,
                filter: darkMode ? "brightness(1.1)" : "none",
              }}
            />
            <div style={{ marginTop: 4 }}>
              {convertTemp(d.min).toFixed(1)}
              {tempUnit} — {convertTemp(d.max).toFixed(1)}
              {tempUnit}
            </div>
          </div>
        ))}
      </div>

      {/* Hourly forecast */}
      <h2>
        Πρόγνωση ανά ώρα — {dailyForecast[selectedDayIndex].dayName},{" "}
        {new Date(dailyForecast[selectedDayIndex].date).toLocaleDateString(
          "el-GR",
          {
            day: "2-digit",
            month: "2-digit",
          }
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
                  {convertTemp(h.temp).toFixed(1)}
                  {tempUnit}
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
      <h3 style={{ marginTop: 16 }}>Διάγραμμα Θερμοκρασίας - Βροχής</h3>
      <div style={{ background: panelBg, borderRadius: 10, padding: 10 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={hourlyForSelectedDay.map((h) => ({
              time: h.time.slice(11, 16),
              temp: convertTemp(h.temp),
              rain: h.rain,
            }))}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#222" : "#eee"}
            />
            <XAxis dataKey="time" stroke={darkMode ? "#fff" : "#333"} />
            <YAxis yAxisId="left" stroke="#ffcc00" />
            <YAxis yAxisId="right" orientation="right" stroke="#00e0ff" />
            <Tooltip
              contentStyle={{
                background: darkMode ? "#111" : "#fff",
                border: "none",
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temp"
              name="Θερμοκρασία"
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
      <div
        style={{
          marginTop: 30,
          textAlign: "center",
          fontSize: 12,
          color: darkMode ? "#aaa" : "#555",
        }}
      >
        Δεδομένα από WeatherAPI.com
        <br />
        Version: V1.1
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 320,
          height: "100vh",
          background: panelBg,
          boxShadow: "-2px 0 12px rgba(0,0,0,0.15)",
          padding: 20,
          transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s ease",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            border: "none",
            background: "transparent",
            color: darkMode ? "#fff" : "#000",
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        <h3>Λίγα λόγια για την ιστοσελίδα</h3>
        <p style={{ fontSize: 14, lineHeight: 1.5 }}>
          Η Meteoℝ παρέχει καθημερινές και ωριαίες προβλέψεις καιρού για όλες
          τις πρωτεύουσες των νομών της Ελλάδας. Στόχος της είναι να δίνει
          γρήγορη και εύκολη πρόσβαση σε βασικές πληροφορίες καιρού, όπως
          θερμοκρασία, υγρασία και βροχόπτωση, με φιλικό και οπτικά ευχάριστο
          τρόπο.
          <br />
          Σημείωση: Τα δεδομένα προέρχονται από WeatherAPI.com και δεν εγγυώνται
          100% ακρίβεια.
        </p>

        <button
          style={{ ...buttonStyle, marginTop: 20 }}
          onClick={() => setIsFahrenheit(!isFahrenheit)}
        >
          {isFahrenheit ? "Μετρήσεις σε °C" : "Μετρήσεις σε °F"}
        </button>
      </div>
    </div>
  );
}
