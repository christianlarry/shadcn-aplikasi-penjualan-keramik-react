import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Redo,
  Undo,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Ruler,
  Magnet,
  Trash2,
  Frame,
  Save,
  FolderOpen
} from "lucide-react";
import { MAX_ZOOM, MIN_ZOOM } from "../utils/canvas-helpers";
import type { useTileCalculator } from "../hooks/use-tile-calculator";
import { useRef } from "react";

// Tipe props yang lebih bersih, mengambil langsung dari return type hook
type TileCalculatorControlsProps = Pick<ReturnType<typeof useTileCalculator>, 'state' | 'setter' | 'handlers'>;

const TileCalculatorControls = ({ state, setter, handlers }: TileCalculatorControlsProps) => {
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center w-fit gap-2 flex-wrap p-1 bg-background shadow-sm/10 rounded-2xl border border-border">
        {/* Undo / Redo / Reset */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handlers.handleUndo} disabled={state.undoStack.length === 0} variant="ghost" size="icon">
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Undo (Ctrl+Z)</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handlers.handleRedo} disabled={state.redoStack.length === 0} variant="ghost" size="icon">
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Redo (Ctrl+Y)</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handlers.handleReset} disabled={state.lines.length === 0} variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Reset Canvas (Esc)</p></TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/* Toggles */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setter.setShowGrid(!state.showGrid)} variant={state.showGrid ? "secondary" : "ghost"} size="icon">
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{state.showGrid ? "Sembunyikan" : "Tampilkan"} Grid</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setter.setShowMeasurements(!state.showMeasurements)} variant={state.showMeasurements ? "secondary" : "ghost"} size="icon">
              <Ruler className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{state.showMeasurements ? "Sembunyikan" : "Tampilkan"} Ukuran</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setter.setIsSnapping(!state.isSnapping)} variant={state.isSnapping ? "secondary" : "ghost"} size="icon">
              <Magnet className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Snap to Grid: {state.isSnapping ? "On" : "Off"}</p></TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/* Zoom Controls */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setter.setScale(prev => Math.min(MAX_ZOOM, prev * 1.2))} disabled={state.scale >= MAX_ZOOM} variant="ghost" size="icon">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Zoom In</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setter.setScale(prev => Math.max(MIN_ZOOM, prev / 1.2))} disabled={state.scale <= MIN_ZOOM} variant="ghost" size="icon">
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Zoom Out</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => { setter.setScale(1); setter.setPanOffset({ x: 0, y: 0 }); }} variant="ghost" size="icon">
              <Frame className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Reset Tampilan</p></TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/* Save / Load */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handlers.handleSaveJSON} disabled={state.lines.length === 0 || state.isSaving} variant="ghost" size="icon">
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Simpan ke File JSON</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button onClick={() => jsonFileInputRef.current?.click()} variant="ghost" size="icon">
                <FolderOpen className="h-4 w-4" />
              </Button>
              <input ref={jsonFileInputRef} type="file" onChange={handlers.handleFileInputChange} className="hidden" accept=".json" />
            </div>
          </TooltipTrigger>
          <TooltipContent><p>Buka dari File JSON</p></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default TileCalculatorControls;