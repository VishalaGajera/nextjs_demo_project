import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Holiday Group List Retrieved Successfully",
      data: [
        {
          id: "8c372dda-5620-4dc7-b405-fccc2b2f706b",
          name: "Holiday List",
        },
        {
          id: "8c372dda-5620-4dc7-b405-fccc2b2-fbf-j89b",
          name: "Gujarat Holiday List",
        },
        {
          id: "8c372dda-5620-4dc7-b405-fccc2b2f70690c",
          name: "Maharashtra Holiday List",
        },
        {
          id: "8c372dda-5620-4dc7-b405-fccc2b2f707d",
          name: "Holiday List 1",
        },
        {
          id: "8c372dda-5620-4dc7-b405-fccc2b2-fbf-ju9g",
          name: "Gujarat Holiday List 2",
        },
      ],
    },
    { status: 200 }
  );
}
