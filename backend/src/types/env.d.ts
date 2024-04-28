declare namespace NodeJS {
  export interface ProcessEnv {
    readonly DEV_PORT: string;
    readonly PRODUCTION_PORT: string;
    readonly CLIENT_URL: string;
    
    readonly PGUSER: string;
    readonly PGPASSWORD: string;
    readonly PGHOST: string;
    readonly PGDATABASE: string;
    readonly PGMAXPOOL: string;
    readonly PGTIMEOUT: string;
    
    readonly JWT_KEY: string;
    readonly JWT_REFRESH_KEY: string;
  }
}