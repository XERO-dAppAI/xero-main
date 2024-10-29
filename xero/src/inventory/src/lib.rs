use ic_cdk_macros::{update, query};
use serde::{Serialize, Deserialize};
use candid::CandidType;
use std::collections::HashMap;
use time::{OffsetDateTime, format_description::well_known::Rfc3339};

#[derive(Serialize, Deserialize, CandidType, Clone, Debug)]
pub struct InventoryItem {
    pub id: u32,
    pub name: String,
    pub quantity: u32,
    pub expiration_date: u64,
}

pub struct InventoryManager {
    pub items: HashMap<u32, InventoryItem>,
    pub logs: Vec<String>,  // New field to store logs
}

impl InventoryManager {
    pub fn new() -> Self {
        InventoryManager {
            items: HashMap::new(),
            logs: Vec::new(),
        }
    }

    // Helper function to get the current timestamp as a string
    pub fn get_current_time() -> String {
        let now = OffsetDateTime::now_utc();
        now.format(&Rfc3339).unwrap_or_else(|_| "Invalid time".to_string())
    }

    pub fn add_item(&mut self, item: InventoryItem) {
        self.items.insert(item.id, item.clone());
        let log = format!(
            "Item {} added at {}",
            item.id,
            InventoryManager::get_current_time()
        );
        self.logs.push(log);
    }

    pub fn get_item(&self, id: u32) -> Option<&InventoryItem> {
        self.items.get(&id)
    }

    pub fn update_item_quantity(&mut self, id: u32, quantity: u32) {
        if let Some(item) = self.items.get_mut(&id) {
            item.quantity = quantity;
            let log = format!(
                "Item {} quantity updated to {} at {}",
                id,
                quantity,
                InventoryManager::get_current_time()
            );
            self.logs.push(log);
        }
    }

    pub fn remove_item(&mut self, id: u32) {
        if self.items.remove(&id).is_some() {
            let log = format!(
                "Item {} removed at {}",
                id,
                InventoryManager::get_current_time()
            );
            self.logs.push(log);
        }
    }

    // New method to get all logs
    pub fn get_logs(&self) -> Vec<String> {
        self.logs.clone()
    }
}

thread_local! {
    static INVENTORY_MANAGER: std::cell::RefCell<InventoryManager> = std::cell::RefCell::new(InventoryManager::new());
}

#[update]
fn add_inventory_item(id: u32, name: String, quantity: u32, expiration_date: u64) {
    let item = InventoryItem {
        id,
        name,
        quantity,
        expiration_date,
    };

    INVENTORY_MANAGER.with(|inventory| {
        inventory.borrow_mut().add_item(item);
    });
}

#[query]
fn get_inventory_item(id: u32) -> Option<InventoryItem> {
    INVENTORY_MANAGER.with(|inventory| {
        inventory.borrow().get_item(id).cloned()
    })
}

#[update]
fn update_inventory_quantity(id: u32, quantity: u32) {
    INVENTORY_MANAGER.with(|inventory| {
        inventory.borrow_mut().update_item_quantity(id, quantity);
    });
}

#[update]
fn remove_inventory_item(id: u32) {
    INVENTORY_MANAGER.with(|inventory| {
        inventory.borrow_mut().remove_item(id);
    });
}

// New function to return logs
#[query]
fn get_inventory_logs() -> Vec<String> {
    INVENTORY_MANAGER.with(|inventory| {
        inventory.borrow().get_logs()
    })
}
