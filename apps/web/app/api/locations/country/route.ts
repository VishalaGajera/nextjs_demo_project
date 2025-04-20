import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Countries fetched successfully.",
      data: [
        {
          id: "8313e8fd-6e2b-47b1-b950-211b1d7e042a",
          country_name: "Afghanistan",
        },
        {
          id: "77f78fac-1c3a-4a3c-a7c9-7d5a89bb9c88",
          country_name: "Åland Islands",
        },
        {
          id: "13302f50-5983-4027-a90e-376148e0c433",
          country_name: "Albania",
        },
        {
          id: "36538d38-2fae-4826-bfab-b5686c83eb28",
          country_name: "Algeria",
        },
        {
          id: "68653633-b80a-451a-8530-bcd4ff8dabf1",
          country_name: "American Samoa",
        },
        {
          id: "6adf40cf-57bc-44e9-a2be-fa4ef2fe5eab",
          country_name: "Andorra",
        },
        {
          id: "5b8a8779-2c44-4753-870e-7544caed6518",
          country_name: "Angola",
        },
        {
          id: "4c00340a-392e-4a9d-9980-83437895491a",
          country_name: "Anguilla",
        },
        {
          id: "6dbb93f8-7d5b-4421-b71f-7acc2245bd40",
          country_name: "Antarctica",
        },
        {
          id: "87e94c67-e952-4224-8806-926d55ef0486",
          country_name: "Antigua and Barbuda",
        },
        {
          id: "f19e26f3-1b97-4d8e-9e88-0722a37304c2",
          country_name: "Argentina",
        },
        {
          id: "2676b859-3d3f-41a7-b7a9-0778523d0607",
          country_name: "Armenia",
        },
        {
          id: "6a764285-d635-49f1-b7f5-98c72b1d1f0a",
          country_name: "Aruba",
        },
        {
          id: "56aa60ec-207d-410a-a602-a8c78858d1fa",
          country_name: "Australia",
        },
        {
          id: "7bf26dbe-024d-4500-84bb-2e94de47c445",
          country_name: "Austria",
        },
        {
          id: "1daf1a83-c1e8-4eb0-8485-2b03077c9bb8",
          country_name: "Azerbaijan",
        },
        {
          id: "601381f7-1500-4bf9-98f0-b68cd9be5e94",
          country_name: "Bahamas (the)",
        },
        {
          id: "6def04a6-08da-4243-8ec4-8585a5414f45",
          country_name: "Bahrain",
        },
        {
          id: "48a33b56-04bc-4022-8e4e-38e0708a764e",
          country_name: "Bangladesh",
        },
        {
          id: "a7492b40-8fb9-4d6d-8703-37b3e8615c8a",
          country_name: "Barbados",
        },
        {
          id: "a12dbf39-f731-44ee-a715-6fcf9b0d604c",
          country_name: "Belarus",
        },
        {
          id: "41db0340-7c52-4f9f-adac-f28d836254e6",
          country_name: "Belgium",
        },
        {
          id: "7a16b930-fefb-44b0-8ed8-c6133831fa5b",
          country_name: "Belize",
        },
        {
          id: "2176fa47-b1c5-4bc7-a9bc-b492303d2195",
          country_name: "Benin",
        },
        {
          id: "8f4a0d57-8072-4223-83a6-b526de552f9c",
          country_name: "Bermuda",
        },
        {
          id: "b2f9f126-67bb-4649-a529-4e063dd32f83",
          country_name: "Bhutan",
        },
        {
          id: "89788551-2451-4236-8afb-09e5696238b0",
          country_name: "Bolivia (Plurinational State of)",
        },
        {
          id: "30621e8b-2a78-4f99-978a-0888e94af1c5",
          country_name: "Bonaire, Sint Eustatius and Saba",
        },
        {
          id: "1e5cba1a-ea26-4864-8941-251519e3d74c",
          country_name: "Bosnia and Herzegovina",
        },
        {
          id: "bd36dd23-12ed-4c91-8d3a-e7854c4ba49d",
          country_name: "Botswana",
        },
        {
          id: "021c2bff-8a89-4852-8351-ee4acba20c9a",
          country_name: "Bouvet Island",
        },
        {
          id: "b056f90d-05d4-478b-b076-878bc62b52da",
          country_name: "Brazil",
        },
        {
          id: "181cc321-d0a2-43d7-8847-0e72f707dea1",
          country_name: "British Indian Ocean Territory (the)",
        },
        {
          id: "c642a2a6-15d7-4131-8bb1-ab7b6059a637",
          country_name: "Brunei Darussalam",
        },
        {
          id: "e67b9a59-465b-473d-9fdc-d2514d8905b7",
          country_name: "Bulgaria",
        },
        {
          id: "3b70a28c-1de8-45b4-83c4-20afa1cc5918",
          country_name: "Burkina Faso",
        },
        {
          id: "509c7025-b16f-44cc-8378-24139b37eeca",
          country_name: "Burundi",
        },
        {
          id: "a920e8cb-5fe6-435e-b0f1-c89fcadf3733",
          country_name: "Cabo Verde",
        },
        {
          id: "268f8415-5e64-4520-bddb-55a52d364be1",
          country_name: "Cambodia",
        },
        {
          id: "ff98e065-014a-40f2-8f39-8c0c5b5f2a6e",
          country_name: "Cameroon",
        },
        {
          id: "9a756738-1b74-47a7-adb5-119578aab5d2",
          country_name: "Canada",
        },
        {
          id: "7eb5bab1-309b-43cd-810f-520de96322b2",
          country_name: "Cayman Islands (the)",
        },
        {
          id: "a9942e81-43a6-49a5-9d7c-651f10e6a2a4",
          country_name: "Central African Republic (the)",
        },
        {
          id: "0dd9cb28-2171-48bd-a972-bbc863b1aa82",
          country_name: "Chad",
        },
        {
          id: "3e4f8af9-e171-4a85-bd41-2a2fba422992",
          country_name: "Chile",
        },
        {
          id: "896b82d1-a060-403f-b443-3ecb62dde99d",
          country_name: "China",
        },
        {
          id: "24f773ed-bebf-4d2d-b3a9-472a65620152",
          country_name: "Christmas Island",
        },
        {
          id: "5455b9cb-b247-4ce6-84c1-e0822c195955",
          country_name: "Cocos (Keeling) Islands (the)",
        },
        {
          id: "76515dda-dd73-46d4-bdde-27ca9642e1e4",
          country_name: "Colombia",
        },
        {
          id: "23f8dcc4-66ae-4ce7-b40f-adf81317ab21",
          country_name: "Comoros (the)",
        },
        {
          id: "56ee7677-8efc-41fd-a597-ff994727d5ea",
          country_name: "Congo (the)",
        },
        {
          id: "23b23308-4b78-49ec-a063-8f3722b4786d",
          country_name: "Congo (the Democratic Republic of the)",
        },
        {
          id: "6fba59d0-308f-4f80-bda5-90cd181c7704",
          country_name: "Cook Islands (the)",
        },
        {
          id: "f1907c94-942d-446b-9b5f-e0e302ac3bf0",
          country_name: "Costa Rica",
        },
        {
          id: "c887f350-9eba-421b-a753-52836996903b",
          country_name: "Côte d'Ivoire",
        },
        {
          id: "d4215d96-fede-4ce6-a1c0-79b9031971f9",
          country_name: "Croatia",
        },
        {
          id: "09a55e53-d3fb-4c26-840c-8707e2284abd",
          country_name: "Cuba",
        },
        {
          id: "f9d5415a-7938-49c3-9097-0675098ddb1d",
          country_name: "Curaçao",
        },
        {
          id: "f500b500-5291-40e2-8c50-1cac5fee7fb9",
          country_name: "Cyprus",
        },
        {
          id: "f5a74300-2dbe-418a-831b-819cdc255842",
          country_name: "Czechia",
        },
        {
          id: "268ee0f2-8f04-448d-af47-8f27262e656d",
          country_name: "Denmark",
        },
        {
          id: "6d21b58d-2cc6-4fbc-bfa0-53d1d1af0f3f",
          country_name: "Djibouti",
        },
        {
          id: "153c0543-b57f-4ed2-a3b6-0d5690cc0ad7",
          country_name: "Dominica",
        },
        {
          id: "53c56eec-0e3f-4f54-8222-fdcf82b8e3c7",
          country_name: "Dominican Republic (the)",
        },
        {
          id: "39d2cec3-dbb0-4cce-ae7f-e2484d7a0316",
          country_name: "Ecuador",
        },
        {
          id: "2fa99207-462b-4a5f-bd35-3b182b72a05d",
          country_name: "Egypt",
        },
        {
          id: "d2c86dac-cb6e-44fa-85e4-a8fe3e0c83e2",
          country_name: "El Salvador",
        },
        {
          id: "08d03f53-bd99-4843-ba9a-b06c9d80c359",
          country_name: "Equatorial Guinea",
        },
        {
          id: "9d9927c4-395b-4b8d-a451-017f73b9c275",
          country_name: "Eritrea",
        },
        {
          id: "145db721-7f32-412c-87ff-e8bfdf1f6b97",
          country_name: "Estonia",
        },
        {
          id: "b98e2893-818a-4168-82ed-a4a3a8f18fe4",
          country_name: "Eswatini",
        },
        {
          id: "85dd89d0-6bf9-4bf6-b59b-78b30fc9fb1b",
          country_name: "Ethiopia",
        },
        {
          id: "790089f2-e606-4483-b88b-ac7e13cedcc5",
          country_name: "Falkland Islands (the) [Malvinas]",
        },
        {
          id: "58a43806-8d4e-4c35-80dc-eac5559a5894",
          country_name: "Faroe Islands (the)",
        },
        {
          id: "2cceceac-6b5e-4d50-b9d7-3d611ec0c70e",
          country_name: "Fiji",
        },
        {
          id: "a14e15f1-0430-48a7-acd4-944941b077be",
          country_name: "Finland",
        },
        {
          id: "4a71e30c-a551-49f1-b7fb-ac3ebf85a2fe",
          country_name: "France",
        },
        {
          id: "fc245628-1f90-4cd6-94ab-610ac6ee55be",
          country_name: "French Guiana",
        },
        {
          id: "6efc7a85-b94b-4beb-a7d7-d355c2bab8b7",
          country_name: "French Polynesia",
        },
        {
          id: "d2312224-fd78-4828-9d90-ec9af5c53909",
          country_name: "French Southern Territories (the)",
        },
        {
          id: "f790aa9e-3077-4432-9238-dc2f4b033df2",
          country_name: "Gabon",
        },
        {
          id: "0b6b3e19-91b9-4339-a23d-ccd134300ed4",
          country_name: "Gambia (the)",
        },
        {
          id: "0b2e85f9-a5f7-44e4-86db-1a2ffb327b5a",
          country_name: "Georgia",
        },
        {
          id: "cb99281c-67fb-4650-a71b-d67478b10cea",
          country_name: "Germany",
        },
        {
          id: "c25e9002-b5be-4826-939c-9c4b0198f3a5",
          country_name: "Ghana",
        },
        {
          id: "cfad3caf-9bda-4ae9-81b5-44a0fd6e66e8",
          country_name: "Gibraltar",
        },
        {
          id: "fb11b170-1529-4d1d-b5f8-8a0aa4e5dcc3",
          country_name: "Greece",
        },
        {
          id: "c47cb75d-62ac-45f1-b2aa-c86d91708d4a",
          country_name: "Greenland",
        },
        {
          id: "24abed3c-2f27-4a3e-ab13-15cdf2e37059",
          country_name: "Grenada",
        },
        {
          id: "c8e75bee-3b8b-43ab-a699-6a421a0d9e2c",
          country_name: "Guadeloupe",
        },
        {
          id: "7ce01402-bea1-440f-93ed-6fedd3a27763",
          country_name: "Guam",
        },
        {
          id: "7b7a4924-b3dc-4f34-a6ab-b8dde5f709f8",
          country_name: "Guatemala",
        },
        {
          id: "46902782-56ab-489e-b93a-55e800da0b60",
          country_name: "Guernsey",
        },
        {
          id: "46a82115-dcee-4d80-9358-d2571f98ca8c",
          country_name: "Guinea",
        },
        {
          id: "e23a1a3d-e353-42a9-904c-1cb42fc606b4",
          country_name: "Guinea-Bissau",
        },
        {
          id: "8862fc1b-2765-4437-a00c-6bf248206169",
          country_name: "Guyana",
        },
        {
          id: "2dd8e45e-9e36-4ddc-a929-4206bdc4c2aa",
          country_name: "Haiti",
        },
        {
          id: "86399532-583a-4d8e-bc73-a62c4c7ed8c5",
          country_name: "Heard Island and McDonald Islands",
        },
        {
          id: "cd103eda-53d0-4302-b684-945eb99db4bf",
          country_name: "Holy See (the)",
        },
        {
          id: "5105c679-a64d-4017-9e7b-473dfa2f189e",
          country_name: "Honduras",
        },
        {
          id: "a072b817-0329-420d-85d4-b886f3642ec0",
          country_name: "Hong Kong",
        },
        {
          id: "fa46336d-0dc0-4835-98ee-2e905b6bf598",
          country_name: "Hungary",
        },
        {
          id: "1c7d9c03-9ffb-40b9-8b93-2473a97d7e01",
          country_name: "Iceland",
        },
        {
          id: "cb6c8d39-ab05-4220-90d6-8eda6b3b9ce5",
          country_name: "India",
        },
        {
          id: "2b8b625d-42d1-43dc-9e37-67f89e2a8add",
          country_name: "Indonesia",
        },
        {
          id: "8cd85d24-dfd3-4392-8396-16ac20f588a3",
          country_name: "Iran (Islamic Republic of)",
        },
        {
          id: "bed76dc6-1a4a-4c89-a7b4-853842dc03ff",
          country_name: "Iraq",
        },
        {
          id: "bb32f26b-49f6-4c58-b158-c791a63ec44e",
          country_name: "Ireland",
        },
        {
          id: "5cd3509a-778b-457b-8952-bd36ecedc9f4",
          country_name: "Isle of Man",
        },
        {
          id: "3a98c9a3-b5eb-4ffc-b54b-decb43083bf8",
          country_name: "Israel",
        },
        {
          id: "39fdabec-8553-4c80-bfaa-f37bae40068a",
          country_name: "Italy",
        },
        {
          id: "4befb5f7-2567-46a2-8253-a25cc6b4faff",
          country_name: "Jamaica",
        },
        {
          id: "9af5262f-9312-43b5-b627-51098bf110b9",
          country_name: "Japan",
        },
        {
          id: "99920c38-0965-4d4f-ab3a-266a8358cadc",
          country_name: "Jersey",
        },
        {
          id: "f59668a4-d932-46a7-9241-138205d0be0f",
          country_name: "Jordan",
        },
        {
          id: "1b2ed14c-4f28-4fde-b4d9-47f779a16a35",
          country_name: "Kazakhstan",
        },
        {
          id: "12dfab64-0dac-40eb-8490-e4a467fe6ac5",
          country_name: "Kenya",
        },
        {
          id: "afdf26bf-b2f6-4080-9a3b-ac28fce680cf",
          country_name: "Kiribati",
        },
        {
          id: "6d08ba77-f672-4237-a40d-f09bfaaeefb9",
          country_name: "Korea (the Democratic People's Republic of)",
        },
        {
          id: "59eeb180-979b-4a65-bf59-983e1e66feb7",
          country_name: "Korea (the Republic of)",
        },
        {
          id: "c3d3fba3-3e2a-4138-a693-17d37be2bea8",
          country_name: "Kuwait",
        },
        {
          id: "4676149c-3d7d-4001-ab1f-8ba585407c0a",
          country_name: "Kyrgyzstan",
        },
        {
          id: "2f2f931e-5a7c-4579-b171-aa31996b7429",
          country_name: "Lao People's Democratic Republic (the)",
        },
        {
          id: "25bcc7af-de5e-4d05-a5d7-bb08dba0c1f7",
          country_name: "Latvia",
        },
        {
          id: "0923cc20-724e-4556-a888-73cddf840f64",
          country_name: "Lebanon",
        },
        {
          id: "a80159a4-32c5-4edf-b138-0473bed0c9b4",
          country_name: "Lesotho",
        },
        {
          id: "edde2011-2f67-4d1d-b687-c7d56518afd5",
          country_name: "Liberia",
        },
        {
          id: "d1994f88-202f-4930-896e-21facc94b6b1",
          country_name: "Libya",
        },
        {
          id: "3aee72a3-1fea-45d3-99cf-3e6f511d10e8",
          country_name: "Liechtenstein",
        },
        {
          id: "c7ca02fa-eb44-4fd4-8740-e13ff27c0e89",
          country_name: "Lithuania",
        },
        {
          id: "726def2a-6f29-42f6-a1ce-6806c5996600",
          country_name: "Luxembourg",
        },
        {
          id: "f37aa408-7e48-407c-8207-27326959f49d",
          country_name: "Macao",
        },
        {
          id: "df12049c-dd2d-44fe-9078-d1a6a066079d",
          country_name: "Madagascar",
        },
        {
          id: "200d65bb-9678-4485-8098-92b675f765c6",
          country_name: "Malawi",
        },
        {
          id: "dd481cf0-ecdb-447d-9523-d03d584f958c",
          country_name: "Malaysia",
        },
        {
          id: "eb62196a-f894-463a-afc8-5d76d86360ee",
          country_name: "Maldives",
        },
        {
          id: "8b35b3b8-aced-4f6a-99e7-028aceb7ea9d",
          country_name: "Mali",
        },
        {
          id: "fb3a50a2-1a1d-4994-a224-3e18616224dc",
          country_name: "Malta",
        },
        {
          id: "64b73521-0f82-4919-9288-93b4b88d1129",
          country_name: "Marshall Islands (the)",
        },
        {
          id: "5f32a590-e388-41ed-92bb-57146f6973b8",
          country_name: "Martinique",
        },
        {
          id: "70e55de0-2d29-4d0c-9f21-0cc05e9f959c",
          country_name: "Mauritania",
        },
        {
          id: "56c1734b-4d45-4e5e-9c70-414dc909c718",
          country_name: "Mauritius",
        },
        {
          id: "32db3f24-1ca7-4ac8-ba10-0ae6a88fc513",
          country_name: "Mayotte",
        },
        {
          id: "5d97eec2-d2ce-44df-ae0a-249e34ba2e6b",
          country_name: "Mexico",
        },
        {
          id: "e0ed8e9b-65af-40ae-8da8-be231c4d03ed",
          country_name: "Micronesia (Federated States of)",
        },
        {
          id: "54cefa1b-d5a1-4a9e-b8a9-c99b399eb258",
          country_name: "Moldova (the Republic of)",
        },
        {
          id: "ee3cd456-7add-4340-afaa-9b9db714058a",
          country_name: "Monaco",
        },
        {
          id: "67137171-8cc7-4301-8198-33c719b2f138",
          country_name: "Mongolia",
        },
        {
          id: "36332005-6bdd-4fe3-8c8e-9a240925ca23",
          country_name: "Montenegro",
        },
        {
          id: "ffc5fc89-5df4-40b4-86e7-d71e46e836c7",
          country_name: "Montserrat",
        },
        {
          id: "184c5b3a-0a39-4bbc-80f1-58ea761fbbef",
          country_name: "Morocco",
        },
        {
          id: "236cb1a0-a0c8-486f-a47d-9479501a00f5",
          country_name: "Mozambique",
        },
        {
          id: "4f302d80-616c-4409-9640-cfcd4bcd64ac",
          country_name: "Myanmar",
        },
        {
          id: "dd887baa-fa04-4669-aa32-22995b8b4ab3",
          country_name: "Namibia",
        },
        {
          id: "f46092b6-c5fb-49a5-bf4a-a648d58478c0",
          country_name: "Nauru",
        },
        {
          id: "80564419-e420-457a-9dbc-02106ab7a611",
          country_name: "Nepal",
        },
        {
          id: "e68fc8fd-41c9-4e9f-93c9-59a25ea3ff11",
          country_name: "Netherlands (the)",
        },
        {
          id: "4b989fad-ce28-4d04-9fd9-724d16ead79d",
          country_name: "New Caledonia",
        },
        {
          id: "96b746bd-f889-49f2-b04a-867af43dba08",
          country_name: "New Zealand",
        },
        {
          id: "d1c3989b-f11c-49cb-980b-61921465af83",
          country_name: "Nicaragua",
        },
        {
          id: "935cb86c-7e76-433f-9351-e31dce27b83b",
          country_name: "Nigeria",
        },
        {
          id: "75b9676e-6787-4d25-ba20-95b018e67a92",
          country_name: "Niger (the)",
        },
        {
          id: "e75da3fb-a2df-4a32-8188-9425e0114f37",
          country_name: "Niue",
        },
        {
          id: "8f652bf2-0ecd-4572-baeb-f38e190607e5",
          country_name: "Norfolk Island",
        },
        {
          id: "923f9a2d-9e72-4dea-b61a-bcb591d86b2e",
          country_name: "Northern Mariana Islands (the)",
        },
        {
          id: "95b68dd0-e361-4347-99e3-b6951a285e29",
          country_name: "Norway",
        },
        {
          id: "84f391c8-0d41-427b-be36-daec478c637a",
          country_name: "Oman",
        },
        {
          id: "b841af0c-faef-4af1-8069-31467e542d72",
          country_name: "Pakistan",
        },
        {
          id: "91f6be84-dd3e-4e3e-87d6-0a6bfe47dc5d",
          country_name: "Palau",
        },
        {
          id: "e0dda7a6-00f0-45dc-bc97-f40ae702d980",
          country_name: "Palestine, State of",
        },
        {
          id: "e923a69a-9bbc-481c-b27d-0c0f3008e630",
          country_name: "Panama",
        },
        {
          id: "7be33f4b-34c9-493a-8cfe-9cc9b9d05b84",
          country_name: "Papua New Guinea",
        },
        {
          id: "fe0ae380-e508-4de1-a473-9131aae507ed",
          country_name: "Paraguay",
        },
        {
          id: "f416256a-b296-4ed9-a2ab-88ad4374da33",
          country_name: "Peru",
        },
        {
          id: "ca13f03c-c4bb-4025-8dcb-2ae01c60f9e8",
          country_name: "Philippines (the)",
        },
        {
          id: "5fda2772-5a41-436a-b12f-6225e1d9f745",
          country_name: "Pitcairn",
        },
        {
          id: "aafd0e83-63ca-4ab1-997b-26513c511175",
          country_name: "Poland",
        },
        {
          id: "82f6c43f-7e11-4aeb-b5cb-e968ce763caf",
          country_name: "Portugal",
        },
        {
          id: "3ce226e7-51fc-4224-9eba-ed248450c3a7",
          country_name: "Puerto Rico",
        },
        {
          id: "b3c5a33f-27cb-4ed6-8576-d6b16bf99536",
          country_name: "Qatar",
        },
        {
          id: "31b8e851-4ae2-443a-91de-2b5d51c3fe42",
          country_name: "Republic of North Macedonia",
        },
        {
          id: "8a965404-c549-41bd-aa3d-a463abd56bea",
          country_name: "Réunion",
        },
        {
          id: "49df8ffc-f189-4883-b418-259988962551",
          country_name: "Romania",
        },
        {
          id: "5d0ffb09-4130-4335-8371-7b5ac46f3764",
          country_name: "Russian Federation (the)",
        },
        {
          id: "0032071b-9939-4546-901b-2a6b91003098",
          country_name: "Rwanda",
        },
        {
          id: "debc31f0-05bd-48a9-9f69-1c15b41d9d2d",
          country_name: "Saint Barthélemy",
        },
        {
          id: "aafc5b3f-2e09-4763-88f2-d1b2eec225d5",
          country_name: "Saint Helena, Ascension and Tristan da Cunha",
        },
        {
          id: "aeba3d4a-f16b-4c9a-8a59-d6b623d37c83",
          country_name: "Saint Kitts and Nevis",
        },
        {
          id: "8fa7cbde-6a7b-4a33-a9e4-959309329408",
          country_name: "Saint Lucia",
        },
        {
          id: "2d7deba4-f897-4351-b983-30a00af1568b",
          country_name: "Saint Martin (French part)",
        },
        {
          id: "5be6e775-87c0-4563-b2cc-6c7bd1826bb9",
          country_name: "Saint Pierre and Miquelon",
        },
        {
          id: "7d169411-5e37-41a3-8146-af65eb167b5a",
          country_name: "Saint Vincent and the Grenadines",
        },
        {
          id: "8af96a77-2705-4f22-9240-740b1344d29b",
          country_name: "Samoa",
        },
        {
          id: "aaca9bf9-2b04-45e1-808f-eae18e2c220e",
          country_name: "San Marino",
        },
        {
          id: "fc1925ac-d825-453b-9cbf-e5aba3c5aa32",
          country_name: "Sao Tome and Principe",
        },
        {
          id: "487d3083-637e-4a7a-8c4c-e22bcc3d634f",
          country_name: "Saudi Arabia",
        },
        {
          id: "e30b2ca3-3378-46b1-9da3-d5431ffdfdfa",
          country_name: "Senegal",
        },
        {
          id: "373b13e0-a48e-4c77-9d73-227f7aed434f",
          country_name: "Serbia",
        },
        {
          id: "f92e0cd0-6e17-482a-a329-a845b469b273",
          country_name: "Seychelles",
        },
        {
          id: "b21c434f-04b5-4b1e-9596-adc5e2574df6",
          country_name: "Sierra Leone",
        },
        {
          id: "bcb0658d-5910-47a5-aa54-b976ff32f5ef",
          country_name: "Singapore",
        },
        {
          id: "1aeba944-a8e5-4291-a116-47a9c1296692",
          country_name: "Sint Maarten (Dutch part)",
        },
        {
          id: "93833c5c-9441-4f39-bebe-fc744c7a2714",
          country_name: "Slovakia",
        },
        {
          id: "45768968-6929-4902-bd4d-9e1a8345dab6",
          country_name: "Slovenia",
        },
        {
          id: "3c5ef6e3-fc41-4fb1-9d31-8344c68c839e",
          country_name: "Solomon Islands",
        },
        {
          id: "10af6453-5a46-4186-8c61-4859668201c6",
          country_name: "Somalia",
        },
        {
          id: "6f6c5fda-c0df-4dc9-8831-109af22cabfa",
          country_name: "South Africa",
        },
        {
          id: "0ed55e6d-ef8c-44a8-a323-e8f50f879e35",
          country_name: "South Georgia and the South Sandwich Islands",
        },
        {
          id: "686f0da5-9ab5-4e5e-a59d-86862dbad78b",
          country_name: "South Sudan",
        },
        {
          id: "65be935a-802d-48d5-b1ca-4c8d7fa341a3",
          country_name: "Spain",
        },
        {
          id: "95a5d878-736d-4546-b24c-f5ac24b4aec3",
          country_name: "Sri Lanka",
        },
        {
          id: "b49c5548-58ab-47a5-bb51-ec6a91777da7",
          country_name: "Sudan (the)",
        },
        {
          id: "4c3bb5fe-a665-4036-be89-5d99ba0149f5",
          country_name: "Suriname",
        },
        {
          id: "b342bbda-1d87-4ef0-b10b-0e2260180124",
          country_name: "Svalbard and Jan Mayen",
        },
        {
          id: "dda013b0-fc0e-481d-8b46-1790b990947b",
          country_name: "Sweden",
        },
        {
          id: "7d69522d-c756-4842-8c32-e19fe39ec341",
          country_name: "Switzerland",
        },
        {
          id: "edb3599a-f87d-4ec9-a9af-cc397b5bb4ab",
          country_name: "Syrian Arab Republic",
        },
        {
          id: "42cf9876-f76f-4556-af6a-6677f855b369",
          country_name: "Taiwan",
        },
        {
          id: "8dac5907-3ada-42ac-81dd-a7309a4ea2e4",
          country_name: "Tajikistan",
        },
        {
          id: "f714a995-5f03-4503-89d8-18c9742bf5f5",
          country_name: "Tanzania, United Republic of",
        },
        {
          id: "6f2e92b2-a562-40bf-8a94-f7c300a730be",
          country_name: "Thailand",
        },
        {
          id: "43c70dbc-f3de-4e52-85d7-d43cc271a484",
          country_name: "Timor-Leste",
        },
        {
          id: "0147026a-07df-47d2-80aa-bd628c5202d5",
          country_name: "Togo",
        },
        {
          id: "f90633bb-709a-4ab1-a952-9a0af5a9c272",
          country_name: "Tokelau",
        },
        {
          id: "7a06d7df-2673-4f54-82e5-34a17df1a04f",
          country_name: "Tonga",
        },
        {
          id: "89e2fee4-5a05-4335-9d59-9e5ca1423577",
          country_name: "Trinidad and Tobago",
        },
        {
          id: "20759eeb-8218-4076-a355-31de83a2ef00",
          country_name: "Tunisia",
        },
        {
          id: "54a47b19-8ce1-4921-941c-c1ed552ae613",
          country_name: "Turkey",
        },
        {
          id: "32a07c20-4ecb-45f8-96b6-ccf4f5b13259",
          country_name: "Turkmenistan",
        },
        {
          id: "6ab28aac-7c06-4088-a7ec-5ef9c73ee101",
          country_name: "Turks and Caicos Islands (the)",
        },
        {
          id: "f1e3489e-4798-4196-8c1c-8fd91c1a5cd5",
          country_name: "Tuvalu",
        },
        {
          id: "0100b74b-e809-402a-88f5-f8668dc47d00",
          country_name: "Uganda",
        },
        {
          id: "58121b8c-e8e8-4142-b9ad-1c729ec13cf3",
          country_name: "Ukraine",
        },
        {
          id: "ed6867e9-8340-45cd-bc51-a4253f579246",
          country_name: "United Arab Emirates (the)",
        },
        {
          id: "5c1f7f22-3f28-4a61-b443-c9952d95919c",
          country_name:
            "United Kingdom of Great Britain and Northern Ireland (the)",
        },
        {
          id: "b9b0f235-c216-4fd0-a90a-4f70da608e68",
          country_name: "United States Minor Outlying Islands (the)",
        },
        {
          id: "658467dc-8fa3-49e6-a2cd-a6b880b3214b",
          country_name: "United States of America (the)",
        },
        {
          id: "c924f696-52d6-47d8-b229-4c75b1701c5c",
          country_name: "Uruguay",
        },
        {
          id: "7f499bcf-b67a-4753-9931-c088749d0482",
          country_name: "Uzbekistan",
        },
        {
          id: "d46a2dcc-6483-4dea-81da-add1eb721f6d",
          country_name: "Vanuatu",
        },
        {
          id: "ea41eea3-952d-4aec-a0a0-64433ae79d07",
          country_name: "Venezuela (Bolivarian Republic of)",
        },
        {
          id: "2dadd3f7-3569-40e8-92c1-d967b718d5cb",
          country_name: "Viet Nam",
        },
        {
          id: "fa426dd6-ed60-4294-b3ea-7499d80cdeed",
          country_name: "Virgin Islands (British)",
        },
        {
          id: "475f9edf-291e-4801-903f-44d84f6cca43",
          country_name: "Virgin Islands (U.S.)",
        },
        {
          id: "d32cae5e-62b0-48d7-99e8-3ca81c217d9d",
          country_name: "Wallis and Futuna",
        },
        {
          id: "16dea907-3f78-4fb3-a892-9cc4575f5bf6",
          country_name: "Western Sahara",
        },
        {
          id: "182018ce-fa56-4be3-9d98-770e568b5c01",
          country_name: "Yemen",
        },
        {
          id: "6f7e3169-246e-457a-b8c4-ec3386745108",
          country_name: "Zambia",
        },
        {
          id: "514848c0-0526-4f30-8ca1-b17994c00c88",
          country_name: "Zimbabwe",
        },
      ],
    },
    { status: 200 }
  );
}
