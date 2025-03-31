import bcrypt from "bcrypt";

export async function encryptString(plainText: string): Promise<string> {
    const saltRounds = 16;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainText, salt);

    return hash;
}

export async function validateString(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
}
