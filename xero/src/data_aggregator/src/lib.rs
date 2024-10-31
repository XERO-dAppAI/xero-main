// Import necessary modules and libraries
use ic_cdk_macros::update;
use serde::{Serialize, Deserialize};
use candid::CandidType;
use std::collections::HashMap;
use time::{OffsetDateTime, format_description::well_known::Rfc3339};
use std::cell::RefCell;

#[derive(Serialize, Deserialize, CandidType, Clone, Debug)]
pub struct InventoryItem {
    pub id: u32,
    pub name: String,
    pub quantity: u32,
    pub expiration_date: u64,
}

pub struct DataAggregator {
    pub items: HashMap<u32, InventoryItem>, // Stores items by their unique IDs
    pub logs: Vec<String>,                  // Log to store upload activity
}

impl DataAggregator {
    pub fn new() -> Self {
        DataAggregator {
            items: HashMap::new(),
            logs: Vec::new(),
        }
    }

    pub fn log_upload(&mut self) {
        let now = OffsetDateTime::now_utc().format("%Y-%m-%d %H:%M:%S");
        self.logs.push(format!("Data uploaded at {}", now));
    }

    pub fn add_items(&mut self, items: Vec<InventoryItem>) {
        for item in items {
            self.items.insert(item.id, item);
        }
        self.log_upload(); // Log upload time whenever items are added
    }
}

thread_local! {
    static DATA_AGGREGATOR: RefCell<DataAggregator> = RefCell::new(DataAggregator::new());
}

#[update]
fn upload_inventory_data(file_data: Vec<u8>) -> Result<(), String> {
    ic_cdk::println!("Received file data with size: {} bytes", file_data.len());

    // Placeholder for actual parsing logic
    let parsed_items: Vec<InventoryItem> = vec![]; // Replace this with parsed data

    DATA_AGGREGATOR.with(|aggregator| {
        aggregator.borrow_mut().add_items(parsed_items);
    });

    Ok(())
}
