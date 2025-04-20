import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  formDefaultValues,
  type EmployeeFormFieldValues,
} from "../../components/EmployeeManagement/Employee/AddEmployee/EmployeeForm";
import type { DocumentFormFieldValues } from "../../components/EmployeeManagement/Employee/AddEmployee/Document/Dialog/DocumentForm";

type ApplicationContextType = {
  isOpenAddEditEmployeePage: boolean;
  setIsOpenAddEditEmployeePage: (isOpen: boolean) => void;
  employeeFormValues: EmployeeFormFieldValues;
  setEmployeeFormValues: React.Dispatch<
    React.SetStateAction<EmployeeFormFieldValues>
  >;
  documentFormValues: DocumentFormFieldValues[];
  setDocumentFormValues: React.Dispatch<
    React.SetStateAction<DocumentFormFieldValues[]>
  >;
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(
  undefined
);

export const ApplicationProvider = ({ children }: PropsWithChildren) => {
  const [isOpenAddEditEmployeePage, setIsOpenAddEditEmployeePage] =
    useState(false);

  const [employeeFormValues, setEmployeeFormValues] =
    useLocalStorage<EmployeeFormFieldValues>("employee", formDefaultValues);

  const [documentFormValues, setDocumentFormValues] = useLocalStorage<
    DocumentFormFieldValues[]
  >("document", []);

  const value = useMemo(() => {
    return {
      isOpenAddEditEmployeePage,
      setIsOpenAddEditEmployeePage,
      employeeFormValues,
      setEmployeeFormValues,
      documentFormValues,
      setDocumentFormValues,
    };
  }, [isOpenAddEditEmployeePage, employeeFormValues, documentFormValues]);

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error(
      "useApplicationContext must be used within an ApplicationProvider"
    );
  }

  return context;
};
