import { Dialog, DownloadAction, PadBox } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { downloadZip } from "../../../../../../../../../utils/download";
import type { Document } from "../DocumentList/hooks/useGetDocuments";
import { CarouselButtonGroup } from "./CarouselButtonGroup";
import { DocumentBoxContainer } from "./DocumentBoxContainer";

const SUPPORTED_IMAGE_FORMATS = [".png", ".jpg", ".jpeg"];

const SUPPORTED_PDF_FORMATS = [".pdf"];

const SUPPORTED_DOC_FORMATS = [".doc", ".docx"];

const SUPPORTED_EXCEL_FORMATS = [".xls", ".xlsx"];

type ViewDocumentDialogProps = {
  open: boolean;
  document: Document;
  onClose: () => void;
};

export const ViewDocumentDialog = ({
  open,
  onClose,
  document,
}: ViewDocumentDialogProps) => {
  const [documentCount, setDocumentCount] = useState<number>(0);

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

  const handleSetDocumentCount = (currentSlide: number) => {
    setDocumentCount(currentSlide);
  };

  return (
    <Dialog maxWidth="lg" onClose={onClose} open={open} title="View Document">
      <Stack bgcolor={butterflyBlue[700]} borderRadius="5px">
        <PadBox padding={{ padding: "0px 20px 20px 20px" }}>
          <PadBox padding={{ padding: "10px 0px" }}>
            <Stack
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              gap="5px"
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
                  {documentCount + 1} / {document.document_url.length}
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
          </PadBox>

          <Box
            sx={{
              backgroundColor: iron[600],
              overflowY: "auto",
              maxHeight: "650px",
              minHeight: "650px",
            }}
          >
            <Carousel
              responsive={responsive}
              arrows={false}
              renderButtonGroupOutside
              customButtonGroup={
                <CarouselButtonGroup
                  totalSlides={document.document_url.length}
                  onSlideChange={handleSetDocumentCount}
                />
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
    </Dialog>
  );
};
