export type JwtClaims = {
  sub: string;
  email?: string | null;
  user_metadata?: Record<string, any> | null;
  app_metadata?: Record<string, any> | null;
  [key: string]: any;
};

export function decodeAccessToken(token: string): JwtClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];

    // Converte base64url para base64
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad === 2) base64 += "==";
    else if (pad === 3) base64 += "=";

    let json: string;
    if (typeof atob === "function") {
      json = decodeURIComponent(
        Array.prototype.map
          .call(atob(base64), (c: string) =>
            "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2),
          )
          .join(""),
      );
    } else {
      // Ambiente Node.js
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const buf = require("node:buffer").Buffer.from(base64, "base64");
      json = buf.toString("utf8");
    }

    return JSON.parse(json);
  } catch {
    return null;
  }
}

