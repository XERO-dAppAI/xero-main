use ic_cdk::export::candid::CandidType;
use ic_cdk_macros::{init, update};
use serde::Deserialize;
use std::io::Cursor;
use csv::ReaderBuilder;

/// Struct representing a parsed inventory item from CSV.
#[derive(CandidType, Deserialize, Clone, Debug, Default)]
struct ParsedInventoryItem {
    item_id: String,
    name: String,
    quantity: u32,
    expiration_date: u64,
}

/// Alias for a collection of parsed inventory items.
type ParsedInventory = Vec<ParsedInventoryItem>;

/// Initialize the canister's state if needed.
#[init]
fn init() {
    ic_cdk::println!("Data aggregator canister initialized");
}

/// Update method for uploading and parsing CSV data.
#[update]
fn upload_inventory_csv(csv_data: Vec<u8>) -> Result<String, String> {
    let cursor = Cursor::new(csv_data);
    let mut rdr = ReaderBuilder::new()
        .has_headers(true)
        .from_reader(cursor);

    let mut parsed_items: ParsedInventory = Vec::new();

    for result in rdr.deserialize() {
        let record: ParsedInventoryItem = result.map_err(|e| format!("Failed to parse CSV: {}", e))?;
        parsed_items.push(record);
    }

    Ok(format!("Successfully parsed {} items", parsed_items.len()))
}
