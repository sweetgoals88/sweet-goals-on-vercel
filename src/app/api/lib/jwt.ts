import jwt from "jsonwebtoken";

export async function signJwt<K extends object>(payload: K, options: jwt.SignOptions) {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            payload, 
            process.env.JWT_SIGNING_KEY as string,
            options,
            (error, token) => {
                if (error !== null) {
                    reject(error);
                    return;
                }
                resolve(token as string);
            }
        );
    });
}

export async function verifyJwt<K>(token: string) {
    return new Promise<K>((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_SIGNING_KEY as string,
            {},
            (error, value) => {
                if (error !== null) {
                    reject(error);
                    return;
                }
                resolve(value as K);
            }
        );
    });
}
