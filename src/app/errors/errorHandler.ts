import AppError from "./AppError";

const errorHandler = (error: unknown) => {
  if (error instanceof Error) {
    throw new Error(error.message);
  } else {
    throw new AppError(500, "Something went wrong");
  }
};

export default errorHandler;
