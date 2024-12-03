/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DFX_NETWORK: string;
  readonly VITE_BUSINESS_PROFILE_CANISTER_ID: string;
  readonly VITE_INVENTORY_CANISTER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare module 'canvas-confetti';

interface Window {
  ic: any;
  business_profile: any;
  inventory: any;
  price_engine: any;
  data_aggregator: any;
  ledger: any;
} 