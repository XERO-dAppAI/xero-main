import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as dataAggregatorIDL } from '../../declarations/data_aggregator';
import { canisterId as dataAggregatorCanisterId } from '../../declarations/data_aggregator';

const agent = new HttpAgent({ host: 'http://localhost:8000' });
// Uncomment this line if you are working in a local development environment
// agent.fetchRootKey();

const actor = Actor.createActor(dataAggregatorIDL, {
  agent,
  canisterId: dataAggregatorCanisterId,
});

export { actor };
