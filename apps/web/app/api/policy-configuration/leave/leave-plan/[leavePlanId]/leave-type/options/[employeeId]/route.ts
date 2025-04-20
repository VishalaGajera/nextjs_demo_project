import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Leave types options retrieved successfully.",
      data: [
        {
          value: "9da80853-6327-4ac0-807a-efe46affd798",
          label: "Privillage Leave (10.68 days available)",
        },
        {
          value: "50be2b8b-9c2a-4f4e-a382-be6d1b8f264f",
          label: "Casual Leave (12.50 days available)",
        },
        {
          value: "e162d64b-47f5-4a09-80d4-c3b24e69d603",
          label: "Sick Leave (15.50 days available)",
        },
        {
          value: "e2e69502-7144-4d1f-b10a-e7adcd771b32",
          label: "Unpaid Leave (Infinite balance)",
        },
      ],
    },
    { status: 200 }
  );
}
