import type { Invoice, InvoiceItem } from '@prisma/client';

export type InvoiceWithItems = Invoice & {
  invoiceItems: InvoiceItem[];
};

export interface InvoiceOutline {
  invId: string;
  invoiceDate: Date;
  clientCompany: string;
  invoiceTotal: number;
  status: string;
  clientName: string;
  clientName2: string;
  clientEmail: string;
  clientEmail2: string;
}

export interface InvoiceDraft {
  id?: number;
  invId: string;
  clientCompany: string;
  clientName: string;
  clientName2?: string | null;
  clientEmail: string;
  clientEmail2?: string | null;
  currencyType: string;
  exchangeCost: number;
  eta: string;
  invoiceDate: string;
  paymentDueDate: Date | string | null;
  paymentType: string;
  notes: string;
  invoiceSubtotal?: number;
  invoiceTax?: number;
  invoiceTotal?: number;
  status: string;
  invoiceItems: InvoiceItems[];
}

export interface InvoiceItems {
  itemId: string;
  itemName: string | null;
  condition: string;
  qty: number;
  partNo: string | null;
  price: number;
  total: number;
}
