import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const authorisedPersonId = searchParams.get("authorised_person_id");

  if (authorisedPersonId) {
    return NextResponse.json({
      message: "Authorised person details retrieved successfully",
      data: {
        id: authorisedPersonId,
        authorised_person_name: "Alice Smith",
        authorised_person_designation: "CEO",
        authorised_person_address: "123 Elm Street, Springfield",
        authorised_person_photo: null,
        authorised_person_signature: null,
      },
    });
  }

  return NextResponse.json({
    message: "Authorised person details retrieved successfully",
    data: [
      {
        id: "62972240-a323-4233-8010-8d358f55c92b",
        authorised_person_name: "Alice Smith",
        authorised_person_designation: "CEO",
        authorised_person_address: "123 Elm Street, Springfield",
        authorised_person_photo: null,
        authorised_person_signature: null,
      },
      {
        id: "62972240-a323-4233-8010-8d358f55c92b",
        authorised_person_name: "Alice Smith",
        authorised_person_designation: "CEO",
        authorised_person_address: "123 Elm Street, Springfield",
        authorised_person_photo: null,
        authorised_person_signature: null,
      },
      {
        id: "62972240-a323-4233-8010-8d358f55c92b",
        authorised_person_name: "Alice Smith",
        authorised_person_designation: "CEO",
        authorised_person_address: "123 Elm Street, Springfield",
        authorised_person_photo: null,
        authorised_person_signature: null,
      },
    ],
  });
}

export async function DELETE() {
  return NextResponse.json({
    message: "Authorised person deleted successfully.",
    data: null,
  });
}
