export type UnwrapRowType<T> = T extends { data: { rows: (infer U)[] } } ? U : never
export type UnwrapRowsType<T> = T extends { data: { rows: infer U } } ? U : never
