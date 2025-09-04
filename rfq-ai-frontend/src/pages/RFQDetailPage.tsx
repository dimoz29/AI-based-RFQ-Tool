
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import AIAssistantPanel from "../components/AIAssistantPanel";

export default function RFQDetailPage(){
  const { id } = useParams();
  const [rfq, setRfq] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);

  const refresh = async ()=>{
    const { data } = await api.get(`/rfqs/${id}`);
    setRfq(data); setResponses(data.responses ?? []);
  };
  useEffect(()=>{ refresh(); },[id]);

  const summarize = async () => {
    const { data } = await api.post(`/ai/summarize/${id}`);
    alert(data.summary);
  };
  const recommend = async () => {
    const { data } = await api.get(`/ai/recommendation/${id}`);
    alert(`Winner: ${data.winnerId}\n\nScores: ${data.scores.map((s:any)=>`${s.supplierId}: ${s.score.toFixed(2)}`).join("\n")}`);
  };

  if (!rfq) return null;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold">{rfq.title}</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{rfq.description}</p>
          <div className="mt-3">
            <h4 className="font-medium">Line Items</h4>
            <ul className="list-disc pl-6 text-sm">
              {rfq.lineItems.map((li:any)=>(<li key={li.id}>{li.quantity} {li.unit} – {li.name}</li>))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold">Supplier Responses</h3>
          <ul className="divide-y">
            {responses.map(r => (
              <li key={r.id} className="py-3">
                <div className="font-medium">{r.supplierId}</div>
                <div className="text-sm text-gray-600">{r.message}</div>
                <div className="text-sm">Price: {r.priceTotal ?? '—'} | Lead: {r.leadDays ?? '—'} days</div>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mt-3">
            <button onClick={summarize} className="px-3 py-2">Summarize</button>
            <button onClick={recommend} className="px-3 py-2">Recommend Best</button>
          </div>
        </div>
      </div>

      <AIAssistantPanel />
    </div>
  );
}
