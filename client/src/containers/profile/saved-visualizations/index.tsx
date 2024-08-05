import { FC } from "react";

import { Card, CardTitle } from "@/components/ui/card";

import SavedVisualizationsTable from "./table";

const SavedVisualizations: FC = () => {
  return (
    <Card className="space-y-6 px-0">
      <CardTitle className="pl-8">Saved visualizations</CardTitle>
      <SavedVisualizationsTable />
    </Card>
  );
};

export default SavedVisualizations;
