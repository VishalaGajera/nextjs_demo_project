export const bulkDataUploadKeys = {
  all: ["bulk-data-upload"] as const,

  add: (excelTemplateId: string, masterCode: string) => [
    ...bulkDataUploadKeys.all,
    "add",
    excelTemplateId,
    masterCode,
  ],

  listing: (body: object = {}) => [...bulkDataUploadKeys.all, "list", body],
};
