import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

const host = import.meta.env.VITE_DFX_NETWORK === 'ic' 
  ? 'https://ic0.app' 
  : `http://localhost:${import.meta.env.VITE_DFX_PORT || 4943}`;

export const createBusinessProfileActor = async (identity: any) => {
  const agent = new HttpAgent({ identity, host });
  
  if (import.meta.env.VITE_DFX_NETWORK === 'local') {
    await agent.fetchRootKey();
  }

  // Get the canister ID from the environment
  const canisterId = import.meta.env.VITE_BUSINESS_PROFILE_CANISTER_ID;
  
  if (!canisterId) {
    throw new Error('Business Profile canister ID not found');
  }

  // Create actor directly from window object
  return window.business_profile;
}; 