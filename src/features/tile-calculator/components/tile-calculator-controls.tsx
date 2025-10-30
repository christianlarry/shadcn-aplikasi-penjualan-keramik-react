import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Redo, Save, Undo, ZoomIn, ZoomOut } from "lucide-react";
import { MAX_ZOOM, MIN_ZOOM } from "../utils/canvas-helpers";
import type { useTileCalculator } from "../hooks/use-tile-calculator";
import { useRef } from "react";

interface TileCalculatorControlsProps extends Omit<ReturnType<typeof useTileCalculator>, 'refs'> {
  state: ReturnType<typeof useTileCalculator>["state"];
}

const TileCalculatorControls = ({
  state,setter,handlers
}:TileCalculatorControlsProps) => {

  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/50 rounded-lg">
      {/* Zoom Controls */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700">Zoom & Pan</h4>
        <div className="flex space-x-1">

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setter.setScale(prev => Math.min(MAX_ZOOM, prev * 1.2))}
                disabled={state.scale >= MAX_ZOOM}
                size={'icon'}
                variant={"outline"}
              >
                <ZoomIn />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setter.setScale(prev => Math.max(MIN_ZOOM, prev / 1.2))}
                disabled={state.scale <= MIN_ZOOM}
                size={'icon'}
                variant={"outline"}
              >
                <ZoomOut />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"outline"}
                onClick={() => { setter.setScale(1); setter.setPanOffset({ x: 0, y: 0 }); }}
              >
                Reset View
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset Tampilan zoom dan pan</p>
            </TooltipContent>
          </Tooltip>


        </div>
        <p className="text-xs text-gray-500">Ctrl+Scroll untuk zoom<br />Ctrl+Click untuk pan</p>
      </div>

      {/* Display Controls */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700">Tampilan</h4>
        <div className="space-y-1">
          <label className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={state.showGrid}
              onCheckedChange={(val) => setter.setShowGrid((val as boolean))}
              className="rounded"
            />
            <span>Tampilkan Grid</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={state.showMeasurements}
              onCheckedChange={(val) => setter.setShowMeasurements((val as boolean))}
              className="rounded"
            />
            <span>Tampilkan Ukuran</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={state.isSnapping}
              onCheckedChange={(val) => setter.setIsSnapping((val as boolean))}
              className="rounded"
            />
            <span>Snap to Grid</span>
          </label>
        </div>
      </div>

      {/* Action Controls */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700">Actions</h4>
        <div className="flex space-x-1">

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handlers.handleUndo}
                disabled={state.undoStack.length === 0}
                variant={"outline"}
                size={"icon"}
              >
                <Undo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handlers.handleRedo}
                disabled={state.redoStack.length === 0}
                variant={"outline"}
                size={"icon"}
              >
                <Redo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handlers.handleReset}
                disabled={state.lines.length === 0}
                variant={"destructive"}
              >
                Reset
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset Garis</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Save Action */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700">Simpan/Buka JSON</h4>
        <div className="flex space-x-1">

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handlers.handleSaveJSON}
                disabled={state.lines.length === 0 || state.isSaving}
                variant={"outline"}
              >
                <Save />Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save JSON</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={() => jsonFileInputRef.current?.click()}
                  variant={"outline"}
                >
                  Open
                </Button>

                <input
                  ref={jsonFileInputRef}
                  type="file"
                  onChange={handlers.handleFileInputChange}
                  className="hidden"
                  accept=".json"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open JSON</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default TileCalculatorControls