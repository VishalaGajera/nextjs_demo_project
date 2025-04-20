import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Sub-department listed successfully.",
      data: {
        totalPages: 1,
        currentPage: 1,
        totalCount: 2,
        subDepartments: [
          {
            id: "a4903c4f-35a1-477c-ab1c-6cf841c611ea",
            department_id: "0cf33ba7-61dc-4b3c-b2d0-80a1b3090092",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            sub_department_code: "SM",
            sub_department_name: "Software Manager",
            description: "This is the Software Manager",
            is_active: false,
            department_name: "Sales and Marketing1",
            company_name: "codezee",
            action_by: "Demo",
            action_at: "2024-07-16T09:57:59.625Z",
            full_count: "2",
            company: {
              company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
              company_name: "codezee",
            },
          },
          {
            id: "8f10e264-4785-48b8-b39e-abef80fbe1a6",
            department_id: "0cf33ba7-61dc-4b3c-b2d0-80a1b3090092",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            sub_department_code: "SM",
            sub_department_name: "Software Manager",
            description: "This is the Software Manager.",
            is_active: false,
            department_name: "Sales and Marketing1",
            company_name: "codezee",
            action_by: "Demo",
            action_at: "2024-07-12T10:42:46.345Z",
            full_count: "2",
          },
        ],
      },
    },
    { status: 200 }
  );
}
