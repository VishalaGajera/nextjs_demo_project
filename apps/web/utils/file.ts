const SUPPORTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export const isFileSizeValid = (file: File, maxSizeMB: number) => {
  const maxSizeInBytes = maxSizeMB * 1024 * 1024;

  return file.size <= maxSizeInBytes;
};

export const isFileTypeValid = (file: File) => {
  return SUPPORTED_FILE_TYPES.includes(file.type);
};
