import type { Request } from "express";

type AuthCookies = {
  __a_t?: string;
  __r_t?: string;
};

const parseAuthCookies = (request: Request): AuthCookies => {
  const authCookies = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) return authCookies;

  cookieHeader.split(`; `).forEach((item: string) => {
    const [key, value] = item.split("=");
    if (key === ("__a_t" || "__r_t")) {
      authCookies[key] = value;
    }
  });

  return authCookies;
};

export default parseAuthCookies;
