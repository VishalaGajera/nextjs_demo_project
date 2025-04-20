import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Loan categories retrieved successfully.",
      data: [
        {
          value: "ea91a66f-61ba-4c00-bfc6-eaf2dbff0ebf",
          label: "Personal123",
        },
        {
          value: "cd789405-0e87-42a5-8a27-31b4edc3ccfb",
          label: "Personal Loan",
        },
        {
          value: "13c706c3-f616-4968-ae33-a7c9e8ebe6d4",
          label: "Personal65",
        },
        {
          value: "9f5cfec2-f684-46c4-9b62-1a138e8f09a5",
          label: "Personal12",
        },
      ],
    },
    { status: 200 }
  );
}
