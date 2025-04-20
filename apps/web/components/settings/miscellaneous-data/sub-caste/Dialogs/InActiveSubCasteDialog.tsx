import { BottomDialog, toasts } from "@codezee/sixtify-brahma";
import { InActiveBottomDialogBody } from "../../common/InActiveBottomDialogBody";
import { useEditSubCaste } from "./hooks/useEditSubCaste";

type InActiveSubCasteDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subCasteId: string;
  subCasteName: string;
};

export const InActiveSubCasteDialog = ({
  subCasteId,
  subCasteName,
  open,
  onClose,
  onSuccess,
}: InActiveSubCasteDialogProps) => {
  const { mutate } = useEditSubCaste({
    subCasteId,
    options: {
      onSuccess: ({ message }) => {
        onClose();
        onSuccess();
        toasts.success({ title: message });
      },
    },
  });

  return (
    <BottomDialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={`Inactive ${subCasteName} Sub Caste`}
    >
      <InActiveBottomDialogBody
        sectionId={subCasteId}
        section="sub_caste"
        alertKey="Sub Caste"
        onInActive={() => mutate({ is_active: false })}
      />
    </BottomDialog>
  );
};
