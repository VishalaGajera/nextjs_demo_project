import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Employees retrieved successfully.",
      data: [
        {
          value: "9ebeddc7-ed56-43b0-8767-4f3a0c784e51",
          label: "Bhavik Shah",
          avatar:
            "https://sixtify.s3.amazonaws.com/1723787550246_androgynous-avatar-non-binary-queer-person.jpg",
        },
        {
          value: "df8adef6-c40b-4317-838b-c6b0321df268",
          label: "Chirag Sondagar",
          avatar:
            "https://sixtify.s3.amazonaws.com/1725280071171_f2ac51f4c59265a0c022339c16119936.jpg",
        },
        {
          value: "7b6e429d-f117-4f40-8e92-637c7fe1f633",
          label: "Darshan Darshan",
          avatar:
            "https://sixtify.s3.amazonaws.com/1723808191258_professional logo.jpg",
        },
        {
          value: "91b86db5-b1bf-41b5-99e7-a58348ecb2b4",
          label: "Manish shah",
          avatar: "https://sixtify.s3.amazonaws.com/1724304517532_preview.jpg",
        },
        {
          value: "44496767-832f-4a3b-8b15-a8f50d3f6979",
          label: "test bhavik",
          avatar: null,
        },
        {
          value: "86546d5e-c4a5-4d01-b875-ca11dd46eadc",
          label: "Testing Testing",
          avatar:
            "https://sixtify.s3.amazonaws.com/1724145704811_Teresa_Kuhn_Living_Wealthy_Financial_Austin_Texas.jpg",
        },
      ],
    },
    { status: 200 }
  );
}
