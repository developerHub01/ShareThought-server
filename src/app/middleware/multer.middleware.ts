import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadFile = (number: "single", fieldName: string) => {
  if (number === "single") return upload.single(fieldName);
};
