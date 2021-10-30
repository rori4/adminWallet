const cache = window.localStorage;

export const setItem = (key: string, value: any) => {
    const jsonVal = JSON.stringify(value);
    cache.setItem(key, jsonVal);
}

export const getItem = (key: string): any => {
    const item = cache.getItem(key);
    if (item) {
        return JSON.parse(item);
    } else {
        return undefined;
    }
}

export const flush = () => {
    cache.clear();
}
