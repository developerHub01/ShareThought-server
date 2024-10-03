const parseBoolean = (value: unknown) => {
  if (typeof value === "string") return value === "true";

  return value;
};

const parseNumber = (value: unknown) => {
  if (typeof value === "string") {
    const numberValue = Number(value);

    if (!isNaN(numberValue)) return numberValue;
  }

  return value;
};

export const Validation = {
  parseBoolean,
  parseNumber,
};
