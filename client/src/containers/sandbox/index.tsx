import { Card } from "@/components/ui/card";
import Title from "@/components/ui/title";

const mockData = {
  id: 5,
  question:
    "What is the size of your agriculture or forestry organisation in terms of workforce?",
  indicator: "Organisation size",
  sectionOrder: 1,
  visualisations: ["horizontal_bar_chart", "pie_chart", "area_graph"],
  defaultVisualization: "horizontal_bar_chart",
  updatedAt: "2024-10-15T06:48:36.937Z",
  createdAt: "2024-09-27T15:20:16.765Z",
  data: [],
};

export default async function Sandbox() {
  const { indicator, question } = mockData;
  return (
    <Card className="p-6">
      <header className="space-y-2">
        <Title as="h2" className="text-base font-normal">
          {indicator}
        </Title>
        <p className="text-xs text-muted-foreground">{question}</p>
      </header>
    </Card>
  );
}
