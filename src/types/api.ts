export interface VendorInvoiceData {
  orderNumber: string;
  orderDate: string;
  vendor: string;
  shipTo: string;
  items: VendorInvoiceItem[];
}

export interface VendorInvoiceItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface ErrorResponse {
  message: string;
  error: string;
  status: number;
}

export interface ExtractedPdfData {
  header: Record<string, string>;
  item: Record<string, string>;
}

// export interface ExtractedPdfData {
//   id: string;
//   status: 'processing' | 'completed' | 'failed';
//   message: string;
//   downloadUrl?: string;
//   extractedData?: ExtractedPdfData;
// }

export interface SelectedData {
  headerData: Record<string, string>;
  itemData: Record<string, string>;
}

export interface FieldConfig {
  fieldname: string;
  label: string;
  logic: 0 | 1 | 2;
  pos: number;
  prompt: string;
  selected: boolean;
  first: string;
}

export interface FieldConfigurationData {
  header: Record<string, FieldConfig>;
  item: Record<string, FieldConfig>;
}

export interface ConfigurePdfResponse {
  name: string;
  header: Record<string, FieldConfig>;
  item: Record<string, FieldConfig>;
}
