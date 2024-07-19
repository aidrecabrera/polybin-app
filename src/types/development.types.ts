import { Database } from "./database.types";

export type TableNames = keyof Database["public"]["Tables"];
export type ViewNames = keyof Database["public"]["Views"];

export type Tables<T extends TableNames> =
  Database["public"]["Tables"][T]["Row"];
export type Views<T extends ViewNames> = Database["public"]["Views"][T]["Row"];

export type TableOrViewNames = TableNames | ViewNames;

export type TableType<T extends TableOrViewNames> = T extends TableNames
  ? Tables<T>
  : Views<Extract<T, ViewNames>>;