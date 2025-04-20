import {
  Button,
  Dialog,
  DownloadAction,
  PadBox,
  toasts,
} from "@codezee/sixtify-brahma";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import type { DialogTypes } from "../../../../../../../../../types/dialogs";
import { downloadZip } from "../../../../../../../../../utils/download";
import { onError } from "../../../../../../../../../utils/errors";
import { useGetDocumentOptions } from "../../../../../../../../common/Autocomplete/hooks/useGetDocumentOptions";
import {
  DocumentForm,
  type DocumentFormFieldValues,
} from "../../../../../../AddEmployee/Document/Dialog/DocumentForm";
import type { Document } from "../DocumentList/hooks/useGetDocuments";
import { useGetDocument } from "./hooks/useGetDocument";
import { useVerifyDocument } from "./hooks/useVerifyDocument";
import { useQueryClient } from "@tanstack/react-query";
import { employeeBasicDetailsKeys } from "../../../../../../../../../queryKeysFactories/employee";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { documentKeys } from "../../../../../../../../../queryKeysFactories/document";
import { DocumentBoxContainer } from "./DocumentBoxContainer";

type VerifyDocumentDialogProps = {
  open: boolean;
  document: Document;
  onClose: () => void;
  employeeId: string;
  onEditSuccess: () => void;
  onDialogOpen: (dialogTypes: DialogTypes) => void;
};

const SUPPORTED_IMAGE_FORMATS = [".png", ".jpg", ".jpeg"];

const SUPPORTED_PDF_FORMATS = [".pdf"];

const SUPPORTED_DOC_FORMATS = [".doc", ".docx"];

const SUPPORTED_EXCEL_FORMATS = [".xls", ".xlsx"];

export const VerifyDocumentDialog = ({
  open,
  onClose,
  onDialogOpen,
  document,
  employeeId,
  onEditSuccess,
}: VerifyDocumentDialogProps) => {
  const [documentCount, setDocumentCount] = useState<number>(0);

  const carouselRef = useRef<Carousel>(null);

  const theme = useTheme();

  const { butterflyBlue, slate, iron } = theme.palette.app.color;

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 0 },
      items: 1,
    },
  };

  const isImageDomainValid = (url: string) => {
    const parsedUrl = new URL(url);

    return parsedUrl.hostname === "sixtify.s3.amazonaws.com";
  };

  const isFileType = (url: string, extensions: string[]): boolean => {
    return extensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const { data: latestDocumentData, isPending: isPendingLatestDocumentData } =
    useGetDocument({
      employeeId,
      documentId: document.id,
    });

  const { data: documentOptions } = useGetDocumentOptions({
    employeeId,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useVerifyDocument({
    employeeId,
    documentId: document.id,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });

        queryClient.invalidateQueries({
          queryKey: employeeBasicDetailsKeys.get(employeeId),
        });

        queryClient.invalidateQueries({
          queryKey: documentKeys.listing({}),
        });

        onClose();
        onEditSuccess();
      },
      onError: (error) => onError(error),
    },
  });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const defaultValues = useMemo(() => {
    if (latestDocumentData) {
      const documentSchemaFormFieldValues: DocumentFormFieldValues = {
        document_type: latestDocumentData.document_type ?? null,
        name: latestDocumentData.document_details.name ?? null,
        document_no: latestDocumentData.document_details.document_no ?? null,
        date_of_birth:
          latestDocumentData.document_details.date_of_birth ?? null,
        document_url: latestDocumentData.document_details.document_url ?? null,
        address: latestDocumentData.document_details.address ?? null,
        gender: latestDocumentData.document_details.gender ?? null,
        blood_group: latestDocumentData.document_details.blood_group ?? null,
        issue_date: latestDocumentData.document_details.issue_date ?? null,
        expiry_date: latestDocumentData.document_details.expiry_date ?? null,
        company_name: latestDocumentData.document_details.company_name ?? null,
        job_title: latestDocumentData.document_details.job_title ?? null,
        joining_date: latestDocumentData.document_details.joining_date ?? null,
        relieving_date:
          latestDocumentData.document_details.relieving_date ?? null,
        degree: latestDocumentData.document_details.degree ?? null,
        branch_name: latestDocumentData.document_details.branch_name ?? null,
        joining_year: latestDocumentData.document_details.joining_year ?? null,
        completion_year:
          latestDocumentData.document_details.completion_year ?? null,
        cgpa_or_percentage:
          latestDocumentData.document_details.cgpa_or_percentage ?? null,
        university_or_college:
          latestDocumentData.document_details.university_or_college ?? null,
      };

      return documentSchemaFormFieldValues;
    }
  }, [latestDocumentData]);

  return (
    <Dialog
      maxWidth="xl"
      onClose={onClose}
      open={open}
      title="Verify Document"
      actions={
        <Stack direction="row" gap="5px">
          {document?.verification_status !== "rejected" && (
            <Button
              onClick={() => {
                onClose();
                onDialogOpen("reject");
              }}
              variant="outlined"
            >
              Reject Document
            </Button>
          )}

          <Button
            onClick={() =>
              mutate({
                verification_status: "approved",
              })
            }
            loading={isPending}
          >
            Confirm Verification
          </Button>
        </Stack>
      }
    >
      <Stack
        bgcolor={butterflyBlue[700]}
        borderRadius="5px"
        width="59%"
        sx={{ float: "left" }}
      >
        <PadBox padding={{ padding: "0px 20px 20px 20px" }}>
          <PadBox padding={{ padding: "10px 0px" }}>
            <Stack
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              gap="5px"
            >
              <IconButton
                onClick={() => carouselRef.current?.previous(1)}
                disabled={documentCount === 0}
                sx={{
                  color: butterflyBlue[900],
                  zIndex: 10,
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                }}
              >
                <ArrowBackIos />
              </IconButton>

              <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
              >
                <Stack
                  bgcolor={slate[900]}
                  width="220px"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  height="40px"
                  borderRadius="5px"
                  gap="20px"
                >
                  <Typography variant="body1" color={iron[600]}>
                    Attachments
                  </Typography>

                  <Typography variant="body1" color={iron[600]}>
                    {documentCount + 1} / {document.document_url.length || 0}
                  </Typography>
                </Stack>

                <DownloadAction
                  // eslint-disable-next-line sonarjs/no-misused-promises
                  onClick={() =>
                    downloadZip(document.document_url, document.document_type)
                  }
                  sx={{ zIndex: 1 }}
                />
              </Stack>

              <IconButton
                onClick={() => carouselRef.current?.next(1)}
                disabled={
                  documentCount === (document.document_url.length || 0) - 1
                }
                sx={{
                  color: butterflyBlue[900],
                  zIndex: 10,
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                }}
              >
                <ArrowForwardIos />
              </IconButton>
            </Stack>
          </PadBox>

          <Box
            sx={{
              backgroundColor: iron[600],
              overflowY: "auto",
              maxHeight: "640px",
              minHeight: "640px",
            }}
          >
            <Carousel
              responsive={responsive}
              ref={carouselRef}
              arrows={false}
              afterChange={(_previousSlide, { currentSlide }) =>
                setDocumentCount(currentSlide ?? 0)
              }
            >
              {document.document_url.map((item) => {
                const isValidUrl = isImageDomainValid(item);

                if (isFileType(item, SUPPORTED_PDF_FORMATS)) {
                  return (
                    <DocumentBoxContainer key={item}>
                      <iframe
                        src={`${item}#toolbar=0`}
                        style={{ width: "100%", height: "640px" }}
                      />
                    </DocumentBoxContainer>
                  );
                }

                if (isFileType(item, SUPPORTED_IMAGE_FORMATS) && isValidUrl) {
                  return (
                    <DocumentBoxContainer key={item}>
                      <Image
                        src={item}
                        alt="Documents"
                        width={800}
                        height={0}
                        style={{
                          boxShadow: `${iron[300]} 0px 5px 15px`,
                          width: "100%",
                          maxWidth: "800px",
                          height: "100%",
                          objectFit: "contain",
                          display: "block",
                          margin: "auto",
                        }}
                      />
                    </DocumentBoxContainer>
                  );
                }

                if (
                  isFileType(item, SUPPORTED_DOC_FORMATS) ||
                  isFileType(item, SUPPORTED_EXCEL_FORMATS)
                ) {
                  return (
                    <DocumentBoxContainer key={item}>
                      <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(item)}`}
                        style={{ width: "100%", height: "640px" }}
                      />
                    </DocumentBoxContainer>
                  );
                }

                return (
                  <DocumentBoxContainer key={item}>
                    <PadBox padding={{ padding: "10px" }}>
                      <Typography variant="body1" sx={{ textAlign: "center" }}>
                        Image Not Found
                      </Typography>
                    </PadBox>
                  </DocumentBoxContainer>
                );
              })}
            </Carousel>
          </Box>
        </PadBox>
      </Stack>

      <Box sx={{ width: "40%", float: "right" }}>
        <DocumentForm
          defaultValues={defaultValues}
          documentTypeOptions={documentOptions}
          loading={isPendingLatestDocumentData}
          disabled
        />
      </Box>
    </Dialog>
  );
};
