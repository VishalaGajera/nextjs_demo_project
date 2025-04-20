import type {
  IDoesFilterPassParams,
  IFilterComp,
  IFilterParams,
} from "ag-grid-community";

type FilterOption = {
  value: string;
  label: string;
  filterFunction?: (value: string) => boolean;
};

type CustomEnumFilterParams = {
  filterOptions: FilterOption[];
} & IFilterParams;

export type CustomEnumFilterModel = {
  filterType: string;
  filter: string;
  type: string;
};

export class CustomEnumFilter implements IFilterComp {
  filterParams!: CustomEnumFilterParams;
  filterType!: string;
  filter: string;
  type: string;
  gui!: HTMLDivElement;
  filterOptions: FilterOption[];
  eFilterType!: HTMLSelectElement;

  defaultFilterOptions: FilterOption[] = [
    {
      value: "all",
      label: "All",
      filterFunction: () => true,
    },
    {
      value: "cash",
      label: "Cash",
      filterFunction: (value) => value.length > 0,
    },
    {
      value: "cheque",
      label: "Cheque",
      filterFunction: (value) => value.length === 0,
    },
  ];

  constructor() {
    this.filterOptions = this.defaultFilterOptions;
    this.filter = "";
    this.type = "equals";
  }

  init(params: CustomEnumFilterParams) {
    this.filterParams = params;

    if (params.filterOptions && params.filterOptions.length > 0) {
      this.filterOptions = [
        {
          value: "all",
          label: "All",
          filterFunction: () => true,
        },
        ...params.filterOptions,
      ];
    }
    this.filterType = "text";
    this.filter = this.filterOptions[0]?.value ?? "";
    this.setupGui();
    this.setupListeners(params);
  }

  setupGui() {
    this.gui = document.createElement("div");

    this.gui.innerHTML = `
            <div class="ag-filter-body-wrapper ag-simple-filter-body-wrapper">
                <div class=ag-picker-field ag-labeled ag-label-align-left ag-select ag-filter-select">
                    <select id="filterType" class="ag-wrapper ag-picker-field-wrapper ag-picker-collapsed">
                        ${this.filterOptions
                          .map(
                            (option) =>
                              `<option class="ag-picker-field-display" value="${option.value}">${option.label}</option>`
                          )
                          .join("")}
                    
                    </select>
                </div>
            </div>
        `;

    this.eFilterType = this.gui.querySelector(
      "#filterType"
    ) as HTMLSelectElement;
  }

  setupListeners(params: CustomEnumFilterParams) {
    this.eFilterType.addEventListener("change", (event: Event) => {
      const select = event.target as HTMLSelectElement;

      this.filter = select.value;
      params.filterChangedCallback();
    });
  }

  getGui() {
    return this.gui;
  }

  doesFilterPass(params: IDoesFilterPassParams) {
    const { node } = params;

    const value = this.filterParams.getValue(node).toString();

    const selectedOption = this.filterOptions.find(
      (opt) => opt.value === this.filterType
    );

    if (selectedOption?.filterFunction) {
      return selectedOption.filterFunction(value);
    }

    return true;
  }

  isFilterActive() {
    return this.filter !== (this.filterOptions[0]?.value ?? "");
  }

  getModel(): CustomEnumFilterModel | null {
    if (this.filter === "all") {
      return null;
    }

    return {
      filterType: this.filterType,
      filter: this.filter,
      type: this.type,
    };
  }

  setModel(model: CustomEnumFilterModel | null) {
    if (model) {
      this.filterType = model.filterType;
      this.eFilterType.value = model.filterType;
    } else {
      this.filter = this.filterOptions[0]?.value ?? "";
      this.eFilterType.value = this.filterOptions[0]?.value ?? "";
    }
  }
}
