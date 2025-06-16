export type ItemType<T> = T extends (infer U)[] ? U : never;
