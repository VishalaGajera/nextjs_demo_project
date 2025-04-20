import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "All Excel Master field retrieved successfully.",
      data: [
        {
          id: "8df6ff78-6a52-42c1-809f-1ed705246e34",
          field_name: "Employee Code",
          required: true,
        },
        {
          id: "2cdf36a5-75b6-47b1-97b0-09cd8c6ef417",
          field_name: "Name",
          required: true,
        },
        {
          id: "03c64d09-92be-4818-974e-05c6cffec552",
          field_name: "DOB",
          required: false,
        },
        {
          id: "16ed4082-4199-4663-8e57-0e185699a983",
          field_name: "Gender",
          required: false,
        },
        {
          id: "546a3a22-c074-457d-9b3a-707f4de8138a",
          field_name: "Blood Group",
          required: true,
        },
        {
          id: "2fdc13f4-1f9e-43c4-91ea-2b91141759f5",
          field_name: "Profession",
          required: false,
        },
        {
          id: "e914afce-bb9f-414a-b6fd-3e4a424e9e12",
          field_name: "Nationality",
          required: false,
        },
        {
          id: "36843c0e-ceab-41a4-9fb9-28d9b473db15",
          field_name: "Address",
          required: false,
        },
      ],
    },
    { status: 200 }
  );
}
