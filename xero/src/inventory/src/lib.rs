// Import necessary libraries for serialization, deserialization, and canister functionality.
use ic_cdk_macros::{update, query};  // Import macros to define update and query methods for the canister
use candid::{CandidType, Deserialize}; // Import CandidType and Deserialize to enable serialization for IC canisters
use serde::{Serialize}; // Import Serialize from serde for standard Rust serialization
use std::collections::HashMap; // Import HashMap, a key-value store to manage the inventory

// Define the structure for an inventory item
// The InventoryItem struct represents an individual item in the inventory.
#[derive(Serialize, Deserialize, CandidType, Clone, Debug)]
pub struct InventoryItem {
    pub id: u32,               // Unique identifier for the item
    pub name: String,          // Name of the item (e.g., "Apple")
    pub quantity: u32,         // How many of this item are in stock
    pub expiration_date: u64,  // Expiration date stored as a UNIX timestamp
}

// Define the structure that will manage the entire inventory system.
// This struct will store all the items in a HashMap, where each item is identified by its ID.
pub struct InventoryManager {
    pub items: HashMap<u32, InventoryItem>,  // Store items by their unique ID
}

// Implement functions for InventoryManager to manage inventory items (add, get, update, and remove)
impl InventoryManager {
    // Create a new inventory system with empty storage (an empty HashMap)
    pub fn new() -> Self {
        InventoryManager {
            items: HashMap::new(),
        }
    }

    // Function to add a new item to the inventory
    pub fn add_item(&mut self, item: InventoryItem) {
        self.items.insert(item.id, item); // Insert the item into the HashMap using its ID as the key
    }

    // Function to get an item from the inventory by its ID
    pub fn get_item(&self, id: u32) -> Option<&InventoryItem> {
        self.items.get(&id) // Retrieve the item by its ID if it exists
    }

    // Function to update the quantity of an existing item in the inventory
    pub fn update_item_quantity(&mut self, id: u32, quantity: u32) {
        if let Some(item) = self.items.get_mut(&id) {
            item.quantity = quantity;  // Update the quantity if the item exists
        }
    }

    // Function to remove an item from the inventory
    pub fn remove_item(&mut self, id: u32) {
        self.items.remove(&id);  // Remove the item from the HashMap by its ID
    }
}

// THREAD-LOCAL storage for the InventoryManager, which keeps the canister state between function calls
thread_local! {
    static INVENTORY_MANAGER: std::cell::RefCell<InventoryManager> = std::cell::RefCell::new(InventoryManager::new());
}

// Expose the function to add a new item to the inventory as an `update` method.
// This function can be called externally to add items to the inventory.
#[update]
fn add_inventory_item(id: u32, name: String, quantity: u32, expiration_date: u64) {
    let item = InventoryItem {
        id,
        name,
        quantity,
        expiration_date,
    };

    // Store the new item in the inventory
    INVENTORY_MANAGER.with(|inventory| {
        inventory.borrow_mut().add_item(item);
    });
}

// Expose the function to retrieve an item from the inventory as a `query` method.
// This allows external callers to retrieve item details by item ID.
#[query]
fn get_inventory_item(id: u32) -> Option<InventoryItem> {
    // Clone the item to return it since the query function needs to return a value
    INVENTORY_MANAGER.with(|inventory| {
        inventory.borrow().get_item(id).cloned()
    })
}

// Expose the function to update the quantity of an existing inventory item as an `update` method.
// External callers can change the quantity of an item using this function.
#[update]
fn update_inventory_quantity(id: u32, quantity: u32) {
    INVENTORY_MANAGER.with(|inventory| {
        inventory.borrow_mut().update_item_quantity(id, quantity);
    });
}

// Expose the function to remove an item from the inventory as an `update` method.
// External callers can remove an item from the inventory using this function.
#[update]
fn remove_inventory_item(id: u32) {
    INVENTORY_MANAGER.with(|inventory| {
        inventory.borrow_mut().remove_item(id);
    });
}
