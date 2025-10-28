declare namespace Express {
  export interface User {
    sub: string;
    email?: string;
    name?: string;
    id?: string;
    iat?: number;
    exp?: number;
    jti?: string;
  }
}
