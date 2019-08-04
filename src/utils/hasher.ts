import {
    hashSync,
    genSaltSync,
    compareSync
} from 'bcryptjs';

export const makeHash = (text: string, cost = 12): string => {
    return hashSync(text, genSaltSync(cost));
};

export const matchHash = (plain: string, hashed: string): boolean => {
    return compareSync(plain, hashed);
};
