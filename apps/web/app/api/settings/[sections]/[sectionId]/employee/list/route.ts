import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Employees listed successfully.",
    data: {
      totalCount: 11,
      employees: [
        {
          employee_id: "ecb2f688-5d39-42db-b2b9-64ab3ae35798",
          employee_code: "HI50NAL",
          employee_name: "Jay Jay",
          full_count: "11",
        },
        {
          employee_id: "30b71c81-8532-46a1-9780-e0dbf3008ddc",
          employee_code: "HI68NAL",
          employee_name: "Jay kyada",
          full_count: "11",
        },
        {
          employee_id: "686cb9c8-b087-4b33-b48d-6a320ae6acd6",
          employee_code: "HI75NAL",
          employee_name: "Jay kyada",
          full_count: "11",
        },
        {
          employee_id: "b1e4c7ae-4278-48ec-a3d1-56b829c7e76e",
          employee_code: "HI76NAL",
          employee_name: "Jay kyada",
          full_count: "11",
        },
        {
          employee_id: "29d19aa3-2ec8-47ce-a2bf-9c5cab15326d",
          employee_code: "HI77NAL",
          employee_name: "Jay kyada",
          full_count: "11",
        },
        {
          employee_id: "9f6e57a5-43a1-4776-9519-137cebbde603",
          employee_code: "HI78NAL",
          employee_name: "Jay kyada",
          full_count: "11",
        },
        {
          employee_id: "b4fc65e1-1141-4d19-89c6-59d6b0eaf3fb",
          employee_code: "HI79NAL",
          employee_name: "Jay kyada",
          full_count: "11",
        },
        {
          employee_id: "fab71be0-5568-467b-a989-f71eb43676f6",
          employee_code: "HI80NAL",
          employee_name: "Jay kyada",
          full_count: "11",
        },
        {
          employee_id: "6ceeeeda-a1f0-47b4-ba91-72f7080a0dae",
          employee_code: "HI81NAL",
          employee_name: "Jay kyada",
          full_count: "11",
        },
        {
          employee_id: "954bf18e-b745-4f85-9128-1546c1bcdaee",
          employee_code: "HI82NAL",
          employee_name: "Jay kyada",
          full_count: "11",
        },
        {
          employee_id: "e4033a2b-9bbc-47bb-9f73-43d5a99b45b0",
          employee_code: "HI83NAL",
          employee_name: "Jay kyada",
          full_count: "11",
        },
      ],
    },
  });
}
