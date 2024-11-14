import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Import the interface factories
import { idlFactory as inventoryIDL } from '../../../declarations/inventory';
import { idlFactory as priceEngineIDL } from '../../../declarations/price_engine';
import { idlFactory as dataAggregatorIDL } from '../../../declarations/data_aggregator';
import { idlFactory as ledgerIDL } from '../../../declarations/ledger';

// Import the canister IDs
import {
  canisterId as inventoryCanisterId,
  createActor as createInventoryActor,
} from '../../../declarations/inventory';
import {
  canisterId as priceEngineCanisterId,
  createActor as createPriceEngineActor,
} from '../../../declarations/price_engine';
import {
  canisterId as dataAggregatorCanisterId,
  createActor as createDataAggregatorActor,
} from '../../../declarations/data_aggregator';
import {
  canisterId as ledgerCanisterId,
  createActor as createLedgerActor,
} from '../../../declarations/ledger';

const host = process.env.DFX_NETWORK === 'ic' 
  ? 'https://ic0.app' 
  : `http://localhost:${process.env.DFX_PORT || 4943}`;

const agent = new HttpAgent({ host });

// Only fetch root key when in development
if (process.env.NODE_ENV !== 'production') {
  agent.fetchRootKey().catch(err => {
    console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
    console.error(err);
  });
}

// Create actor instances
export const inventoryActor = createInventoryActor(inventoryCanisterId, {
  agentOptions: { host },
});

export const priceEngineActor = createPriceEngineActor(priceEngineCanisterId, {
  agentOptions: { host },
});

export const dataAggregatorActor = createDataAggregatorActor(dataAggregatorCanisterId, {
  agentOptions: { host },
});

export const ledgerActor = createLedgerActor(ledgerCanisterId, {
  agentOptions: { host },
});

// Helper function to create a new actor instance with a different identity
export const createActorWithIdentity = (
  canisterId: string,
  idlFactory: any,
  identity: any
) => {
  const agent = new HttpAgent({ host, identity });
  
  if (process.env.NODE_ENV !== 'production') {
    agent.fetchRootKey().catch(console.error);
  }
  
  return Actor.createActor(idlFactory, {
    agent,
    canisterId: Principal.fromText(canisterId),
  });
};

// Export the IDL factories for potential direct use
export const idlFactories = {
  inventory: inventoryIDL,
  priceEngine: priceEngineIDL,
  dataAggregator: dataAggregatorIDL,
  ledger: ledgerIDL,
};

// Export canister IDs
export const canisterIds = {
  inventory: inventoryCanisterId,
  priceEngine: priceEngineCanisterId,
  dataAggregator: dataAggregatorCanisterId,
  ledger: ledgerCanisterId,
}; 