import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { ArrowDown, ArrowUp, ListFilter } from "lucide-react";
import { cn } from "@/utils/ui";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevansi" },
  { value: "price", label: "Harga" },
  { value: "name", label: "Nama" }
];

interface SortPopoverProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
}

export const SortPopover: React.FC<SortPopoverProps> = ({ value, onValueChange }) => {
  const [sortType, setSortType] = React.useState<string>("relevance");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      const [type, order] = value.split("_") as [string, "asc" | "desc" | undefined];
      setSortType(type);
      if (order) {
        setSortOrder(order);
      }
    } else {
      setSortType("relevance");
    }
  }, [value]);

  const handleSortTypeChange = (newType: string) => {
    setSortType(newType);
    if (newType === "relevance") {
      onValueChange(null);
      setIsOpen(false);
    } else {
      onValueChange(`${newType}_${sortOrder}`);
    }
  };

  const handleSortOrderChange = (newOrder: "asc" | "desc") => {
    if (newOrder) {
      setSortOrder(newOrder);
      onValueChange(`${sortType}_${newOrder}`);
    }
  };

  const handleClear = () => {
    onValueChange(null);
    setIsOpen(false);
  };

  const displayLabel = React.useMemo(() => {
    if (!value) return "Urutkan";
    if (value === "price_asc") return "Harga: Terendah";
    if (value === "price_desc") return "Harga: Tertinggi";
    if (value === "name_asc") return "Nama: A-Z";
    if (value === "name_desc") return "Nama: Z-A";
    return "Urutkan";
  }, [value]);

  const showOrderControl = sortType === "price" || sortType === "name";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start">
          <ListFilter className="mr-2" />
          {displayLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="end">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Urutkan Berdasarkan</h4>
            <Button
              variant="link"
              size="sm"
              onClick={handleClear}
              className={cn("text-muted-foreground h-auto p-0 cursor-pointer font-normal", !value && "invisible")}
            >
              Reset
            </Button>
          </div>
          
          <RadioGroup value={sortType} onValueChange={handleSortTypeChange}>
            {SORT_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center justify-between">
                <Label htmlFor={`sort-${option.value}`} className="font-normal cursor-pointer flex-1 py-1.5">
                  {option.label}
                </Label>
                <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
              </div>
            ))}
          </RadioGroup>

          {showOrderControl && (
            <>
              <hr className="-mx-4" />
              <div className="grid gap-2 pt-2">
                <Label>Arah</Label>
                <ToggleGroup
                  type="single"
                  value={sortOrder}
                  onValueChange={(val: "asc" | "desc") => handleSortOrderChange(val)}
                  className="grid grid-cols-2"
                >
                  <ToggleGroupItem value="asc" aria-label="Naik">
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Naik
                  </ToggleGroupItem>
                  <ToggleGroupItem value="desc" aria-label="Turun">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Turun
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};