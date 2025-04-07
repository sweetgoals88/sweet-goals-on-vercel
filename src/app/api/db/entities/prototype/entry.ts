export type PrototypeEntry = {
    id: string,
    key: string,
    operational: boolean,
    activationCode: string,
    version: string,
    owner: {
        name: string,
        surname: string,
        id: string,
    } | null
};