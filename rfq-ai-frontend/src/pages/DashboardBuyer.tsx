
import { useEffect, useState } from "react";
import api from "../lib/api";
import DataTable from "../components/DataTable";
import RFQForm from "../components/forms/RFQForm";
import { Link } from "react-router-dom";

export default function DashboardBuyer(){
  const [rfqs, setRfqs] = useState<any[]>([]);
  const refresh = async ()=>{ const { data } = await api.get("/rfqs"); setRfqs(data); };
  useEffect(()=>{ refresh(); },[]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-2">My RFQs</h2>
          <DataTable rows={rfqs} columns={[{key:'title',header:'Title'},{key:'status',header:'Status'}]} />
          <div className="text-right mt-2 text-sm text-gray-600">Click a row to view details</div>
          <ul className="list-disc pl-6">
            {rfqs.map(r => <li key={r.id}><Link to={`/rfq/${r.id}`}>{r.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <RFQForm onCreated={()=>refresh()} />
        </div>
      </div>
    </div>
  );
}
