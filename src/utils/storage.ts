export const getItem = (item: string): string | null => {
  return sessionStorage.getItem(item);
};

export const setItem = (item: string, value: string): void => {
  return sessionStorage.setItem(item, value);
};

export const removeItem = (item: string): void => {
  return sessionStorage.removeItem(item);
};
