import {
    hashSync,
    genSaltSync,
    compareSync
} from 'bcryptjs';

export const makeHash = (text: string): string => {
    return hashSync(text, genSaltSync(12));
};

export const matchHash = (plain: string, hashed: string): boolean => {
    return compareSync(plain, hashed);
};
