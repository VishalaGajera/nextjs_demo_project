import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Departments retrieved successfully.",
      data: [
        {
          value: "6907040d-b349-4f20-b2ba-f6a6d0a8a354",
          label: "Human Resources",
        },
        {
          value: "81363375-8f83-4783-876e-bcfa945eb82f",
          label: "Information Technology",
        },
        {
          value: "e7a75424-f454-4c66-9aa7-17bf8b5c4096",
          label: "Research and Development",
        },
      ],
    },
    { status: 200 }
  );
}
