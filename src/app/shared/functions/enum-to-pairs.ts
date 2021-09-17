import { Pair } from "../models/pair";

export const enumToPairs = <TValue = any>(enumObject: object, displayFormatKeys?: boolean): Pair<string, TValue>[] => {
  const pairs: Pair<string, TValue>[] = [];

  if(enumObject != null) {
    const keys: string[] = Object.keys(enumObject).filter(key => isNaN(key as any));
    const values: TValue[] = Object.values(enumObject).filter(value => !keys.includes(value));

    for(let i = 0; i < keys.length; i++) {
      if(displayFormatKeys) {
        keys[i] = stringToDisplayFormat(keys[i]);
      }

      pairs.push({ key: keys[i], value: values[i] });
    }
  }

  return pairs;
};

const stringToDisplayFormat = (value: string): string => {
  return value
    .replace(/_/g, '')
    .replace(/[A-Z]/g, " $&")
    .trim();
}