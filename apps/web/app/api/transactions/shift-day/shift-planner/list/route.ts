import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Shift Planner fetched successfully.",
      data: {
        totalCount: 1,
        employees: [
          {
            id: "c36172a7-0974-44f4-b3a6-dce4b971b72e",
            employee_code: null,
            punch_code: null,
            avatar: null,
            employee_name: "Alice Jane Williams",
            company_name: "Codezee Solutions PVT Ltd.",
            business_unit_name: "Business pvt",
            business_unit_location_name: "CodeZee Location",
            department_name: "Research and Development",
            sub_department_name: "System Analysis",
            designation_name: "HR Manager",
            shift_type_name: "HR Manager",
            days: {
              "1": {
                label: "GEN",
                dayType: "weekly_off",
                tooltip: "General (08:00 - 16:00)",
              },
              "2": {
                label: "GEN",
                dayType: "first_half_weekly_off",
                tooltip: "General (08:00 - 16:00)",
              },
              "3": {
                label: "GEN",
                dayType: "second_half_weekly_off",
                tooltip: "General (08:00 - 16:00)",
              },
              "4": {
                label: "GEN",
                dayType: "holiday",
                tooltip: "General (08:00 - 16:00)",
              },
              "5": {
                label: "GEN",
                dayType: "working",
                tooltip: "General (08:00 - 16:00)",
              },
              "6": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "7": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "8": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "9": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "10": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "11": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "12": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "13": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "14": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "15": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "16": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "17": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "18": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "19": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "20": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "21": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "22": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "23": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "24": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "25": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "26": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "27": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "28": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "29": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
              "30": {
                label: "GEN",
                dayType: "working_day",
                tooltip: "General (08:00 - 16:00)",
              },
            },
          },
        ],
      },
    },
    { status: 200 }
  );
}
