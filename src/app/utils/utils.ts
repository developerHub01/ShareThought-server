export const isObject = (value: unknown) => {
  return value instanceof Object && value.constructor === Object;
};

export const isValidDate = (date: Date) =>
  date instanceof Date && !isNaN(date?.getTime());

export const millisecondsConvert = (time: string | number): number | null => {
  let timeType: string | undefined;

  if (typeof time === "string") {
    // Get the last character as the time unit type
    timeType = time.slice(-1); // This is more concise than using split
    time = Number(time.slice(0, -1)); // Convert the numeric part to a number

    if (isNaN(time)) return null; // Return null if conversion fails
  }

  switch (timeType) {
    case "y":
      return time * 365 * 24 * 60 * 60 * 1000; // Convert years to milliseconds
    case "M":
      return time * 30 * 24 * 60 * 60 * 1000; // Convert months to milliseconds
    case "w":
      return time * 7 * 24 * 60 * 60 * 1000; // Convert weeks to milliseconds
    case "d":
      return time * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    case "h":
      return time * 60 * 60 * 1000; // Convert hours to milliseconds
    case "m":
      return time * 60 * 1000; // Convert minutes to milliseconds
    case "s":
      return time * 1000; // Convert seconds to milliseconds
    default:
      return null; // Return null for invalid units
  }
};

export const isEmail = (input: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};
