import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave type options retrieved successfully.",
      data: [
        {
          id: "1ce85c01-3b18-4cfc-8471-a422e47f57bc",
          name: "Maternity Leave",
          is_blocked: false,
        },
        {
          id: "f3211ea4-a5ff-4f37-8305-919d48ce9f33",
          name: "Sick Leave",
          is_blocked: false,
        },
        {
          id: "cbb4374c-6e93-455b-bd95-9bc5181a7746",
          name: "Paternity Leave",
          is_blocked: false,
        },
        {
          id: "20ec5db0-e704-42ef-9336-18f328b0455d",
          name: "Unvaccinated Leave",
          is_blocked: false,
        },
        {
          id: "8da0b602-bc14-4950-b35a-0d733974f1da",
          name: "Personal Leave",
          is_blocked: false,
        },
        {
          id: "c202c8dd-0094-4338-ad2f-99e57f52d477",
          name: "Vacation Leave",
          is_blocked: true,
        },
        {
          id: "50cfc53a-c462-4601-8443-8db250dadfc5",
          name: "Widow Leave",
          is_blocked: false,
        },
        {
          id: "80223b77-4ec8-4080-af6f-c73b63be79a1",
          name: "Family Leave",
          is_blocked: true,
        },
      ],
    },
    { status: 201 }
  );
}
