use candid::{CandidType, Deserialize};
use ic_cdk_macros::{init, pre_upgrade, post_upgrade, query, update};
use std::cell::RefCell;
use std::collections::HashMap;
use serde::Serialize;
use serde_json::to_string_pretty;
use chrono::DateTime;

// Constants for configuration
const LOW_STOCK_THRESHOLD: u32 = 10;
const EXPIRING_SOON_DAYS: u64 = 7;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, PartialEq)]
pub enum ItemStatus {
    Active,
    ExpiringSoon,
    Expired,
    LowStock,
    OutOfStock,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, PartialEq)]
pub enum ItemCategory {
    Produce,
    Dairy,
    Meat,
    Bakery,
    Grocery,
    Other,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
struct AuditLog {
    timestamp: u64,
    action: String,
    details: String,
    actor: String,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct InventoryItem {
    item_id: String,
    barcode: String,
    name: String,
    category: Option<ItemCategory>,
    quantity: u32,
    expiration_date: u64,
    price: f64,
    last_updated: u64,
    status: ItemStatus,
    audit_trail: Vec<AuditLog>,
}

// Pagination structure for query results
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct PaginatedResult {
    items: Vec<InventoryItem>,
    total: usize,
    page: usize,
    per_page: usize,
}

// Search criteria for filtering inventory
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct SearchCriteria {
    keyword: Option<String>,
    category: Option<ItemCategory>,
    status: Option<ItemStatus>,
    min_quantity: Option<u32>,
    max_price: Option<f64>,
}

type Inventory = HashMap<String, InventoryItem>;
type BarcodeIndex = HashMap<String, String>; // Maps barcode to item_id

thread_local! {
    static INVENTORY: RefCell<Inventory> = RefCell::new(HashMap::new());
    static BARCODE_INDEX: RefCell<BarcodeIndex> = RefCell::new(HashMap::new());
}

// Helper function to format timestamp as human-readable date
#[allow(dead_code)]
fn format_timestamp(timestamp: u64) -> String {
    let seconds = (timestamp / 1_000_000_000) as i64;
    let naive = DateTime::from_timestamp(seconds, 0)
        .unwrap_or_default()
        .naive_utc();
    naive.format("%Y-%m-%d %H:%M:%S").to_string()
}

#[init]
fn init() {
    INVENTORY.with(|inventory| {
        *inventory.borrow_mut() = HashMap::new();
    });
    BARCODE_INDEX.with(|index| {
        *index.borrow_mut() = HashMap::new();
    });
}

#[update]
fn add_or_update_item(
    item_id: String,
    barcode: String,
    name: String,
    category: Option<ItemCategory>,
    quantity: u32,
    expiration_date: u64,
    price: f64,
) -> Result<String, String> {
    if name.trim().is_empty() {
        return Err("Item name cannot be empty.".to_string());
    }
    if barcode.trim().is_empty() {
        return Err("Barcode cannot be empty.".to_string());
    }
    if price <= 0.0 {
        return Err("Price must be greater than zero.".to_string());
    }

    let status = determine_item_status(quantity, expiration_date);
    let now = ic_cdk::api::time();
    
    let audit_log = AuditLog {
        timestamp: now,
        action: "add_or_update".to_string(),
        details: format!("Updated quantity: {}, price: {}", quantity, price),
        actor: "system".to_string(), // TODO: Implement actual user tracking
    };

    let new_item = InventoryItem {
        item_id: item_id.clone(),
        barcode: barcode.clone(),
        name,
        category,
        quantity,
        expiration_date,
        price,
        last_updated: now,
        status,
        audit_trail: vec![audit_log],
    };

    INVENTORY.with(|inventory| {
        let mut inventory = inventory.borrow_mut();
        inventory.insert(item_id.clone(), new_item);
    });

    BARCODE_INDEX.with(|index| {
        let mut index = index.borrow_mut();
        index.insert(barcode, item_id.clone());
    });

    Ok(format!("Item '{}' successfully added or updated.", item_id))
}

fn determine_item_status(quantity: u32, expiration_date: u64) -> ItemStatus {
    let now = ic_cdk::api::time();
    
    if quantity == 0 {
        return ItemStatus::OutOfStock;
    }
    
    if quantity <= LOW_STOCK_THRESHOLD {
        return ItemStatus::LowStock;
    }
    
    let expiration_threshold = now.saturating_add(EXPIRING_SOON_DAYS * 24 * 60 * 60 * 1_000_000_000);
    
    if expiration_date <= now {
        ItemStatus::Expired
    } else if expiration_date <= expiration_threshold {
        ItemStatus::ExpiringSoon
    } else {
        ItemStatus::Active
    }
}

#[query]
fn get_item(id: String) -> Result<String, String> {
    INVENTORY.with(|inventory| {
        inventory
            .borrow()
            .get(&id)
            .map(|item| to_string_pretty(item).unwrap_or_default())
            .ok_or_else(|| format!("Item with ID '{}' not found", id))
    })
}

#[query]
fn get_item_by_barcode(barcode: String) -> Result<String, String> {
    BARCODE_INDEX.with(|index| {
        if let Some(item_id) = index.borrow().get(&barcode) {
            get_item(item_id.clone())
        } else {
            Err(format!("Item with barcode '{}' not found", barcode))
        }
    })
}

#[query]
fn get_all_items(page: Option<usize>, per_page: Option<usize>) -> PaginatedResult {
    INVENTORY.with(|inventory| {
        let inventory = inventory.borrow();
        let total = inventory.len();
        let per_page = per_page.unwrap_or(50);
        let page = page.unwrap_or(1);
        let start = (page - 1) * per_page;
        
        let items: Vec<InventoryItem> = inventory
            .values()
            .skip(start)
            .take(per_page)
            .cloned()
            .collect();

        PaginatedResult {
            items,
            total,
            page,
            per_page,
        }
    })
}

#[query]
fn get_all_items_formatted(page: Option<u32>, per_page: Option<u32>) -> String {
    let page = page.map(|p| p as usize);
    let per_page = per_page.map(|p| p as usize);
    let result = get_all_items(page, per_page);
    
    let mut output = format!("\nInventory Items (Page {} of {}, {} items per page)\n",
        result.page,
        (result.total + result.per_page - 1) / result.per_page,
        result.per_page);
    output.push_str("=====================================\n\n");

    for item in result.items {
        output.push_str(&format!("Item ID: {}\n", item.item_id));
        output.push_str(&format!("Name: {}\n", item.name));
        output.push_str(&format!("Barcode: {}\n", item.barcode));
        output.push_str(&format!("Category: {}\n", 
            item.category.map_or("N/A".to_string(), |c| format!("{:?}", c))));
        output.push_str(&format!("Quantity: {}\n", item.quantity));
        output.push_str(&format!("Price: ${:.2}\n", item.price));
        output.push_str(&format!("Status: {:?}\n", item.status));
        output.push_str(&format!("Expiration: {}\n", format_timestamp(item.expiration_date)));
        output.push_str(&format!("Last Updated: {}\n", format_timestamp(item.last_updated)));
        output.push_str("\n-------------------------------------\n\n");
    }

    output
}

#[query]
fn search_inventory(criteria: SearchCriteria) -> Vec<InventoryItem> {
    INVENTORY.with(|inventory| {
        inventory
            .borrow()
            .values()
            .filter(|item| {
                let keyword_match = criteria.keyword.as_ref().map_or(true, |keyword| {
                    item.name.to_lowercase().contains(&keyword.to_lowercase()) ||
                    item.barcode.contains(keyword)
                });

                let category_match = criteria.category.as_ref().map_or(true, |category| {
                    item.category.as_ref() == Some(category)
                });

                let status_match = criteria.status.as_ref().map_or(true, |_status| {
                    matches!(&item.status, _status)
                });

                let quantity_match = criteria.min_quantity.map_or(true, |min| {
                    item.quantity >= min
                });

                let price_match = criteria.max_price.map_or(true, |max| {
                    item.price <= max
                });

                keyword_match && category_match && status_match && 
                quantity_match && price_match
            })
            .cloned()
            .collect()
    })
}

#[update]
fn remove_item(id: String) -> Result<String, String> {
    INVENTORY.with(|inventory| {
        let mut inventory = inventory.borrow_mut();
        if let Some(item) = inventory.remove(&id) {
            BARCODE_INDEX.with(|index| {
                let mut index = index.borrow_mut();
                index.remove(&item.barcode);
            });
            Ok(format!("Item '{}' successfully removed", id))
        } else {
            Err(format!("Item with ID '{}' not found", id))
        }
    })
}

#[query]
fn get_expiring_items(days_threshold: u64) -> Vec<InventoryItem> {
    let threshold = ic_cdk::api::time()
        .saturating_add(days_threshold * 24 * 60 * 60 * 1_000_000_000);
    
    INVENTORY.with(|inventory| {
        inventory
            .borrow()
            .values()
            .filter(|item| item.expiration_date <= threshold)
            .cloned()
            .collect()
    })
}

#[query]
fn get_low_stock_items() -> Vec<InventoryItem> {
    INVENTORY.with(|inventory| {
        inventory
            .borrow()
            .values()
            .filter(|item| item.quantity <= LOW_STOCK_THRESHOLD)
            .cloned()
            .collect()
    })
}

#[pre_upgrade]
fn pre_upgrade() {
    INVENTORY.with(|inventory| {
        let inventory_data = inventory.borrow();
        ic_cdk::storage::stable_save((&*inventory_data,)).unwrap();
    });
    
    BARCODE_INDEX.with(|index| {
        let index_data = index.borrow();
        ic_cdk::storage::stable_save((&*index_data,)).unwrap();
    });
}

#[post_upgrade]
fn post_upgrade() {
    let (inventory_data,): (Inventory,) = ic_cdk::storage::stable_restore().unwrap();
    let (index_data,): (BarcodeIndex,) = ic_cdk::storage::stable_restore().unwrap();
    
    INVENTORY.with(|inventory| {
        *inventory.borrow_mut() = inventory_data;
    });
    
    BARCODE_INDEX.with(|index| {
        *index.borrow_mut() = index_data;
    });
}
