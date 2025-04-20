import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Departments retrieved successfully.",
      data: [
        {
          value: "4410b46f-2df5-4dc2-b49f-8636f83a1d1c",
          label: "Update Programming",
        },
        {
          value: "e998f3cf-bca7-4ef8-ba42-9951957dc02c",
          label: "Programming",
        },
        {
          value: "a134e48c-71a4-480d-bb7f-b4c4acc5ff8e",
          label: "JavaScript",
        },
        {
          value: "c350a2c2-3c5a-4642-9ebc-5d4aff61e796",
          label: "Data Science",
        },
        {
          value: "af731654-cec8-4b39-a28c-b4d8534441f6",
          label: "Project Management",
        },
      ],
    },
    { status: 200 }
  );
}
