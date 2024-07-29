import catchAsync from "../utils/catch.async";

const readReqBodyFiles = catchAsync(async (req, res, next) => {
  try {
    const fileList: Record<string, string[]> = {};

    if (req.file) {
      const fieldName = req?.file?.fieldname;
      (fileList as typeof fileList & Record<string, string[]>)[fieldName] = [
        req.file.path,
      ];
    }

    if (req.files && typeof req.files === "object") {
      Object.keys(req?.files).map((fieldName) => {
        const files = (req.files as Record<string, unknown>)[fieldName];

        if (Array.isArray(files)) {
          const filePaths = files.map(
            (file: Record<string, string>) => file.path,
          );
          fileList[fieldName] = filePaths;
        }
      });
    }

    req.body = {
      ...req.body,
      ...fileList,
    };

    return next();
  } catch (error) {
    return next(error);
  }
});

export default readReqBodyFiles;
