
import { useState } from "react";
import api from "../lib/api";

export default function AIAssistantPanel() {
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState<string|undefined>();
  const [summary, setSummary] = useState<string|undefined>();

  const makeDraft = async () => {
    const { data } = await api.post("/ai/rfq-draft", { prompt });
    setDraft(data.draft);
  };

  const summarize = async (rfqId: string) => {
    const { data } = await api.post(`/ai/summarize/${rfqId}`);
    setSummary(data.summary);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <h3 className="font-semibold">AI Assistant</h3>
      <textarea className="border p-2 w-full rounded" placeholder="Describe your RFQ scope..." value={prompt} onChange={e=>setPrompt(e.target.value)} />
      <button onClick={makeDraft} className="px-4 py-2">Draft RFQ</button>
      {draft && (<pre className="bg-gray-50 p-3 rounded overflow-auto whitespace-pre-wrap">{draft}</pre>)}
      {summary && (<pre className="bg-gray-50 p-3 rounded overflow-auto whitespace-pre-wrap">{summary}</pre>)}
    </div>
  );
}
