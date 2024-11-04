use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk_macros::{init, pre_upgrade, post_upgrade, query, update};
use std::cell::RefCell;
use std::collections::HashMap;
use serde::Serialize; // Import the Serialize trait
use serde_json::to_string_pretty; // Import for JSON formatting

/// Represents an item in the inventory.
#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Default)]
struct InventoryItem {
    item_id: String,
    name: String,
    quantity: u32, // nat32 equivalent
    expiration_date: u64, // Unix timestamp in nanoseconds
    last_updated: u64, // Unix timestamp in nanoseconds
    status: String, // "active" or "expiring"
}

/// Alias for a collection of inventory items.
type Inventory = HashMap<String, InventoryItem>;

// Thread-local storage for the inventory state.
thread_local! {
    static INVENTORY: RefCell<Inventory> = RefCell::new(HashMap::new());
}

/// Initializes the canister's state.
#[init]
fn init() {
    INVENTORY.with(|inventory| {
        *inventory.borrow_mut() = HashMap::new();
    });
}

/// Pre-upgrade hook to save the current state.
#[pre_upgrade]
fn pre_upgrade() {
    INVENTORY.with(|inventory| {
        ic_cdk::storage::stable_save((inventory.borrow().clone(),))
            .expect("Failed to save inventory during pre-upgrade");
    });
}

/// Post-upgrade hook to restore the state.
#[post_upgrade]
fn post_upgrade() {
    let (restored_inventory,): (Inventory,) = ic_cdk::storage::stable_restore()
        .expect("Failed to restore inventory after upgrade");
    INVENTORY.with(|inventory| {
        *inventory.borrow_mut() = restored_inventory;
    });
}

/// Adds or updates an inventory item.
#[update]
fn add_or_update_item(item_id: String, name: String, quantity: u32, expiration_date: u64) -> Result<String, String> {
    INVENTORY.with(|inventory| {
        let mut inventory = inventory.borrow_mut();

        // Validate input
        if name.trim().is_empty() {
            return Err("Item name cannot be empty.".to_string());
        }
        if quantity == 0 {
            return Err("Quantity must be greater than zero.".to_string());
        }
        if expiration_date <= ic_cdk::api::time() {
            return Err("Expiration date must be in the future.".to_string());
        }

        // Determine item status
        let status = if expiration_date < ic_cdk::api::time() + (7 * 24 * 60 * 60 * 1_000_000_000) {
            "expiring".to_string()
        } else {
            "active".to_string()
        };

        let new_item = InventoryItem {
            item_id: item_id.clone(),
            name,
            quantity,
            expiration_date,
            last_updated: ic_cdk::api::time(),
            status,
        };

        inventory.insert(item_id.clone(), new_item);
        Ok(format!("Item '{}' successfully added or updated.", item_id))
    })
}

/// Retrieves an inventory item by ID as a JSON string.
#[query]
fn get_item(item_id: String) -> Result<String, String> {
    INVENTORY.with(|inventory| {
        match inventory.borrow().get(&item_id) {
            Some(item) => {
                let item_json = to_string_pretty(item).unwrap_or_else(|_| "Failed to format item.".to_string());
                Ok(item_json)
            }
            None => Err("Item not found.".to_string()),
        }
    })
}

/// Retrieves all inventory items as a JSON string.
#[query]
fn get_all_items() -> String {
    INVENTORY.with(|inventory| {
        let items = inventory.borrow();
        if items.is_empty() {
            return "No items in inventory.".to_string();
        }

        let items_vec: Vec<_> = items.values().collect();
        to_string_pretty(&items_vec).unwrap_or_else(|_| "Failed to format items.".to_string())
    })
}

/// Removes an inventory item by ID.
#[update]
fn remove_item(item_id: String) -> Result<String, String> {
    INVENTORY.with(|inventory| {
        let mut inventory = inventory.borrow_mut();
        if inventory.remove(&item_id).is_some() {
            Ok(format!("Item '{}' has been removed from the inventory.", item_id))
        } else {
            Err("Item not found.".to_string())
        }
    })
}
