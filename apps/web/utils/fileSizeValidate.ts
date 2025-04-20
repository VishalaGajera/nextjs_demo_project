export const isFileSizeValid = (file: File, maxSizeMB: number) => {
  const maxSizeInBytes = maxSizeMB * 1024 * 1024;

  return file.size <= maxSizeInBytes;
};
