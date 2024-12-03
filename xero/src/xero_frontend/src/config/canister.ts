import { Actor, HttpAgent } from '@dfinity/agent';

const host = import.meta.env.VITE_DFX_NETWORK === 'ic' 
  ? 'https://ic0.app' 
  : 'http://127.0.0.1:4943';

const agent = new HttpAgent({ host });

// Only fetch root key in development
if (import.meta.env.MODE !== 'production') {
  agent.fetchRootKey();
}

// Use window.data_aggregator directly instead of creating a new actor
export const dataAggregator = window.data_aggregator; 