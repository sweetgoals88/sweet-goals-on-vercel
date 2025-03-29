export type JwtApiPayload = {
    prototype_key: string
};

export async function signJwt<K>(payload: K, expiration: string = "1d") {
    const jwt = require("jsonwebtoken");
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            payload, 
            process.env.JWT_SIGNING_KEY,
            { expiresIn: expiration },
            (error: Error | null, token: string) => {
                if (error !== null) {
                    reject(error);
                    return;
                }
                resolve(token);
            }
        );
    });
}

export async function verifyJwt<K>(token: string) {
    const jwt = require("jsonwebtoken");
    return new Promise<K>((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_SIGNING_KEY,
            {},
            (error: Error | null, value: K) => {
                if (error !== null) {
                    reject(error);
                    return;
                }
                resolve(value);
            }
        );
    });
}
