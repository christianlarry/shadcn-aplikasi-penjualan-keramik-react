import { cn } from "@/utils/ui";
import React from "react";
import type { TileCalculatorData } from "../types";
import { useTileCalculator } from "../hooks/use-tile-calculator";
import { isPolygonClosed } from "../utils/canvas-helpers";
import TileCalculatorControls from "./tile-calculator-controls";
// import TileCalculatorControlsSimple from "./tile-calculator-controls-simple";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import TileCalculatorResults from "./tile-calculator-results";

export interface TileCalculatorProps {
  tileWidth: number;
  tileHeight: number;
  onCalculate?: (data: TileCalculatorData) => void;
  tilePrice?: number;
  tilesPerBox: number;
}

const TileCalculatorCanvas: React.FC<TileCalculatorProps> = ({
  tileWidth,
  tileHeight,
  onCalculate,
  tilePrice = 0,
  tilesPerBox
}) => {
  const { refs, state, setter, handlers } = useTileCalculator({
    tileWidth,
    tileHeight,
    onCalculate,
    tilePrice
  })

  // Ref
  const { canvasRef, containerRef } = refs

  return (
    <div className="space-y-6">
      {/* Enhanced Control Panel */}
      <TileCalculatorControls setter={setter} handlers={handlers} state={state}/>

      {/* Error Display */}
      {state.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription>
            {state.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Canvas Container */}
      <div 
        className="relative bg-white rounded-lg shadow-lg overflow-hidden" 
        ref={containerRef}
        onMouseDown={(e)=>{
          if(e.button === 1){
            e.preventDefault()
          }
        }}
      >
        <canvas
          ref={canvasRef}
          className={cn("border-2 border-gray-300 cursor-crosshair w-full", state.isPanning && "cursor-grabbing")}
          onMouseDown={handlers.handleMouseDown}
          onMouseMove={handlers.handleMouseMove}
          onMouseUp={handlers.handleMouseUp}
          onWheel={handlers.handleWheel}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={handlers.handleKeyDown}
        />

        {/* Status Overlay */}
        {state.isDrawing && !isPolygonClosed(state.lines) && (
          <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-md">
            <p className="text-sm font-medium">
              {state.startPoint ? "Klik untuk titik berikutnya" : "Klik untuk memulai"}
            </p>
            {state.lines.length >= 2 && (
              <p className="text-xs mt-1">Klik dekat titik awal untuk menutup polygon</p>
            )}
          </div>
        )}

        {/* Scale Indicator */}
        <div className="absolute bottom-4 left-4 bg-white px-3 py-1 text-sm border border-border rounded-lg shadow-sm/20">
          Zoom : {(state.scale * 100).toFixed(0)}% <span className="text-muted-foreground/40">|</span> 1 kotak = 1 meter
        </div>

        {/* Controls */}
        {/* <div className="absolute top-4 left-[30%]">
          <TileCalculatorControlsSimple setter={setter} handlers={handlers} state={state}/>
        </div> */}
      </div>

      {/* Enhanced Results Panel */}
      {isPolygonClosed(state.lines) && (
        <TileCalculatorResults
          state={state}
          tileHeight={tileHeight}
          tileWidth={tileWidth}
          tilePrice={tilePrice}
          tilesPerBox={tilesPerBox}
        />
      )}
    </div>
  );
};

export default TileCalculatorCanvas;