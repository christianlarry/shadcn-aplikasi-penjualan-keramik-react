import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/ui";
import { Redo, Save, Undo, ZoomIn, ZoomOut } from "lucide-react";
import React from "react";
import type { TileCalculatorData } from "../types";
import { useTileCalculator } from "../hooks/use-tile-calculator";
import { isPolygonClosed, MAX_ZOOM, MIN_ZOOM, WASTE_FACTOR } from "../utils/canvas-helpers";

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
  const {refs,state,setter,handlers} = useTileCalculator({
    tileWidth,
    tileHeight,
    onCalculate,
    tilePrice
  })

  // Ref
  const {canvasRef,containerRef,jsonFileInputRef} = refs

  // Calculate final results
  const tileAreaM2 = (tileWidth * tileHeight) / 10000;
  const baseTiles = Math.ceil(state.area / tileAreaM2);
  const additionalTiles = Math.ceil(baseTiles * WASTE_FACTOR);
  const totalTiles = baseTiles + additionalTiles;
  const totalBox = Math.ceil(totalTiles / tilesPerBox);
  const costEstimate = tilePrice > 0 ? totalBox * tilePrice : 0;

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      {/* Enhanced Control Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                  <ZoomIn/>
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
                  <ZoomOut/>
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
          <p className="text-xs text-gray-500">Ctrl+Scroll untuk zoom<br/>Ctrl+Click untuk pan</p>
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
                  <Undo/>
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
                  <Redo/>
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
                  <Save/>Save
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
                    onClick={()=>jsonFileInputRef.current?.click()}
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

      {/* Error Display */}
      {state.error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{state.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className={cn("border-2 border-gray-300 cursor-crosshair w-full",state.isPanning && "cursor-grabbing")}
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
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded text-sm">
          Zoom: {(state.scale * 100).toFixed(0)}% | 1 kotak = 1 meter
        </div>
      </div>

      {/* Enhanced Results Panel */}
      {isPolygonClosed(state.lines) && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-bold text-xl text-green-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hasil Perhitungan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-700">Luas Ruangan</h4>
              <p className="text-2xl font-bold text-blue-600">{state.area.toFixed(2)} m²</p>
              {/* <p className="text-sm text-gray-500">Keliling: {perimeter.toFixed(2)} m</p> */}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-700">Ukuran Keramik</h4>
              <p className="text-lg font-bold text-purple-600">{tileWidth} × {tileHeight} cm</p>
              <p className="text-sm text-gray-500">({tileAreaM2.toFixed(4)} m² per keping)</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-700">Kebutuhan Keramik</h4>
              <p className="text-2xl font-bold text-green-600">{totalTiles} keping | {totalBox} box</p>
              <p className="text-sm text-gray-500">
                Dasar: {baseTiles} + Cadangan: {additionalTiles}
              </p>
              <p className="text-sm text-gray-500">
                @ Isi per box {tilesPerBox}pcs
              </p>
            </div>
            
            {tilePrice > 0 && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-700">Estimasi Biaya</h4>
                <p className="text-2xl font-bold text-red-600">
                  Rp {costEstimate.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-500">
                  @ Rp {tilePrice.toLocaleString('id-ID')} per box
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
            <h5 className="font-semibold text-yellow-800 mb-2">Catatan:</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Perhitungan sudah termasuk 10% cadangan untuk antisipasi kerusakan</li>
              <li>• Pastikan ukuran keramik sesuai dengan yang akan dibeli</li>
              <li>• Pertimbangkan faktor seperti motif dan arah pemasangan</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TileCalculatorCanvas;