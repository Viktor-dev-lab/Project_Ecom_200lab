import type { ITokenProvider, TokenPayload } from "../interface/auth.interface";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "./config";

class JwtTokenService implements ITokenProvider {
  private readonly secretKey: string;
  private readonly expiresIn: SignOptions["expiresIn"];

  constructor(secretKey: string, expiresIn: SignOptions["expiresIn"]) {
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;
  }

  async generateToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    const decoded = jwt.verify(token, this.secretKey);
    return decoded as TokenPayload;
  }
}

export const jwtProvider = new JwtTokenService(
  config.accessToken.secretKey,
  config.accessToken.expiresIn as SignOptions["expiresIn"]
);