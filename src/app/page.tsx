"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import SensorCard from "@/components/SensorCard"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

// Definimos un tipo para cada registro
type Registro = {
  fecha: string
  temperatura: number | null
  horaTemp: string
  humedad: number | null
  horaHum: string
}

export default function Home() {
  const [temperatura, setTemperatura] = useState<number | null>(null)
  const [humedad, setHumedad] = useState<number | null>(null)
  const [history, setHistory] = useState<Registro[]>([])
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchData()

    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    const temp = await supabase
      .from("temperaturas")
      .select("valor, created_at")
      .order("created_at", { ascending: false })
      .limit(10)

    const hum = await supabase
      .from("humedad")
      .select("valor, created_at")
      .order("created_at", { ascending: false })
      .limit(10)

    if (!temp.error && temp.data.length > 0) setTemperatura(temp.data[0].valor)
    if (!hum.error && hum.data.length > 0) setHumedad(hum.data[0].valor)

    if (temp.data && hum.data) {
      const merged: Registro[] = temp.data.map((t, i) => ({
        fecha: new Date(t.created_at).toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temperatura: t.valor,
        horaTemp: new Date(t.created_at).toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        humedad: hum.data[i]?.valor ?? null,
        horaHum: hum.data[i]
          ? new Date(hum.data[i].created_at).toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "",
      }))
      setHistory(merged.reverse())
    }
  }

  return (
    <main
      style={{
        padding: "20px",
        background: "linear-gradient(#17202A, #2C3E50)",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          color: "#ECF0F1",
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "2.5rem", // Título más grande
        }}
      >
        📡 Dashboard IoT
      </h1>

      <SensorCard title="🌡 Temperatura" value={temperatura} unit="°C" />
      <SensorCard title="💧 Humedad" value={humedad} unit="%" />

      <div
        style={{
          background: "#1F2A38",
          borderRadius: "16px",
          padding: "20px",
          marginTop: "30px",
          color: "#ECF0F1",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#ECF0F1" }}>📊 Historial</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temperatura"
              stroke="#e74c3c"
              strokeWidth={hoverIndex !== null ? 4 : 2}
              dot
            />
            <Line
              type="monotone"
              dataKey="humedad"
              stroke="#3498db"
              strokeWidth={hoverIndex !== null ? 4 : 2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Mini historial interactivo */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#ECF0F1", marginBottom: "10px" }}>
            Últimos registros
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {history.map((item, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{
                  background: hoverIndex === index ? "#576574" : "#2C3E50",
                  borderRadius: "12px",
                  padding: "10px 15px",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#ECF0F1",
                  fontSize: "14px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                <span>🌡 {item.temperatura?.toFixed(1)} °C ({item.horaTemp})</span>
                <span>💧 {item.humedad?.toFixed(1)} % ({item.horaHum})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
