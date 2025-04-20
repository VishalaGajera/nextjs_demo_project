import { ImageUpload, toasts } from "@codezee/sixtify-brahma";
import type { FieldValues, UseControllerProps } from "react-hook-form";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useUploadFile } from "../../hooks/useUploadFile";
import { onError } from "../../utils/errors";
import { isFileSizeValid } from "../../utils/file";

export type ImageUploadFieldProps<P extends FieldValues> =
  UseControllerProps<P> & {
    variant?: "square" | "circle";
    label?: string;
    subTitle?: string;
    isCapture?: boolean;
    loading?: boolean;
    size?: number;
  };

export const ImageUploadField = <T extends FieldValues>({
  name,
  control,
  defaultValue,
  rules,
  variant,
  label,
  subTitle,
  isCapture,
  loading = false,
  size = 5, //Note:- Size in MB
}: ImageUploadFieldProps<T>) => {
  const { t } = useTranslation();

  const {
    field: { value, onChange },
  } = useController({ name, control, defaultValue, rules });

  const { mutate, isPending } = useUploadFile({
    uploadFor: name,
    options: {
      onSuccess: (data) => {
        onChange(data.data.files[0]);
      },
      onError: (error) => onError(error),
    },
  });

  return (
    <ImageUpload
      onDelete={() => onChange(null)}
      loading={loading}
      onChange={(file) => {
        if (file?.[0]) {
          if (!isFileSizeValid(file[0], size)) {
            toasts.error({
              title: t("imageUpload.fileSize.error.message", {
                fileSize: size,
              }),
            });

            return;
          }

          mutate(file);
        }
      }}
      variant={variant}
      isUploading={isPending}
      defaultValue={value}
      label={label}
      subTitle={subTitle}
      isCapture={isCapture}
    />
  );
};
