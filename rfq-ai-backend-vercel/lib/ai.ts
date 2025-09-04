
import type { SupplierResponse } from "@prisma/client";

export const draftRfq = (prompt: string) => {
  return `RFQ Draft\n\nScope:\n${prompt}\n\nDeliverables:\n- Itemized bill of materials\n- Delivery within 30 days\n\nEvaluation Criteria:\n- Price (50%)\n- Lead time (30%)\n- Quality & references (20%)`;
};

export const summarizeResponses = (responses: SupplierResponse[]) => {
  const lines = responses.map(r => `• ${r.id.slice(0,6)}: price=${r.priceTotal ?? "n/a"}, leadDays=${r.leadDays ?? "n/a"}`);
  return `Summary of ${responses.length} response(s):\n` + lines.join("\n");
};

export const recommendBest = (responses: SupplierResponse[]) => {
  const valid = responses.filter(r => r.priceTotal && r.leadDays);
  if (valid.length === 0) return { winnerId: null, scores: [] };
  const prices = valid.map(r => r.priceTotal as number);
  const leads = valid.map(r => r.leadDays as number);
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const minL = Math.min(...leads), maxL = Math.max(...leads);
  const scores = valid.map(r => {
    const pN = maxP === minP ? 0.5 : ((r.priceTotal! - minP) / (maxP - minP));
    const lN = maxL === minL ? 0.5 : ((r.leadDays! - minL) / (maxL - minL));
    const score = (1 - pN) * 0.6 + (1 - lN) * 0.4;
    return { id: r.id, supplierId: r.supplierId, score };
  }).sort((a,b) => b.score - a.score);
  return { winnerId: scores[0].id, scores };
};
