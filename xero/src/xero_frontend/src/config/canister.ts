import { Actor, HttpAgent } from '@dfinity/agent';

// This should be generated after dfx deploy
declare const canisterId: string;
declare const idlFactory: any;

const agent = new HttpAgent({
  host: process.env.DFX_NETWORK === 'ic' 
    ? 'https://ic0.app' 
    : 'http://127.0.0.1:4943'
});

if (process.env.NODE_ENV !== 'production') {
  agent.fetchRootKey();
}

export const dataAggregator = Actor.createActor(idlFactory, {
  agent,
  canisterId,
}); 