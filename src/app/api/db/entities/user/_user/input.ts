export type _UserRegistrationInput = {
    name: string,
    surname: string,
    email: string,
    password: string,
};

export type _UserUpdateInput = {
    name: string,
    surname: string,
    email: string,
    newPassword: string,
    oldPassword: string
};
