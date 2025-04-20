import { Button } from "@codezee/sixtify-brahma";

type EditActionProps = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function EditAction({
  onClick,
  loading = false,
  disabled = false,
}: Readonly<EditActionProps>) {
  return (
    <Button onClick={onClick} loading={loading} disabled={disabled}>
      Update
    </Button>
  );
}
