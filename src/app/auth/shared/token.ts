import { JwtPayload } from 'jwt-decode';

export class TokenModel implements JwtPayload {
        sub: string;
        authorities = new Map();
        iat: number;
        exp: number;
}