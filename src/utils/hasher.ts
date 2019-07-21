import {
    hashSync,
    genSaltSync
} from 'bcryptjs';

export const makeHash = (text: string): string => {
  return hashSync(text, genSaltSync(12));
};
