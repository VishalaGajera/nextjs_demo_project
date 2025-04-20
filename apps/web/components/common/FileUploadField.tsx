import { FileNames, FileUpload } from "@codezee/sixtify-brahma";
import { drop, join, last, remove, split } from "lodash";
import { useMemo } from "react";
import type {
  FieldValues,
  UseControllerProps,
  UseFormSetError,
} from "react-hook-form";
import { useController } from "react-hook-form";
import { useUploadFile } from "../../hooks/useUploadFile";
import { onError } from "../../utils/errors";

export type FileUploadFieldProps<P extends FieldValues> =
  UseControllerProps<P> & {
    multiple?: boolean;
    error?: boolean;
    helperText?: string;
    size?: number;
    label?: string;
    accept?: string;
    setError?: UseFormSetError<FieldValues>;
  };

export const FileUploadField = <T extends FieldValues>({
  name,
  multiple,
  control,
  defaultValue,
  rules,
  ...props
}: FileUploadFieldProps<T>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control, defaultValue, rules });

  const { mutate, isPending } = useUploadFile({
    uploadFor: name,

    options: {
      onSuccess: (data) => {
        const newFile = data.data.files;

        const updatedFiles = value ? [...value, ...newFile] : [...newFile];

        onChange(updatedFiles);
      },
      onError: (error) => onError(error),
    },
  });

  const names: string[] = useMemo(() => {
    if (value && Array.isArray(value)) {
      return value.map((url: string) => {
        const imageName = join(drop(split(last(split(url, "/")), "_")), "_");

        return imageName;
      });
    }

    return [];
  }, [value]);

  const handleFileRemove = (index: number) => {
    if (multiple && Array.isArray(value)) {
      const copyOfUploadedFiles = [...value];

      remove(copyOfUploadedFiles, (_, i) => i === index);

      onChange(copyOfUploadedFiles.length > 0 ? copyOfUploadedFiles : []);
    } else {
      onChange([]);
    }
  };

  return (
    <FileUpload
      isDisabled={isPending}
      loading={isPending}
      name={name}
      control={control}
      onChange={(file) => {
        mutate(file);
      }}
      fileNames={<FileNames names={names} onDelete={handleFileRemove} />}
      multiple={multiple}
      defaultValue={value}
      {...props}
    />
  );
};
