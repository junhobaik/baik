export const copyClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
  }
};

type Without<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export const removeKeys = <T extends object, K extends keyof T>(obj: T, keys: K[]): Without<T, K> => {
  const rest = { ...obj };
  keys.forEach((key) => {
    delete rest[key];
  });
  return rest as Without<T, K>;
};

export const removeDefaultKey = <T extends object>(obj: T): Without<T, keyof T> => {
  const defaultKeys = [
    'id',
    'pk',
    'sk',
    'created_at',
    'updated_at',
    'GSI1PK',
    'GSI1SK',
    'GSI2PK',
    'GSI2SK',
    'GSI3PK',
    'GSI3SK',
    'GSI4PK',
    'GSI4SK',
  ] as (keyof T)[];
  return removeKeys(obj, defaultKeys);
};
