import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Holiday Group Data Retrieved Successfully",
      data: {
        year: "2024",
        company_id: "a45accee-c3b9-447f-9ec1-a8f0d07abedb",
        holiday_group_name: "Holiday List",
        holidays: [
          {
            id: "8c372dda-5620-4dc7-b405-fccc2b2f706b",
            name: "Makar Sankranti",
            date: "14 jan 2024",
          },
          {
            id: "8c372dda-5620-4dc7-b405-fccc2b2-fbf-j89b",
            name: "Ganesh Visharjan",
            date: "14 jan 2024",
          },
          {
            id: "8c372dda-5620-4dc7-b405-fccc2b2-fbf-ju9g",
            name: "Marketing and Advertising",
            date: "14 jan 2024",
          },
          {
            id: "8c372dda-5620-4dc7-b405-fccc2b2f907d",
            name: "Independance Day",
            date: "14 jan 2024",
          },
        ],
      },
    },
    { status: 200 }
  );
}
