// src/App.jsx
import React, { useEffect, useState, useRef } from "react";
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
  { name: "Αθήνα", query: "Athens,GR" },
  { name: "Θεσσαλονίκη", query: "Thessaloniki,GR" },
  { name: "Αλεξανδρούπολη", query: "Alexandroupoli,GR" },
  { name: "Κομοτηνή", query: "Komotini,GR" },
  { name: "Ξάνθη", query: "Xanthi,GR" },
  { name: "Καβάλα", query: "Kavala,GR" },
  { name: "Φλώρινα", query: "Florina,GR" },
  { name: "Κιλκίς", query: "Kilkis,GR" },
  { name: "Έδεσσα", query: "Edessa,GR" },
  { name: "Κατερίνη", query: "Katerini,GR" },
  { name: "Βέροια", query: "Veria,GR" },
  { name: "Ιωάννινα", query: "Ioannina,GR" },
  { name: "Άρτα", query: "Arta,GR" },
  { name: "Λάρισα", query: "Larisa,GR" },
  { name: "Βόλος", query: "Volos,GR" },
  { name: "Καρδίτσα", query: "Karditsa,GR" },
  { name: "Τρίκαλα", query: "Trikala,GR" },
  { name: "Λιβαδειά", query: "Livadeia,GR" },
  { name: "Χαλκίδα", query: "Chalkida,GR" },
  { name: "Μεσολόγγι", query: "Mesolongi,GR" },
  { name: "Καρπενήσι", query: "Karpenisi,GR" },
  { name: "Άμφισσα", query: "Amfissa,GR" },
  { name: "Πάτρα", query: "Patra,GR" },
  { name: "Πύργος", query: "Pyrgos,GR" },
  { name: "Ναύπλιο", query: "Nafplio,GR" },
  { name: "Καλαμάτα", query: "Kalamata,GR" },
  { name: "Σπάρτη", query: "Sparti,GR" },
  { name: "Χανιά", query: "Chania,GR" },
  { name: "Ρέθυμνο", query: "Rethymno,GR" },
  { name: "Ηράκλειο", query: "Heraklion,GR" },
  { name: "Μυτιλήνη", query: "Mytilene,GR" },
  { name: "Χίος", query: "Chios,GR" },
  { name: "Κέρκυρα", query: "Corfu,GR" },
  { name: "Αργοστόλι", query: "Argostoli,GR" },
  { name: "Ζάκυνθος", query: "Zakynthos,GR" },
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState("Αθήνα");
  const [dataByCity, setDataByCity] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const dailyTabsRef = useRef(null);

  const API_KEY = "56980a5587034f7eab2100131250811"; // <-- αντικατέστησε με το δικό σου WeatherAPI key

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

  // Auto scroll for day tabs
  useEffect(() => {
    if (dailyTabsRef.current) {
      const tabWidth = dailyTabsRef.current.children[0].offsetWidth + 8;
      dailyTabsRef.current.scrollTo({
        left: selectedDayIndex * tabWidth,
        behavior: "smooth",
      });
    }
  }, [selectedDayIndex]);

  if (loading)
    return (
      <div style={{ fontFamily: "'Manrope', sans-serif", padding: 24 }}>
        Φόρτωση δεδομένων...
      </div>
    );

  const bgColor = darkMode ? "#0f1226" : "#f3f6fb";
  const panelBg = darkMode ? "#171827" : "#fff";
  const textColor = darkMode ? "#e6eef8" : "#0b1a2b";
  const accent = darkMode ? "#ffcc00" : "#0077cc";
  const arrowStyle = {
    padding: "6px 12px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: panelBg,
  };
  const thStyle = { textAlign: "left", padding: "6px 10px" };
  const tdStyle = { padding: "6px 10px" };

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
      <h1 style={{ fontWeight: 700 }}>
        Meteoℝ - Καθημερινές Προγνώσεις Καιρού
      </h1>
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

      {/* Days navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 12,
        }}
      >
        <button
          style={arrowStyle}
          onClick={() => setSelectedDayIndex((i) => Math.max(i - 1, 0))}
        >
          ◀
        </button>
        <div
          style={{ display: "flex", overflowX: "hidden", gap: 8 }}
          ref={dailyTabsRef}
        >
          {dailyForecast.map((d, i) => (
            <div
              key={d.date}
              onClick={() => setSelectedDayIndex(i)}
              style={{
                minWidth: 140,
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
              <div>{d.dayName}</div>
              <img
                src={d.condition.icon}
                alt="icon"
                style={{ width: 40, height: 40 }}
              />
              <div>
                {d.min.toFixed(1)}°C — {d.max.toFixed(1)}°C
              </div>
            </div>
          ))}
        </div>
        <button
          style={arrowStyle}
          onClick={() =>
            setSelectedDayIndex((i) =>
              Math.min(i + 1, dailyForecast.length - 1)
            )
          }
        >
          ▶
        </button>
      </div>

      {/* Hourly table */}
      <h2>Πρόγνωση ανά ώρα — {dailyForecast[selectedDayIndex].dayName}</h2>
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
              <th style={thStyle}>Ώρα</th>
              <th style={thStyle}>Θερμοκρασία</th>
              <th style={thStyle}>Εικονίδιο</th>
              <th style={thStyle}>Υγρασία</th>
              <th style={thStyle}>Βροχή (mm)</th>
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
                <td style={tdStyle}>{h.time.slice(11, 16)}</td>
                <td style={tdStyle}>{h.temp.toFixed(1)}°C</td>
                <td style={tdStyle}>
                  <img
                    src={h.condition.icon}
                    alt="icon"
                    style={{ width: 28, height: 28 }}
                  />
                </td>
                <td style={tdStyle}>{h.humidity}%</td>
                <td style={tdStyle}>{h.rain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <h3 style={{ marginTop: 16 }}>📊 Διάγραμμα Θερμοκρασίας & Βροχής</h3>
      <div style={{ background: panelBg, borderRadius: 10, padding: 10 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={hourlyForSelectedDay.map((h) => ({
              time: h.time.slice(11, 16),
              temp: h.temp,
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
    </div>
  );
}
