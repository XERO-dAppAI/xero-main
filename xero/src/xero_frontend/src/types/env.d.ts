declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DFX_NETWORK?: string;
      INTERNET_IDENTITY_CANISTER_ID?: string;
    }
  }
}

export {}; 