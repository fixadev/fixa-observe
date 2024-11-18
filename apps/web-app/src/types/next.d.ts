// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { NextRequest } from "next/server";

declare module "next/server" {
  interface NextRequest {
    userId?: string;
  }
}
