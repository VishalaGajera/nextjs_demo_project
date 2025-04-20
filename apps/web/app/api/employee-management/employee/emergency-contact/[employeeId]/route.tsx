import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "EMERGENCY_CONTACT_RETRIEVED_SUCCESSFULLY",
      data: {
        primary: {
          id: "4a275a3f-5f15-47b9-89d3-33eb6ea1e79a",
          employee_id: "2137cb32-f380-44fe-ac61-ed891a1313a3",
          name: "John Doe",
          email: "johndoe@example.com",
          relation: "father",
          mobile_no: "1234567890",
          address: "123 Main St, New York, NY",
          action_by: "Demo",
          action_at: "2024-08-12T04:30:22.527Z",
        },
        secondary: {
          id: "a6819c52-fe55-47a6-b76b-ab085a690bfa",
          employee_id: "2137cb32-f380-44fe-ac61-ed891a1313a3",
          name: "Jane Doe",
          email: null,
          relation: "wife",
          mobile_no: "0987654321",
          address: null,
          action_by: "Demo",
          action_at: "2024-08-12T04:30:22.595Z",
        },
      },
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "EMERGENCY_CONTACT_UPDATED_SUCCESSFULLY",
      data: {
        primary: {
          id: "4a275a3f-5f15-47b9-89d3-33eb6ea1e79a",
          employee_id: "2137cb32-f380-44fe-ac61-ed891a1313a3",
          contact_type: "primary",
          name: "John Doe",
          relation: "father",
          mobile_no: "1234567890",
          address: "123 Main St, New York, NY",
          email: "johndoe@example.com",
          created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
          updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
          created_at: "2024-08-12T04:30:22.527Z",
          updated_at: "2024-08-12T04:30:22.527Z",
        },
        secondary: {
          id: "a6819c52-fe55-47a6-b76b-ab085a690bfa",
          employee_id: "2137cb32-f380-44fe-ac61-ed891a1313a3",
          contact_type: "secondary",
          name: "Jane Doe",
          relation: "wife",
          mobile_no: "0987654321",
          address: null,
          email: null,
          created_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
          updated_by: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
          created_at: "2024-08-12T04:30:22.595Z",
          updated_at: "2024-08-12T04:30:22.595Z",
        },
      },
    },
    { status: 200 }
  );
}
