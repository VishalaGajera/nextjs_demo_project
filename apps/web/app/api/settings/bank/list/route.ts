import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Banks listed successfully.",
      data: {
        totalPages: 2,
        currentPage: 1,
        totalCount: 21,
        banks: [
          {
            id: "b70521d1-0565-49b6-b63c-83a31c786372",
            bank_code: "NEW1234567890",
            bank_name: "New Bank Name",
            description: "Secondary bank account",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-16T08:46:12.424Z",
            full_count: "21",
          },
          {
            id: "8e16ee71-1655-4845-9271-b331134415f4",
            bank_code: "PNB",
            bank_name: "Punjab National Bank",
            description: "Punjab National Bank is an Indian nationalised bank.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "0622f534-37fd-447d-b69c-0e23ae264b37",
            bank_code: "HDFC",
            bank_name: "HDFC Bank",
            description:
              "HDFC Bank is an Indian banking and financial services company headquartered in Mumbai.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "ab495483-dd5a-450b-8478-ba04d492eaf9",
            bank_code: "ICICI",
            bank_name: "ICICI Bank",
            description:
              "ICICI Bank is an Indian multinational banking and financial services company.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "357c6b3a-18b9-44fa-8b84-7fa1ac3ee510",
            bank_code: "AXIS",
            bank_name: "Axis Bank",
            description:
              "Axis Bank is the third largest private sector bank in India.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "b493d181-603b-4d38-a569-aeabb8f82cbd",
            bank_code: "BOB",
            bank_name: "Bank of Baroda",
            description:
              "Bank of Baroda is an Indian nationalised banking and financial services company.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "52122d42-87e9-4734-9d5e-cd349f38aa40",
            bank_code: "CANARA",
            bank_name: "Canara Bank",
            description:
              "Canara Bank is one of the largest public sector banks owned by the Government of India.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "41c92451-1ed7-45f4-a5b2-ebc73049d71e",
            bank_code: "KOTAK",
            bank_name: "Kotak Mahindra Bank",
            description:
              "Kotak Mahindra Bank is an Indian private sector bank headquartered in Mumbai.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "2a231dbf-3a09-4ef9-88cc-1febe2e5ff41",
            bank_code: "UBI",
            bank_name: "Union Bank of India",
            description:
              "Union Bank of India is one of the largest government-owned banks of India.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "74008240-7a2a-4760-be11-ec9a4ceac7ad",
            bank_code: "INDUSIND",
            bank_name: "IndusInd Bank",
            description:
              "IndusInd Bank is a Mumbai based Indian new generation bank.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "ee9fb0ca-0dfc-45cd-8944-19ff12e1e391",
            bank_code: "SBI",
            bank_name: "State Bank of India",
            description:
              "State Bank of India is an Indian multinational, public sector banking and financial services company.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "53186ff9-dc41-4a0d-848a-915ca7978d73",
            bank_code: "YES",
            bank_name: "Yes Bank",
            description:
              "Yes Bank is an Indian public sector bank headquartered in Mumbai.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "a890e679-3f4a-4b5c-a144-9d65ec5de3b9",
            bank_code: "BOI",
            bank_name: "Bank of India (BoI)",
            description:
              "Bank of India is an Indian commercial bank headquartered in Mumbai.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "51de2fdc-09ba-4556-b4fd-c4173e72bf96",
            bank_code: "INDIAN",
            bank_name: "Indian Bank",
            description:
              "Indian Bank is an Indian nationalised financial services and banking company.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
          {
            id: "23a886aa-8728-4ee8-87e5-2f855c1e3b0e",
            bank_code: "CBI",
            bank_name: "Central Bank of India",
            description:
              "Central Bank of India is a government-owned bank and one of the oldest and largest commercial banks in India.",
            is_active: true,
            action_by: "Demo",
            action_at: "2024-07-12T06:23:53.651Z",
            full_count: "21",
          },
        ],
      },
    },
    { status: 200 }
  );
}
