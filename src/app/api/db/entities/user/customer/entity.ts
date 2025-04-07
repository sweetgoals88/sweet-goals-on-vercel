import { _UserEntity } from "../_user/entity";

export type CustomerLabel = "customer";

export type CustomerEntity = _UserEntity & {
    type: CustomerLabel,
    prototypes: string[]
};