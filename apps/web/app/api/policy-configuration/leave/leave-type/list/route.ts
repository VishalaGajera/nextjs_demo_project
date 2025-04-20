import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Leave types listed successfully.",
      data: {
        totalCount: 9,
        leaveTypes: [
          {
            id: "42b4596b-5778-412a-af03-cb39374e1b16",
            company_name: "Infosys Technologies",
            company_id: "2879146c-1bab-4c61-bf11-d1c1fc6f6651",
            leave_type_code: "HEALTH",
            colour_code: "#FF0000",
            leave_type_name: "Health Issue",
            leave_type: "paid",
            action_by: "Demo Demo",
            action_at: "2024-10-08T10:06:18.119Z",
            full_count: "9",
          },
          {
            id: "6c06dc21-70fa-4b34-b1a5-cc3e3ca69a81",
            company_name: "Infosys Technologies",
            company_id: "2879146c-1bab-4c61-bf11-d1c1fc6f6651",
            leave_type_code: "tytyt",
            colour_code: "#FF0000",
            leave_type_name: "tretrstftw",
            leave_type: "paid",
            action_by: "Demo Demo",
            action_at: "2024-10-08T10:03:24.788Z",
            full_count: "9",
          },
          {
            id: "2bb3eed5-fb90-4bfa-aff0-ea7cec04f294",
            company_name: "Company Name",
            company_id: "5c0ae4ae-cf90-4f25-91b2-8a79d2739dea",
            leave_type_code: "gdfgfdg",
            colour_code: "#FF0000",
            leave_type_name: "dfgfdgfdgdf",
            leave_type: "paid",
            action_by: "Demo Demo",
            action_at: "2024-10-08T09:11:22.774Z",
            full_count: "9",
          },
          {
            id: "6859236c-df4d-4d5a-89b0-7a9f41aa50bb",
            company_name: "Codezee Solutions PVT Ltd.",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            leave_type_code: "ABC012",
            colour_code: "#FF0000",
            leave_type_name: "Unpaid Leave",
            leave_type: "unpaid",
            action_by: "Jenish Chanchad",
            action_at: "2024-10-07T12:49:38.752Z",
            full_count: "9",
          },
          {
            id: "0801d949-ab02-4ede-b671-09d91bce7fcc",
            company_name: "Codezee Solutions PVT Ltd.",
            company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
            leave_type_code: "ABC013",
            colour_code: "#01fafe",
            leave_type_name: "Unpaid Leave 1321",
            leave_type: "paid",
            action_by: "Jenish Chanchad",
            action_at: "2024-10-07T12:50:17.436Z",
            full_count: "9",
          },
        ],
      },
    },
    { status: 200 }
  );
}
