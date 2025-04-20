import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee codes retrieved successfully.",
      data: [
        {
          value: "e60b4dd4-5942-419f-972c-db29cf45759f",
          label: "Codezee",
        },
      ],
    },
    { status: 200 }
  );
}
