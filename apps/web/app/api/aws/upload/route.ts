import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "All file uploaded successfully",
      data: {
        files: [
          "https://sixtify.s3.amazonaws.com/1719980888245_image_2024_07_02T05_44_54_796Z.png",
        ],
      },
    },
    { status: 200 }
  );
}
