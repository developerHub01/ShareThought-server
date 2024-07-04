export const isObject = (value: unknown) => {
  return value instanceof Object && value.constructor === Object;
};
