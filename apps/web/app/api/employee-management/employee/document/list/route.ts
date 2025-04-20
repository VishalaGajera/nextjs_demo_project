import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Employee document listed successfully.",
      data: {
        totalCount: 3,
        documents: [
          {
            id: "f4218d10-3f69-4ecc-9d81-f9cb6864df8b",
            employee_id: "f8d860f0-c093-4d88-808c-75a23779a105",
            document_type: "voterid_card",
            document_no: "VOT1234567",
            name: "John Doe",
            document_url: ["http://example.com/path/to/front_page.pdf"],
            action_by: "Jenish Chanchad",
            action_at: "2024-09-02T05:03:01.615Z",
            full_count: "3",
          },
          {
            id: "0de2dfbf-cdab-424d-96e2-ea93b8bba045",
            employee_id: "f8d860f0-c093-4d88-808c-75a23779a105",
            document_type: "pan_card",
            document_no: "ABCDE1234F",
            name: "jensih Chanchad",
            document_url: [
              "https://sixtify.s3.amazonaws.com/1724740243191_CashSignReport_1.pdf",
            ],
            action_by: "Jenish Chanchad",
            action_at: "2024-08-28T11:37:35.395Z",
            full_count: "3",
          },
          {
            id: "fdb6c8f9-59ab-4eb5-8995-358754f175bb",
            employee_id: "f8d860f0-c093-4d88-808c-75a23779a105",
            document_type: "aadhaar_card",
            document_no: "895658740120",
            name: "Jenish Chanchad",
            document_url: [
              "https://sixtify.s3.amazonaws.com/1724739799857_E0600RRVHB_Invoice.pdf",
            ],
            action_by: "Jenish Chanchad",
            action_at: "2024-08-28T11:36:31.787Z",
            full_count: "3",
          },
        ],
      },
    },
    { status: 200 }
  );
}
