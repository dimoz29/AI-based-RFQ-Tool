
import { useState } from "react";
import api from "../../lib/api";
import type { LineItem } from "../../lib/types";

export default function RFQForm({ onCreated }: { onCreated?: (id: string) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [items, setItems] = useState<LineItem[]>([{ name: "", quantity: 1, unit: "pcs" }]);

  const addItem = () => setItems([...items, { name: "", quantity: 1, unit: "pcs" }]);
  const updateItem = (i: number, patch: Partial<LineItem>) => setItems(items.map((it, idx) => idx===i? { ...it, ...patch } : it));

  const submit = async () => {
    const { data } = await api.post("/rfqs", { title, description, dueDate: dueDate || undefined, lineItems: items });
    onCreated?.(data.id);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <h3 className="font-semibold">Create RFQ</h3>
      <input className="border p-2 w-full rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="border p-2 w-full rounded" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input type="datetime-local" className="border p-2 w-full rounded" value={dueDate} onChange={e=>setDueDate(e.target.value)} />

      <div className="space-y-2">
        <div className="text-sm text-gray-600">Line Items</div>
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2">
            <input className="border p-2 rounded col-span-6" placeholder="Name" value={it.name} onChange={e=>updateItem(i,{name:e.target.value})} />
            <input type="number" className="border p-2 rounded col-span-2" value={it.quantity} onChange={e=>updateItem(i,{quantity:Number(e.target.value)})} />
            <input className="border p-2 rounded col-span-2" placeholder="Unit" value={it.unit} onChange={e=>updateItem(i,{unit:e.target.value})} />
            <input className="border p-2 rounded col-span-12" placeholder="Notes (optional)" value={it.notes ?? ""} onChange={e=>updateItem(i,{notes:e.target.value})} />
          </div>
        ))}
        <button onClick={addItem} className="px-3 py-2">+ Add item</button>
      </div>

      <button onClick={submit} className="px-4 py-2">Save RFQ</button>
    </div>
  );
}
