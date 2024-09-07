export const getItem = (item: string): string | null => {
  return sessionStorage.getItem(item);
};

export const setItem = (item: string, value: string): void => {
  return sessionStorage.setItem(item, value);
};

export const removeItem = (item: string): void => {
  return sessionStorage.removeItem(item);
};

export const localgetItem = (item: string): string | null => {
  return localStorage.getItem(item);
};

export const localsetItem = (item: string, value: string): void => {
  return localStorage.setItem(item, value);
};

export const localremoveItem = (item: string): void => {
  return localStorage.removeItem(item);
};
