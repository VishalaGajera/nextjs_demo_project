import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave type options retrieved successfully.",
      data: [
        {
          value: "1ce85c01-3b18-4cfc-8471-a422e47f57bc",
          label: "Maternity Leave",
        },
        {
          value: "f3211ea4-a5ff-4f37-8305-919d48ce9f33",
          label: "Sick Leave",
        },
        {
          value: "cbb4374c-6e93-455b-bd95-9bc5181a7746",
          label: "Paternity Leave",
        },
        {
          value: "20ec5db0-e704-42ef-9336-18f328b0455d",
          label: "Unvaccinated Leave",
        },
        {
          value: "8da0b602-bc14-4950-b35a-0d733974f1da",
          label: "Personal Leave",
        },
        {
          value: "c202c8dd-0094-4338-ad2f-99e57f52d477",
          label: "Vacation Leave",
        },
        {
          value: "50cfc53a-c462-4601-8443-8db250dadfc5",
          label: "Widow Leave",
        },
        {
          value: "80223b77-4ec8-4080-af6f-c73b63be79a1",
          label: "Family Leave",
        },
      ],
    },
    { status: 200 }
  );
}
