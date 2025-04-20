import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "States fetched successfully.",
      data: [
        {
          id: "c9557c1f-92f0-4158-bdca-fa33e70563d7",
          state_name: "Andaman and Nicobar Islands",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "acee157d-58fa-4aee-aa84-b7fdfbefeafd",
          state_name: "Andhra Pradesh",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "414ad561-4593-45cb-8375-0748a3766c0a",
          state_name: "Arunachal Pradesh",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "f92b38e8-bc51-495e-9578-5c293ce9d821",
          state_name: "Assam",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "4bea82ed-bfb1-4368-ace5-7ffb32bcea34",
          state_name: "Bihar",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "bbc45569-a563-4792-b300-5faf0a99dade",
          state_name: "Chandigarh",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "bffba6f3-e9f7-4a1f-8069-5630aa33a275",
          state_name: "Chhattisgarh",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "f8cdad7b-34b2-4d60-bc79-5e1237d459ca",
          state_name: "Dadra and Nagar Haveli",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "b37f34b5-83dc-46d2-ad7f-36aad861ae16",
          state_name: "Daman and Diu",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "43dfc363-70b7-4d5d-98bf-4fb02cb196f1",
          state_name: "Delhi",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "9ab8bbf1-91e7-4e4c-a714-98d8d005bba5",
          state_name: "Goa",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
          state_name: "Gujarat",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "ea13795a-386a-42a8-844b-d222ab5abcee",
          state_name: "Haryana",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "f8bdb977-569a-470e-a3f2-51e2fe6df785",
          state_name: "Himachal Pradesh",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "2d3d7ac4-2fbd-47cc-98ca-c9d598fe4d05",
          state_name: "Jammu and Kashmir",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "1f05a6e9-4c9b-4836-8eb6-416a8b4340c6",
          state_name: "Jharkhand",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "25775722-7bf9-4020-85ad-c832db7e14f6",
          state_name: "Karnataka",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "8a5783f3-e1a4-426e-9372-a0d984155d30",
          state_name: "Kerala",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "801ea1d1-b25a-45dd-a9cb-bbb765d4b7b2",
          state_name: "Ladakh",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "809b13bb-b3fe-4528-b3f8-174dc37d6e9f",
          state_name: "Lakshadweep",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "beb61e13-a663-4017-8998-84ede7929d54",
          state_name: "Madhya Pradesh",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "a7e32716-4611-40af-9bd0-ca0d8d51847a",
          state_name: "Maharashtra",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "37a66a1c-d16b-40e2-a199-87425b6499c6",
          state_name: "Manipur",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "06772c50-8630-4ff4-a6e1-23368f5b77f0",
          state_name: "Meghalaya",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "4d19d77b-101a-429c-b59f-435322d8a1ef",
          state_name: "Mizoram",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "3fa356a8-a665-4cbf-8af4-45e6210ee9e5",
          state_name: "Nagaland",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "1b4b7aa6-0aa6-4e17-a85e-d7d40e911f6e",
          state_name: "Odisha",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "b4b4e19f-3968-4a45-bda2-a993948fda1b",
          state_name: "Puducherry",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "bd5da5f2-4e55-4d8f-a30b-e999a116f0b6",
          state_name: "Punjab",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "4c4650b4-2cd2-4668-96bd-c7319ba18d35",
          state_name: "Rajasthan",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "9d1b1d69-4178-4d68-9b88-6d648b22d89d",
          state_name: "Sikkim",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "662d88cf-5658-4168-84bf-95e8ad69194a",
          state_name: "Tamil Nadu",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "4cba6e92-0cad-4fa8-a3a5-cb0f81d66145",
          state_name: "Telangana",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "b264bba8-f202-45e9-be03-dcbcffa30fe6",
          state_name: "Tripura",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "91eee70d-04f4-43b7-acca-9ee4709e9180",
          state_name: "Uttarakhand",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "31fcf2c1-4d0c-4bf7-b296-fb43163fa8fe",
          state_name: "Uttar Pradesh",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
        {
          id: "22f14e68-8148-42e2-a8a3-211def221440",
          state_name: "West Bengal",
          country_id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
        },
      ],
    },
    { status: 200 }
  );
}
