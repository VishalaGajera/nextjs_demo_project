import type { PageProps } from "../../../../../../../app/employee-management/employee/[employeeId]/page";
import { useGetEmployeeAddress } from "./hooks/useGetEmployeeAddress";
import { PermanentAddressCard } from "./PermanentAddressCard";
import { PresentAddressCard } from "./PresentAddressCard";

type AddressCardProps = Readonly<PageProps["params"]>;

export const AddressCard = ({ employeeId }: AddressCardProps) => {
  const { data: addressData, isPending: isPendingAddressData } =
    useGetEmployeeAddress({
      employeeId,
    });

  return (
    <>
      <PresentAddressCard
        employeeId={employeeId}
        defaultValues={addressData?.present}
        isLoading={isPendingAddressData}
      />

      <PermanentAddressCard
        employeeId={employeeId}
        defaultValues={addressData?.permanent}
        isLoading={isPendingAddressData}
      />
    </>
  );
};
