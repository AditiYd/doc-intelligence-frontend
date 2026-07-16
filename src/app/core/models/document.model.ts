export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DocumentResponse {
  id: string;
  originalFileName: string;
  documentType: string | null;
  vendor: string | null;
  totalAmount: number | null;
  currency: string | null;
  documentDate: string | null;
  summary: string | null;
  status: 'PROCESSING' | 'DONE' | 'FAILED';
  uploadedAt: string;
  lineItems: LineItem[];
}

export interface StatsResponse {
  totalDocuments: number;
  totalSpend: number;
  byType: Record<string, number>;
}
