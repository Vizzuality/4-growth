type DefaultFilterLabels = { selected: string; unselected: string };

export type PageFilter = {
  name: string;
  isCustomFilter: boolean;
  values: string[];
  label: DefaultFilterLabels | string;
};
