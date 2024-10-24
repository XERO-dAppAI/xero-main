use serde::{Deserialize, Serialize};  // For serializing and deserializing data

// Define the structure for an inventory item
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct InventoryItem {
    pub id: u32,               // Unique identifier for the item
    pub name: String,          // Name of the item (e.g., "Apple")
    pub quantity: u32,         // How many of this item are in stock
    pub expiration_date: u64,  // Expiration date stored as a UNIX timestamp
}

// Implement a function to create a new inventory item
impl InventoryItem {
    pub fn new(id: u32, name: String, quantity: u32, expiration_date: u64) -> Self {
        InventoryItem {
            id,
            name,
            quantity,
            expiration_date,
        }
    }
}



use std::collections::HashMap; // Import HashMap, which is like our storage system for items

// Define the structure to manage the entire inventory
pub struct InventoryManager {
    pub items: HashMap<u32, InventoryItem>,  // Store items by their unique ID
}

// Implement functions for InventoryManager to add, get, update, and remove items
impl InventoryManager {
    // Create a new inventory system (like starting with empty shelves)
    pub fn new() -> Self {
        InventoryManager {
            items: HashMap::new(),
        }
    }

    // Function to add an item to the inventory
    pub fn add_item(&mut self, item: InventoryItem) {
        self.items.insert(item.id, item);
    }

    // Function to get an item from the inventory by its ID
    pub fn get_item(&self, id: u32) -> Option<&InventoryItem> {
        self.items.get(&id)
    }

    // Function to update the quantity of an existing item
    pub fn update_item_quantity(&mut self, id: u32, quantity: u32) {
        if let Some(item) = self.items.get_mut(&id) {
            item.quantity = quantity;
        }
    }

    // Function to remove an item from the inventory
    pub fn remove_item(&mut self, id: u32) {
        self.items.remove(&id);
    }
}
