import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Business Unit added successfully.",
      data: {
        company_id: "e09ac297-6218-48e0-933f-9e11c45188b3",
        director_name: "John Doe",
        director_designation: "Managing Director",
        director_address: "456 Maple Avenue, Rivertown",
        director_photo: "http://example.com/director/photo2.png",
        director_signature: "http://example.com/director/signature2.png",
      },
    },
    { status: 200 }
  );
}
