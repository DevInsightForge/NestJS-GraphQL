import { join } from "path";

export const migrationsEntries = join(__dirname, "../migrations/*{.ts,.js}");
export const modelEntries = join(__dirname, "../modules/**/*.model{.ts,.js}");
