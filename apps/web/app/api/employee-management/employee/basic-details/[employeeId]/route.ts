import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employee basic details retrieved successfully",
      data: {
        avatar:
          "https://sixtify.s3.amazonaws.com/1723800597918_depositphotos_675471232-stock-illustration-lion-king-wild-roars-majestic_1715750732604 - Copy.jpg",
        employee_code: "HI14NAL",
        punch_code: "3113",
        title: "mr.",
        employee_name: "Bhavik Shah",
        nick_name: null,
        department_id: "d33d3c85-edbc-48e2-88e4-5a4384367c26",
        department_name: "Research and Development",
        designation_id: "dc51c8bc-bc19-420a-b33d-29beb6b4a7fd",
        designation_name: "HR Manager",
        date_of_birth: "2024-08-02T18:30:00.000Z",
        gender: null,
        joining_date: "2024-07-31T18:30:00.000Z",
        on_book_joining_date: null,
        confirmation_date: null,
        email: "manubhai@gmail.com",
        mobile_no: "9725111739",
        reporting_manager_id: null,
        reporting_manager_name: null,
        reporting_manager_avatar: null,
        action_by: "Demo",
        action_at: "2024-08-16T04:00:18.738Z",
      },
    },
    { status: 200 }
  );
}
