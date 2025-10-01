import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [temperatura, setTemperatura] = useState<number | null>(null);

  useEffect(() => {
    fetchUltimaTemperatura();
  }, []);

  const fetchUltimaTemperatura = async () => {
    const { data, error } = await supabase
      .from("temperaturas")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) console.error(error);
    else setTemperatura(data?.valor ?? null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📡 Dashboard IoT</h1>
      <p>Última temperatura: {temperatura ?? "--"} °C</p>
      <button onClick={fetchUltimaTemperatura}>Actualizar</button>
    </div>
  );
}
