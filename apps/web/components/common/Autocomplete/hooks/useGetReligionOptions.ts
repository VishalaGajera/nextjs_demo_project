export function useGetReligionOption() {
  const religionOption = [
    { label: "Hinduism", value: "hinduism" },
    { label: "Islam", value: "islam" },
    { label: "Christianity", value: "christianity" },
    { label: "Sikhism", value: "sikhism" },
    { label: "Buddhism", value: "buddhism" },
    { label: "Jainism", value: "jainism" },
  ];

  return { religionOption };
}
