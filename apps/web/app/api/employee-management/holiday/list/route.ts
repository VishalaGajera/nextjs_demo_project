import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Holidays List Retrieved Successfully",
      data: [
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
          id: "8c372dda-5620-4dc7-b405-fccc2b2f70690c",
          name: "Dhuleti",
          date: "14 jan 2024",
        },
        {
          id: "8c372dda-5620-4dc7-b405-fccc2b2f707d",
          name: "Raksha Bandhan",
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
        {
          id: "8c372dda-5620-4dc7-b405-fccc2b6-fbf-ju9g",
          name: "Diwali",
          date: "14 jan 2024",
        },
      ],
    },
    { status: 200 }
  );
}
