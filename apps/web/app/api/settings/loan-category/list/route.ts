import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Loan categories listed successfully.",
      data: {
        totalCount: 3,
        loanCategories: [
          {
            id: "13c706c3-f616-4968-ae33-a7c9e8ebe6d4",
            loan_category_code: "ALC004",
            loan_category_name: "Personal65",
            description: "Short-term personal loan category",
            action_by: "Demo Demo",
            action_at: "2025-03-12T09:49:55.900Z",
            full_count: "3",
          },
          {
            id: "cd789405-0e87-42a5-8a27-31b4edc3ccfb",
            loan_category_code: "ALC003",
            loan_category_name: "Personal Loan",
            description: "Short-term personal loan category",
            action_by: "Demo Demo",
            action_at: "2025-03-12T09:49:21.963Z",
            full_count: "3",
          },
          {
            id: "9f5cfec2-f684-46c4-9b62-1a138e8f09a5",
            loan_category_code: "ALC002",
            loan_category_name: "Personal12",
            description: "Short category",
            action_by: "Demo Demo",
            action_at: "2025-03-12T09:51:26.426Z",
            full_count: "3",
          },
        ],
      },
    },
    { status: 200 }
  );
}
