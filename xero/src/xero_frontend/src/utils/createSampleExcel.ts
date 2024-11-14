import * as XLSX from 'xlsx';

export const createInventorySampleExcel = () => {
  const data = [
    {
      item_id: "ITEM001",
      barcode: "123456789",
      name: "Sample Product 1",
      category: "Grocery",
      quantity: 100,
      expiration_date: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
      price: 9.99
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventory");
  XLSX.writeFile(wb, "inventory_template.xlsx");
};

export const createLedgerSampleExcel = () => {
  const data = [
    {
      transaction_id: "TXN001",
      timestamp: new Date().getTime(),
      action_type: "add_item",
      details: "Added new inventory item",
      actor_id: "USER001"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  XLSX.writeFile(wb, "ledger_template.xlsx");
}; 