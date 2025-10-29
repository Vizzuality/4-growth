import { ChangeEvent, useState, useMemo } from "react";

import Fuse from "fuse.js";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SearchableListProps<T> {
  /**
   * An array of items.
   * Each item is of type T, which should be an object.
   */
  items: T[];
  /**
   * The key of T that should be used for displaying and searching.
   * This must be a key of T that has a string value.
   * For example, if T is { id: number, name: string }, itemKey could be 'name'.
   */
  itemKey: keyof T & string;
  maxHeight?: number;
  /**
   * Callback function that is called when an item is clicked.
   * @param value The full item object that was clicked.
   */
  onItemClick: (value: T) => void;
}

function SearchableList<T>({
  items,
  maxHeight,
  itemKey,
  onItemClick,
}: SearchableListProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fuse = useMemo(() => {
    const options = {
      keys: [itemKey],
      threshold: 0.3,
    };
    return new Fuse(items, options);
  }, [items, itemKey]);

  const filteredItems = useMemo(() => {
    if (searchTerm.length === 0) return items;

    return fuse.search(searchTerm).map((result) => result.item);
  }, [fuse, items, searchTerm]);

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="relative">
        <Input
          type="search"
          variant="secondary"
          className="bg-foreground px-4 pb-2 pr-10 pt-4"
          onChange={handleOnInputChange}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 transform">
          <SearchIcon size={18} className="text-popover-foreground" />
        </div>
      </div>
      <Separator className="bg-bluish-gray-500 bg-opacity-35" />
      <ScrollArea className="bg-slate-100" maxHeight={maxHeight}>
        {filteredItems.map((item, index) => (
          <div key={`searchable-list-item-${index}`}>
            <Button
              variant="clean"
              className="h-10 w-full cursor-pointer justify-start rounded-none px-3 py-4 text-xs font-medium transition-colors hover:bg-slate-200"
              onClick={() => onItemClick(item)}
            >
              {item[itemKey] as string}
            </Button>
          </div>
        ))}
      </ScrollArea>
    </>
  );
}

export default SearchableList;
