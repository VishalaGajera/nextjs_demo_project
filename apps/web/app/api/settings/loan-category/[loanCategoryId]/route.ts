import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Loan category retrieved successfully.",
      data: {
        id: "13c706c3-f616-4968-ae33-a7c9e8ebe6d4",
        loan_category_code: "ALC004",
        loan_category_name: "Personal65",
        description: "Short-term personal loan category",
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Loan category updated successfully.",
      data: null,
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Loan category deleted successfully.",
      data: null,
    },
    { status: 200 }
  );
}
