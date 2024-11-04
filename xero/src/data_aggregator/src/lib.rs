// Import necessary modules and libraries
use ic_cdk_macros::update;
use serde::{Serialize, Deserialize};
use candid::CandidType;
use std::collections::HashMap;
use std::cell::RefCell;

// Define the structure of each inventory item
#[derive(Serialize, Deserialize, CandidType, Clone, Debug)]
pub struct InventoryItem {
    pub id: u32,
    pub name: String,
    pub quantity: u32,
    pub expiration_date: u64,
}

// Define the Data Aggregator structure to store inventory items
pub struct DataAggregator {
    pub items: HashMap<u32, InventoryItem>, // Stores items by their unique IDs
}

impl DataAggregator {
    pub fn new() -> Self {
        DataAggregator {
            items: HashMap::new(),
        }
    }

    // Add items to the Data Aggregator
    pub fn add_items(&mut self, items: Vec<InventoryItem>) {
        for item in items {
            self.items.insert(item.id, item);
        }
    }
}

// Make DataAggregator a thread-local instance
thread_local! {
    static DATA_AGGREGATOR: RefCell<DataAggregator> = RefCell::new(DataAggregator::new());
}

// Update function to allow inventory data uploads
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
