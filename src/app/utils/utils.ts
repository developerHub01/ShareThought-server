export const isObject = (value: unknown) => {
  return value instanceof Object && value.constructor === Object;
};

export const isValidDate = (date: Date) =>
  date instanceof Date && !isNaN(date?.getTime());
