import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Holidays listed successfully.",
      data: {
        totalCount: 12,
        holidays: [
          {
            id: "5e353bad-3454-4a0f-95f4-20486ef15dc7",
            holiday_name: "uttrayan",
            holiday_date: "2024-01-01T18:30:00.000Z",
            full_count: "12",
          },
          {
            id: "57009cff-2e0d-4d9f-b9bb-146a25e13712",
            holiday_name: "lohdi",
            holiday_date: "2024-01-11T18:30:00.000Z",
            full_count: "12",
          },
          {
            id: "4466113f-f289-42ae-a721-c5deae4ae95f",
            holiday_name: "Tij",
            holiday_date: "2024-04-14T18:30:00.000Z",
            full_count: "12",
          },
          {
            id: "7833e6e6-e79f-4a0b-8ee7-e72673b40a79",
            holiday_name: "karava chawth",
            holiday_date: "2024-06-07T18:30:00.000Z",
            full_count: "12",
          },
          {
            id: "fe5c9a50-bb22-4adc-b345-cb2508023ee0",
            holiday_name: "Navratri",
            holiday_date: "2024-07-04T18:30:00.000Z",
            full_count: "12",
          },
          {
            id: "f5db9358-b47b-42fa-ba47-d4d761c2243b",
            holiday_name: "Diwali",
            holiday_date: "2024-08-21T18:30:00.000Z",
            full_count: "12",
          },
          {
            id: "1695ba9d-0abe-4cd1-b200-37ee99237841",
            holiday_name: "Chathh",
            holiday_date: "2024-12-11T18:30:00.000Z",
            full_count: "12",
          },
          {
            id: "60de91f3-a8dd-42fd-aa2e-62cdc84ae042",
            holiday_name: "ABS",
            holiday_date: "2025-04-24T18:30:00.000Z",
            full_count: "12",
          },
          {
            id: "323d154a-b321-49eb-b0c3-1bc1880845e4",
            holiday_name: "Good Friday",
            holiday_date: "2025-08-14T18:30:00.000Z",
            full_count: "12",
          },
          {
            id: "4f3dece0-49c7-4c1e-92dd-203eb4703ace",
            holiday_name: "NSG",
            holiday_date: "2025-08-24T18:30:00.000Z",
            full_count: "12",
          },
          {
            id: "f1459389-b928-4bc8-8f10-f693d637094e",
            holiday_name: "Makar Sankranti",
            holiday_date: "2026-01-13T18:30:00.000Z",
            full_count: "12",
          },
          {
            id: "e2a70264-4bf1-4653-bca8-aa6897099e23",
            holiday_name: "Christmas",
            holiday_date: "2026-12-24T18:30:00.000Z",
            full_count: "12",
          },
        ],
      },
    },
    { status: 200 }
  );
}
