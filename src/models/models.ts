export interface ItemsArrData {
  name: string;
  quantity: string;
  price: string;
  total?: any;
}

export interface singleData {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status?: string;
  senderAddress: {};
  clientAddress: {};
  items: any;
  total: number;
}
