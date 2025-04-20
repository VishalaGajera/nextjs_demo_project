import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Excel Template configuration retrieved successfully.",
      data: {
        id: "6cff5602-437e-4183-8b4f-b297c7910ac1",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        excel_master_id: "48affb65-4df8-4966-83ae-e10867a05137",
        template_name: "Manish",
        excel_template_fields: [
          {
            id: "8df6ff78-6a52-42c1-809f-1ed705246e34",
            template_field_name: "Employee Code",
          },
          {
            id: "2cdf36a5-75b6-47b1-97b0-09cd8c6ef417",
            template_field_name: "Name",
          },
          {
            id: "03c64d09-92be-4818-974e-05c6cffec552",
            template_field_name: "DOB",
          },
          {
            id: "16ed4082-4199-4663-8e57-0e185699a983",
            template_field_name: "Gender",
          },
          {
            id: "2fdc13f4-1f9e-43c4-91ea-2b91141759f5",
            template_field_name: "Profession",
          },
        ],
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Excel template updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Excel template deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
