use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk_macros::{init, query, update};
use serde::Serialize;
use std::cell::RefCell;
use std::collections::HashMap;

/// Pricing rule struct to define and track each rule.
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
struct PricingRule {
    rule_name: String,
    rule_description: String,
    active: bool,
}

/// Struct to represent the result of a price adjustment.
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
struct PriceAdjustmentResult {
    item_id: String,
    new_price: f32,
}

/// Store the pricing rules and logic settings in thread-local storage.
thread_local! {
    static PRICING_RULES: RefCell<HashMap<String, PricingRule>> = RefCell::new(HashMap::new());
}

/// Initialize default pricing rules.
#[init]
fn init() {
    PRICING_RULES.with(|rules| {
        let mut rules = rules.borrow_mut();
        rules.insert(
            "near_expiration".to_string(),
            PricingRule {
                rule_name: "near_expiration".to_string(),
                rule_description: "Reduce price by 30% if item is within 3 days of expiration.",
                active: true,
            },
        );
        rules.insert(
            "low_stock_high_demand".to_string(),
            PricingRule {
                rule_name: "low_stock_high_demand".to_string(),
                rule_description: "Increase price by 10% if demand is high and stock is low.",
                active: true,
            },
        );
    });
}

/// Adjust the price of an item based on active pricing rules.
#[update]
async fn adjust_price(item_id: String) -> Result<PriceAdjustmentResult, String> {
    // Fetch item details from the inventory canister.
    let inventory_canister_id = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
    let item_details: Result<(f32, u64), String> = ic_cdk::api::call::call(
        inventory_canister_id,
        "get_item_details",
        (item_id.clone(),),
    )
    .await
    .map_err(|e| format!("Failed to fetch item details: {:?}", e))?;

    let (base_price, expiration_date) = item_details?;

    let mut new_price = base_price;

    // Apply the pricing rules.
    PRICING_RULES.with(|rules| {
        let rules = rules.borrow();

        if let Some(rule) = rules.get("near_expiration") {
            if rule.active && expiration_date <= ic_cdk::api::time() + (3 * 24 * 60 * 60 * 1_000_000_000) {
                new_price *= 0.7; // Reduce price by 30%
            }
        }

        if let Some(rule) = rules.get("low_stock_high_demand") {
            if rule.active && check_low_stock_high_demand(item_id.clone()) {
                new_price *= 1.1; // Increase price by 10%
            }
        }
    });

    // Log the price adjustment to the ledger canister (optional).
    let ledger_canister_id = "be2us-64aaa-aaaaa-qaabq-cai";
    let _log_result: Result<(), String> = ic_cdk::api::call::call(
        ledger_canister_id,
        "add_transaction",
        (
            format!("price_adjustment_{}", item_id),
            "adjust_price".to_string(),
            format!("Adjusted price to {}", new_price),
            "price_engine".to_string(),
        ),
    )
    .await
    .map_err(|e| format!("Failed to log price adjustment: {:?}", e))?;

    Ok(PriceAdjustmentResult { item_id, new_price })
}

/// Helper function to check if an item has low stock and high demand.
fn check_low_stock_high_demand(_item_id: String) -> bool {
    // Placeholder logic - replace with actual inter-canister calls or conditions if needed.
    true
}

/// Retrieve the current list of pricing rules.
#[query]
fn get_pricing_rules() -> Vec<PricingRule> {
    PRICING_RULES.with(|rules| rules.borrow().values().cloned().collect())
}

/// Set a custom pricing rule.
#[update]
fn set_pricing_rule(rule_name: String, rule_description: String, active: bool) -> Result<String, String> {
    PRICING_RULES.with(|rules| {
        let mut rules = rules.borrow_mut();
        rules.insert(
            rule_name.clone(),
            PricingRule {
                rule_name,
                rule_description,
                active,
            },
        );
    });
    Ok("Pricing rule updated successfully.".to_string())
}
