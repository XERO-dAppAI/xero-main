use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use std::collections::HashMap;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};

#[derive(CandidType, Deserialize, Clone)]
pub struct BusinessProfile {
    owner: Principal,
    business_name: String,
    business_type: BusinessType,
    business_category: BusinessCategory,
    country: String,
    address: String,
    registration_number: String,
    logo_data: Option<Vec<u8>>,
    phone_number: String,
    email: String,
    completed_steps: Vec<u32>,
    created_at: u64,
    updated_at: u64,
}

#[derive(CandidType, Deserialize, Clone)]
pub enum BusinessType {
    SmallBusiness,
    Startup,
    Enterprise,
    Franchise,
}

#[derive(CandidType, Deserialize, Clone)]
pub enum BusinessCategory {
    Supermarket,
    GroceryStore,
    Restaurant,
    FoodChain,
}

#[derive(CandidType, Deserialize)]
pub enum Error {
    NotFound,
    AlreadyExists,
    NotAuthorized,
    InvalidInput(String),
}

type BusinessProfileStorage = StableBTreeMap<Principal, BusinessProfile, VirtualMemory>;

thread_local! {
    static MEMORY_MANAGER: MemoryManager<DefaultMemoryImpl> = MemoryManager::init(DefaultMemoryImpl::default());
    static BUSINESS_PROFILES: BusinessProfileStorage = StableBTreeMap::init(
        MEMORY_MANAGER.with(|m| m.get(MemoryId::new(0))),
    );
}

#[update]
pub async fn create_business_profile(profile: BusinessProfile) -> Result<(), Error> {
    let caller = ic_cdk::caller();
    
    if profile.owner != caller {
        return Err(Error::NotAuthorized);
    }

    // Validate phone number format
    if !is_valid_phone_number(&profile.phone_number) {
        return Err(Error::InvalidInput("Invalid phone number format".to_string()));
    }

    // Validate website URL
    if !is_valid_url(&profile.website_url) {
        return Err(Error::InvalidInput("Invalid website URL".to_string()));
    }

    // Validate registration number format
    if !is_valid_registration_number(&profile.registration_number) {
        return Err(Error::InvalidInput("Invalid registration number format".to_string()));
    }

    BUSINESS_PROFILES.with(|profiles| {
        if profiles.contains_key(&caller) {
            Err(Error::AlreadyExists)
        } else {
            let mut new_profile = profile;
            new_profile.created_at = time();
            new_profile.updated_at = time();
            profiles.insert(caller, new_profile);
            Ok(())
        }
    })
}

#[query]
pub fn get_business_profile(owner: Principal) -> Result<BusinessProfile, Error> {
    BUSINESS_PROFILES.with(|profiles| {
        profiles
            .get(&owner)
            .ok_or(Error::NotFound)
            .map(|profile| profile.clone())
    })
}

#[update]
pub async fn update_business_profile(profile: BusinessProfile) -> Result<(), Error> {
    let caller = ic_cdk::caller();
    
    if profile.owner != caller {
        return Err(Error::NotAuthorized);
    }

    BUSINESS_PROFILES.with(|profiles| {
        if let Some(mut existing_profile) = profiles.get(&caller) {
            existing_profile.business_name = profile.business_name;
            existing_profile.business_type = profile.business_type;
            existing_profile.business_category = profile.business_category;
            existing_profile.country = profile.country;
            existing_profile.county = profile.county;
            existing_profile.registration_number = profile.registration_number;
            existing_profile.logo_url = profile.logo_url;
            existing_profile.phone_number = profile.phone_number;
            existing_profile.website_url = profile.website_url;
            existing_profile.updated_at = time();
            
            profiles.insert(caller, existing_profile);
            Ok(())
        } else {
            Err(Error::NotFound)
        }
    })
}

#[update]
pub async fn save_completed_step(step_id: u32) -> Result<(), Error> {
    let caller = ic_cdk::caller();
    
    BUSINESS_PROFILES.with(|profiles| {
        if let Some(mut profile) = profiles.get(&caller) {
            if !profile.completed_steps.contains(&step_id) {
                profile.completed_steps.push(step_id);
                profile.updated_at = time();
                profiles.insert(caller, profile);
            }
            Ok(())
        } else {
            Err(Error::NotFound)
        }
    })
}

#[query]
pub fn get_completed_steps(owner: Principal) -> Result<Vec<u32>, Error> {
    BUSINESS_PROFILES.with(|profiles| {
        profiles
            .get(&owner)
            .map(|profile| profile.completed_steps)
            .ok_or(Error::NotFound)
    })
}

// Validation helper functions
fn is_valid_phone_number(phone: &str) -> bool {
    // Basic phone number validation
    let digits: String = phone.chars().filter(|c| c.is_digit(10)).collect();
    digits.len() >= 9 && digits.len() <= 15
}

fn is_valid_url(url: &str) -> bool {
    url.starts_with("https://") || url.starts_with("http://")
}

fn is_valid_registration_number(reg_num: &str) -> bool {
    // Basic registration number validation
    reg_num.len() >= 5 && reg_num.len() <= 20
}

// For Candid interface generation
ic_cdk::export_candid!(); 