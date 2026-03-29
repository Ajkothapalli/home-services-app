export enum QuoteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

export interface LineItem {
  itemId: string;
  description: string;
  quantity: number;
  unit: string;       // e.g. "hour", "unit", "sqft"
  unitPrice: number;  // in INR, excl. GST
  totalPrice: number; // quantity * unitPrice
}

export interface Quote {
  quoteId: string;
  jobId: string;
  userId: string;
  lineItems: LineItem[];
  subtotal: number;       // sum of lineItems totalPrice
  gstRate: number;        // e.g. 0.18
  gstAmount: number;      // subtotal * gstRate
  total: number;          // subtotal + gstAmount
  status: QuoteStatus;
  validityHours: number;  // 48
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  declinedAt?: Date;
  notes?: string;
}
