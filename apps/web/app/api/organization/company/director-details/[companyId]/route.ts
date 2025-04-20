import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Director details retrieved successfully",
      data: [
        {
          id: "62972240-a323-4233-8010-8d358f55c92b",
          director_name: "Alice Smith",
          director_designation: "CEO",
          director_address: "123 Elm Street, Springfield",
          director_photo: null,
          director_signature: null,
        },
        {
          id: "5e9f4517-a1d4-4961-ae04-daad1237811a",
          director_name: "John Doe",
          director_designation: null,
          director_address: null,
          director_photo: null,
          director_signature: null,
        },
        {
          id: "0e1b900a-0eea-4da8-aae0-354b865659c1",
          director_name: "Alice Smith",
          director_designation: "CEO",
          director_address: "123 Elm Street, Springfield",
          director_photo: null,
          director_signature: null,
        },
        {
          id: "94a856ee-6121-4d7e-a3cb-61ee049d6808",
          director_name: "Alice Smith",
          director_designation: "CEO",
          director_address: "123 Elm Street, Springfield",
          director_photo: "http://example.com/director/photo1.png",
          director_signature: null,
        },
        {
          id: "94a856ee-6121-4d7e-a3cb-61ee049d6808",
          director_name: "Alice Smith",
          director_designation: "CEO",
          director_address: "123 Elm Street, Springfield",
          director_photo: null,
          director_signature: null,
        },
        {
          id: "94a856ee-6121-4d7e-a3cb-61ee049d6808",
          director_name: "Alice Smith",
          director_designation: "CEO",
          director_address: "123 Elm Street, Springfield",
          director_photo: null,
          director_signature: null,
        },
      ],
    },
    { status: 200 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      message: "Director Details updated successfully.",
      data: {
        director_name: "John Doe 123",
        director_designation: null,
        director_address: null,
        director_photo: null,
        director_signature: null,
      },
    },
    { status: 200 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      message: "Director Details deleted successfully.",
      data: {},
    },
    { status: 200 }
  );
}
