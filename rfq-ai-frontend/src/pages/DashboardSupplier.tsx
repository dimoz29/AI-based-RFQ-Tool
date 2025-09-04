
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function DashboardSupplier(){
  const [rfqs, setRfqs] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const { data } = await api.get("/rfqs"); setRfqs(data); })(); },[]);
  const respond = async (rfqId: string) => {
    await api.post(`/rfqs/${rfqId}/responses`, { message: "Hello, see attached.", priceTotal: 1000, leadDays: 14 });
    alert("Response sent");
  };
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Open RFQs</h2>
      <ul className="space-y-2">
        {rfqs.map(r => (
          <li key={r.id} className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
            <div>
              <div className="font-medium">{r.title}</div>
              <div className="text-sm text-gray-600">{r.description}</div>
            </div>
            <button onClick={()=>respond(r.id)} className="px-3 py-2">Respond</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
