import type { UserRole } from "../model/base-model";

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

export interface Requester extends TokenPayload { }

export interface ITokenProvider {
  generateToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload | null>;
}

// Authorization
export type TokenIntrospectResult = {
  payload: TokenPayload | null;
  error?: Error;
  isOk: boolean;
}

export interface ITokenIntrospect {
  introspect(token: string): Promise<TokenIntrospectResult>;
}
