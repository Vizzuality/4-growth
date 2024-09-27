export type PageFilter = {
  name: string;
  isCustomFilter: boolean;
  values: string[];
  label: {
    selected: string;
    unSelected: string;
  };
};
