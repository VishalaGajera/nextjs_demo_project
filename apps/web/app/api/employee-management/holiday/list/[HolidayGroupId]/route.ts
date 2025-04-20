import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Holidays List Retrieved Successfully",
      data: {
        totalCount: 6,
        holidays: [
          {
            id: "8c372dda-5620-4dc7-b405-fccc2b2f706b",
            holiday_name: "Makar Sankranti",
            holiday_date: "2024-01-31T18:30:00.000Z",
          },
          {
            id: "8c372dda-5620-4dc7-b405-fccc2b2-fbf-j89b",
            holiday_name: "Ganesh Visharjan",
            holiday_date: "2024-01-31T18:30:00.000Z",
          },
          {
            id: "8c372dda-5620-4dc7-b405-fccc2b2f70690c",
            holiday_name: "Dhuleti",
            holiday_date: "2024-01-31T18:30:00.000Z",
          },
          {
            id: "8c372dda-5620-4dc7-b405-fccc2b2f707d",
            holiday_name: "Raksha Bandhan",
            holiday_date: "2024-01-31T18:30:00.000Z",
          },
          {
            id: "8c372dda-5620-4dc7-b405-fccc2b2-fbf-ju9g",
            holiday_name: "Marketing and Advertising",
            holiday_date: "2024-01-31T18:30:00.000Z",
          },
          {
            id: "8c372dda-5620-4dc7-b405-fccc2b2f907d",
            holiday_name: "Independance Day",
            holiday_date: "2024-01-31T18:30:00.000Z",
          },
        ],
      },
    },
    { status: 200 }
  );
}
