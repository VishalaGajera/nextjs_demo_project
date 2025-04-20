import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Cities fetched successfully.",
      data: [
        {
          id: "f19e6d83-e462-4716-baf5-36b02873dd37",
          city_name: "Adalaj",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "a9f2e4ae-fa07-4da0-9ca3-bb454538f407",
          city_name: "Ahmedabad",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "0cc7bfbd-413f-4cfa-a293-8dc90c9ee9f3",
          city_name: "Amreli",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "0f6213f5-7f85-49ba-99a7-e4fcd105d093",
          city_name: "Anand",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "efcd5da7-a893-45d8-a414-c88b2dedc790",
          city_name: "Anjar",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "d15bc76f-d149-4f5b-8157-b1bf0ec98925",
          city_name: "Ankleshwar",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "3d5eec89-078e-43d6-b197-75972b6b5f28",
          city_name: "Bharuch",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "16a90621-c870-43bd-9622-d8aedea807e0",
          city_name: "Bhavnagar",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "5d01550d-0f0f-4b11-a911-e3a4e1aeabb9",
          city_name: "Bhuj",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "9d0fc1b7-bfce-4f1b-a498-0147dc32c039",
          city_name: "Chhapra",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "6f72ef6d-7a0a-460d-b381-03163fb9e865",
          city_name: "Deesa",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "8ec3ad8e-0aab-43d1-8c6c-2d4ec5d36655",
          city_name: "Dhoraji",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "268e6e1e-a6b4-4ef4-ab13-10fde332c7ca",
          city_name: "Gandhinagar",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "331e9689-97c2-4e52-9369-505ea82bbcac",
          city_name: "Godhra",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "8a35b685-580e-493c-a440-14be0a4448fc",
          city_name: "Jamnagar",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "2c689d67-9449-4c52-a8bb-d742e3142c5d",
          city_name: "Kadi",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "b1416ec5-7012-4be3-a1a8-a2356eec7696",
          city_name: "Kapadvanj",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "081c660c-5b17-4efb-8e43-2cc356b61a13",
          city_name: "Keshod",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "d61341d3-0ba1-4e5f-91aa-79e85323aa1d",
          city_name: "Khambhat",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "ef5474e9-2255-4173-914f-0517d0cf9004",
          city_name: "Lathi",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "1f2c0a61-47f6-487d-89be-69c772644fb9",
          city_name: "Limbdi",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "f28c35bb-17fc-478a-9681-097651033689",
          city_name: "Lunawada",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "34869b1b-a7e2-4e39-9303-5ca7cae54117",
          city_name: "Mahemdabad",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "b269193e-c4bb-4055-bbcd-0e013f3bee97",
          city_name: "Mahesana",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "1a35f0a2-89a3-46b2-887a-b09e34074d39",
          city_name: "Mahuva",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "bda1c91c-95e9-420e-8ccf-96b5206b44be",
          city_name: "Manavadar",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "ef385998-d0c2-459e-90ec-391b2a28a244",
          city_name: "Mandvi",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "42455013-7a71-467e-97dc-32af3e069442",
          city_name: "Mangrol",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "2d81751b-c9c3-4793-9878-005dda6eeafd",
          city_name: "Mansa",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "346fe6ff-310f-4dd1-9f54-167e939ee5a6",
          city_name: "Modasa",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "47db6200-416a-494d-85fb-a3e2a7448e88",
          city_name: "Morvi",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "5c159a1c-af5e-41b5-a589-d6f02fe00a1c",
          city_name: "Nadiad",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "d1ed7132-407d-4d5b-b23e-224e7ff1e2d9",
          city_name: "Navsari",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "cd2a8dda-7394-4c46-8cf5-fb274410de55",
          city_name: "Padra",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "fa795252-3cf6-44da-a8eb-1dc53c82cb8e",
          city_name: "Palanpur",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "aa37fbf1-07e7-4860-82a0-1b7fbd1e3327",
          city_name: "Palitana",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "a5389691-a045-44e1-b8d4-9e4d4d6de378",
          city_name: "Pardi",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "456ed08e-340c-41e2-9339-644c195e47f2",
          city_name: "Patan",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "2956c627-963d-4f69-aad3-6d0e576458f6",
          city_name: "Petlad",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "f2544f2f-bb6a-4bdd-9a80-4f8a2a2fc5c1",
          city_name: "Porbandar",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "2c6e8565-aaaf-45dc-a2c1-0aa33b2be9e9",
          city_name: "Radhanpur",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "da153ddf-9d8e-4945-b2ec-482ed24a374d",
          city_name: "Rajkot",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "480a7bd2-9254-48e0-ba60-2e6bc177fd26",
          city_name: "Rajpipla",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "2e817aec-93e8-4ffe-801a-ca6a4c49ee9a",
          city_name: "Rajula",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "3ac230fc-b5d5-43ad-917d-3e36da670c72",
          city_name: "Ranavav",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "452dea52-fc54-4f96-ae89-fc4d8354b6f9",
          city_name: "Rapar",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "af0eb71c-a2f9-454b-9590-cd624afe3e04",
          city_name: "Salaya",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "dd4e395a-4856-4c18-bcb0-87c1a18e7b90",
          city_name: "Sanand",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "0650b33c-ea2f-4573-a2ee-6829f6976cae",
          city_name: "Savarkundla",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "a43cd9dc-0185-4819-93e8-118ba05b8dcd",
          city_name: "Sidhpur",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "3eb36cd7-0ac9-4430-a998-c6ce1683e09e",
          city_name: "Sihor",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "8cb4595a-b18e-48d1-812d-3dc3a3d9dc50",
          city_name: "Songadh",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "0f4ce030-f672-49bd-a8b6-ee52d2303a31",
          city_name: "Surat",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "63e75847-ecd6-41a5-a1eb-f7cd6588940e",
          city_name: "Talaja",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "50f9833d-0291-44c6-aa70-4e96e00d2ff8",
          city_name: "Thangadh",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "0b508408-d76c-44b1-a5eb-834991e9373e",
          city_name: "Tharad",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "b4752e3b-b05f-4e97-9231-88d04525f549",
          city_name: "Umbergaon",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "f678d5a1-f361-45a5-a5e5-637efa3a51ce",
          city_name: "Umreth",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "7561c703-91e9-4aaa-a4b6-8de80b498508",
          city_name: "Una",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "cae60e4e-498b-4676-8ae0-b6b45eb5e1e3",
          city_name: "Unjha",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "7320cb3e-6c16-4881-960c-c878fc43056c",
          city_name: "Upleta",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "2a71e01d-19a3-4de0-9001-9189c203f0fc",
          city_name: "Vadnagar",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "a5672e68-ba86-4886-b915-8e4cfe13ab93",
          city_name: "Vadodara",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "654e0511-3634-4b30-8ec8-6ab478c1bda6",
          city_name: "Valsad",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "c502bcdc-dfdd-44e5-b3ea-348ce538d6ef",
          city_name: "Vapi",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "0b6c9bfe-e4a7-489a-8eb4-3b2957eb85c6",
          city_name: "Vapi",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "b68f9bec-cfac-4384-b40f-c4f7f9df1026",
          city_name: "Veraval",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "dfac88aa-6f84-415d-b2f4-cdecb460b7eb",
          city_name: "Vijapur",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "00f762d4-3bde-4b2f-b236-b525e4262db4",
          city_name: "Viramgam",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "72e29246-0c8f-4d21-9600-4e8ab9531848",
          city_name: "Visnagar",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "9bed6185-80b4-47c1-9f37-2cfc8491ba31",
          city_name: "Vyara",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "c8f14de4-5b73-4456-94e2-d6e8a476509b",
          city_name: "Wadhwan",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
        {
          id: "9f88890d-62fb-4b32-a10a-342ed89d485b",
          city_name: "Wankaner",
          state_id: "9f89210f-14bf-4451-93e8-d41a0963df8e",
        },
      ],
    },
    { status: 200 }
  );
}
