use candid::{CandidType, Deserialize};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};
use std::cell::RefCell;
use std::collections::HashMap;

// Type definitions
#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum ProcessingStatus {
    Pending,
    Processing,
    Completed,
    Failed,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum DataSource {
    Excel,
    CSV,
    API,
    Manual,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct ValidationRule {
    rule_id: String,
    field: String,
    condition: String,
    error_message: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct ProcessedData {
    batch_id: String,
    source: DataSource,
    timestamp: u64,
    status: ProcessingStatus,
    records_count: u32,
    success_count: u32,
    error_count: u32,
    validation_errors: Vec<String>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct DataBatch {
    batch_id: String,
    data: Vec<InventoryItem>,
    status: ProcessingStatus,
    created_at: u64,
    processed_at: Option<u64>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct InventoryItem {
    item_id: String,
    barcode: String,
    name: String,
    category: Option<String>,
    quantity: u32,
    expiration_date: u64,
    price: f64,
}

// State management
thread_local! {
    static BATCHES: RefCell<HashMap<String, DataBatch>> = RefCell::new(HashMap::new());
    static VALIDATION_RULES: RefCell<HashMap<String, ValidationRule>> = RefCell::new(HashMap::new());
    static PROCESSING_STATS: RefCell<ProcessingStatistics> = RefCell::new(ProcessingStatistics::default());
}

#[derive(CandidType, Deserialize, Clone, Debug, Default)]
pub struct ProcessingStatistics {
    total_batches: u64,
    successful_batches: u64,
    failed_batches: u64,
    total_records: u64,
    success_rate: f64,
}

// Implementation
#[init]
fn init() {
    ic_cdk::println!("Data Aggregator initialized");
}

#[update]
async fn upload_inventory_excel(data: Vec<u8>) -> Result<ProcessedData, String> {
    let batch_id = generate_batch_id();
    let now = ic_cdk::api::time();

    // Process Excel data
    match process_excel_data(&data).await {
        Ok(items) => {
            let batch = DataBatch {
                batch_id: batch_id.clone(),
                data: items.clone(),
                status: ProcessingStatus::Pending,
                created_at: now,
                processed_at: None,
            };

            BATCHES.with(|batches| {
                batches.borrow_mut().insert(batch_id.clone(), batch);
            });

            // Process the batch
            process_batch(batch_id).await
        }
        Err(e) => Err(format!("Failed to process Excel data: {}", e)),
    }
}

#[update]
async fn process_batch(batch_id: String) -> Result<ProcessedData, String> {
    let batch = BATCHES.with(|batches| {
        batches
            .borrow()
            .get(&batch_id)
            .cloned()
            .ok_or_else(|| "Batch not found".to_string())
    })?;

    // Validate data
    let validation_results = validate_batch(&batch);
    
    // Update inventory if validation passes
    if validation_results.is_empty() {
        match update_inventory(&batch).await {
            Ok(_) => {
                let processed_data = ProcessedData {
                    batch_id: batch_id.clone(),
                    source: DataSource::Excel,
                    timestamp: ic_cdk::api::time(),
                    status: ProcessingStatus::Completed,
                    records_count: batch.data.len() as u32,
                    success_count: batch.data.len() as u32,
                    error_count: 0,
                    validation_errors: vec![],
                };

                update_processing_stats(true, batch.data.len());
                
                Ok(processed_data)
            }
            Err(e) => {
                update_processing_stats(false, batch.data.len());
                Err(format!("Failed to update inventory: {}", e))
            }
        }
    } else {
        update_processing_stats(false, batch.data.len());
        Err(format!("Validation failed: {:?}", validation_results))
    }
}

// Helper functions
fn generate_batch_id() -> String {
    format!("BATCH_{}", ic_cdk::api::time())
}

async fn process_excel_data(excel_data: &[u8]) -> Result<Vec<InventoryItem>, String> {
    if excel_data.is_empty() {
        return Err("Empty Excel data provided".to_string());
    }

    // Basic implementation for Excel processing
    let mut items = Vec::new();
    
    // TODO: Implement actual Excel parsing using the excel_data
    // For now, we'll create a sample item
    items.push(InventoryItem {
        item_id: "TEST_001".to_string(),
        barcode: "123456789".to_string(),
        name: "Test Item".to_string(),
        category: Some("Test Category".to_string()),
        quantity: 10,
        expiration_date: ic_cdk::api::time() + 86400_000, // 24 hours from now
        price: 9.99,
    });

    Ok(items)
}

fn validate_batch(batch: &DataBatch) -> Vec<String> {
    let mut errors = Vec::new();
    
    VALIDATION_RULES.with(|rules| {
        for item in &batch.data {
            for rule in rules.borrow().values() {
                if !validate_item(item, rule) {
                    errors.push(rule.error_message.clone());
                }
            }
        }
    });

    errors
}

fn validate_item(item: &InventoryItem, rule: &ValidationRule) -> bool {
    match rule.field.as_str() {
        "name" => !item.name.is_empty(),
        "quantity" => item.quantity > 0,
        "price" => item.price > 0.0,
        _ => true,
    }
}

async fn update_inventory(batch: &DataBatch) -> Result<(), String> {
    let items_count = batch.data.len();
    
    // TODO: Implement actual inventory update
    // For now, we'll just log the update
    ic_cdk::println!(
        "Updating inventory with {} items from batch {}",
        items_count,
        batch.batch_id
    );

    // Simulate some processing time
    // In a real implementation, this would be an inter-canister call
    if items_count > 0 {
        Ok(())
    } else {
        Err("No items to update".to_string())
    }
}

fn update_processing_stats(success: bool, record_count: usize) {
    PROCESSING_STATS.with(|stats| {
        let mut stats = stats.borrow_mut();
        stats.total_batches += 1;
        stats.total_records += record_count as u64;
        if success {
            stats.successful_batches += 1;
        } else {
            stats.failed_batches += 1;
        }
        stats.success_rate = (stats.successful_batches as f64 / stats.total_batches as f64) * 100.0;
    });
}

// Query methods
#[query]
fn get_processing_statistics() -> ProcessingStatistics {
    PROCESSING_STATS.with(|stats| stats.borrow().clone())
}

#[query]
fn get_validation_rules() -> Vec<ValidationRule> {
    VALIDATION_RULES.with(|rules| rules.borrow().values().cloned().collect())
}

// State management
#[pre_upgrade]
fn pre_upgrade() {
    // Implement state saving logic here
}

#[post_upgrade]
fn post_upgrade() {
    // Implement state restoration logic here
}


