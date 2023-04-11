import type { Request, Response } from "express";

declare global {
  interface ContextType {
    req?: Request;
    res?: Response;
    userId?: string | undefined;
    userRole?: string | undefined;
  }
}
