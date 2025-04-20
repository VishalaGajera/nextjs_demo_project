import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "User Login Successfully.",
      data: {
        user: {
          id: "9abf4988-6035-418c-96e0-899fb9ac5876",
          email: "bhavik@gmail.com",
          avatar: null,
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5YWJmNDk4OC02MDM1LTQxOGMtOTZlMC04OTlmYjlhYzU4NzYiLCJlbWFpbCI6ImJoYXZpa0BnbWFpbC5jb20iLCJpYXQiOjE3MTk4MjI5MjgsImV4cCI6MTcxOTkwOTMyOH0.bFo6TlXmoeyUXmgPHKvHLgBWj6FXyvpfr00M6P5MLD0",
        },
      },
    },
    { status: 200 }
  );
}
