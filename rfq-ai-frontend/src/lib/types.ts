
export type Role = "BUYER" | "SUPPLIER" | "ADMIN";
export type LineItem = { name: string; quantity: number; unit: string; notes?: string };
export type RFQ = {
  id: string; title: string; description: string; status: "DRAFT"|"PUBLISHED"|"CLOSED";
  dueDate?: string; lineItems: LineItem[];
};
export type SupplierResponse = { id: string; rfqId: string; supplierId: string; message: string; priceTotal?: number; leadDays?: number };
