import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectionsSettingsSelectorProps<T> {
  options: { label: string; value: T }[];
  onItemClick: (value: T) => void;
}

const ProjectionsSettingsSelector = <T,>({
  options,
  onItemClick,
}: ProjectionsSettingsSelectorProps<T>) => {
  return (
    <ScrollArea className="bg-slate-100" maxHeight={220}>
      {options.map(({ label, value }) => (
        <div key={`projections-settings-selector-${String(value)}`}>
          <Button
            variant="clean"
            className="h-10 w-full cursor-pointer justify-start rounded-none px-3 py-4 text-xs font-medium transition-colors hover:bg-slate-200"
            onClick={() => onItemClick(value)}
          >
            {label}
          </Button>
        </div>
      ))}
    </ScrollArea>
  );
};

export default ProjectionsSettingsSelector;
