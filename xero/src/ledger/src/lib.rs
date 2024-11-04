use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk_macros::{init, query, update};
use std::cell::RefCell;
use std::collections::HashMap;

/// Represents a transaction in the ledger.
#[derive(CandidType, Deserialize, Clone, Debug)]
struct Transaction {
    transaction_id: String,
    timestamp: u64, // Unix timestamp
    action_type: String, // e.g., "add_item", "update_item", "remove_item"
    details: String, // JSON or structured details about the transaction
    actor_id: String, // ID of the actor who initiated the transaction
}

/// Type alias for a collection of transactions.
type Ledger = Vec<Transaction>;

// Thread-local storage for the ledger state.
thread_local! {
    static LEDGER: RefCell<Ledger> = RefCell::new(Vec::new());
    static TRANSACTION_INDEX: RefCell<HashMap<String, usize>> = RefCell::new(HashMap::new());
}

#[init]
fn init() {
    LEDGER.with(|ledger| {
        *ledger.borrow_mut() = Vec::new();
    });
    TRANSACTION_INDEX.with(|index| {
        *index.borrow_mut() = HashMap::new();
    });
}

/// Adds a transaction to the ledger.
#[update]
fn add_transaction(transaction_id: String, action_type: String, details: String, actor_id: String) -> Result<String, String> {
    let timestamp = ic_cdk::api::time();
    
    // Ensure transaction_id is unique
    if TRANSACTION_INDEX.with(|index| index.borrow().contains_key(&transaction_id)) {
        return Err("Transaction ID already exists.".to_string());
    }

    let transaction = Transaction {
        transaction_id: transaction_id.clone(),
        timestamp,
        action_type,
        details,
        actor_id,
    };

    // Add the transaction to the ledger and update index
    LEDGER.with(|ledger| {
        TRANSACTION_INDEX.with(|index| {
            let mut ledger = ledger.borrow_mut();
            let mut index = index.borrow_mut();
            
            index.insert(transaction_id.clone(), ledger.len());
            ledger.push(transaction);
        });
    });

    Ok(format!("Transaction '{}' successfully added.", transaction_id))
}

/// Retrieves a specific transaction by ID.
#[query]
fn get_transaction(transaction_id: String) -> Result<Transaction, String> {
    TRANSACTION_INDEX.with(|index| {
        LEDGER.with(|ledger| {
            let index = index.borrow();
            let ledger = ledger.borrow();

            index
                .get(&transaction_id)
                .and_then(|&pos| ledger.get(pos))
                .cloned()
                .ok_or_else(|| "Transaction not found.".to_string())
        })
    })
}

/// Lists all transactions in the ledger.
#[query]
fn list_transactions() -> Vec<Transaction> {
    LEDGER.with(|ledger| ledger.borrow().clone())
}
