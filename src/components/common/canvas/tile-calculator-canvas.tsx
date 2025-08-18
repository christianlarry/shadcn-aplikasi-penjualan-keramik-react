import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Redo, Save, Undo, ZoomIn, ZoomOut } from "lucide-react";
import React, { useRef, useState, useEffect, useCallback } from "react";

interface Point {
  x: number;
  y: number;
}

interface Line {
  start: Point;
  end: Point;
  length: number;
  id: string;
}

interface RoomCanvasProps {
  tileWidth: number;
  tileHeight: number;
  onCalculate?: (data: {
    area: number;
    totalTiles: number;
    perimeter: number;
    additionalTiles: number;
    costEstimate?: number;
  }) => void;
  tilePrice?: number;
}

// Configuration constants
const GRID_SIZE = 50; // 1 grid = 1 meter (50px per meter for better visibility)
const WASTE_FACTOR = 0.1; // 10% waste factor
const MIN_LINE_LENGTH = 0.1; // Minimum line length in meters
const SNAP_THRESHOLD = 25; // Snap threshold in pixels
const MAX_ZOOM = 3;
const MIN_ZOOM = 0.3;

const TileCalculatorCanvas: React.FC<RoomCanvasProps> = ({
  tileWidth,
  tileHeight,
  onCalculate,
  tilePrice = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Core drawing state
  const [lines, setLines] = useState<Line[]>([]);
  const [undoStack, setUndoStack] = useState<Line[][]>([]);
  const [redoStack, setRedoStack] = useState<Line[][]>([]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [mousePos, setMousePos] = useState<Point | null>(null);
  
  // Calculation results
  const [area, setArea] = useState<number>(0);
  const [perimeter, setPerimeter] = useState<number>(0);
  
  // UI state
  const [isSnapping, setIsSnapping] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  // Pan and zoom state
  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);

  // Save/Load state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Check if polygon is closed
  const isPolygonClosed = useCallback(() => {
    if (lines.length < 3) return false;
    const first = lines[0].start;
    const last = lines[lines.length - 1].end;
    const distance = Math.sqrt(
      Math.pow(first.x - last.x, 2) + Math.pow(first.y - last.y, 2)
    );
    return distance < SNAP_THRESHOLD;
  }, [lines]);

  // Enhanced drawing function with better performance
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    
    // Clear and set up transforms
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(scale, scale);

    // Draw grid with adaptive density
    if (showGrid) {
      const gridSpacing = GRID_SIZE;
      const startX = Math.floor(-panOffset.x / scale / gridSpacing) * gridSpacing;
      const startY = Math.floor(-panOffset.y / scale / gridSpacing) * gridSpacing;
      const endX = startX + Math.ceil(width / scale) + gridSpacing;
      const endY = startY + Math.ceil(height / scale) + gridSpacing;

      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = startX; x <= endX; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = startY; y <= endY; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }

      // Draw origin marker
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw existing lines with enhanced styling
    lines.forEach((line, index) => {
      // Line
      ctx.strokeStyle = isPolygonClosed() ? "#10b981" : "#3b82f6";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();

      // Enhanced endpoints
      const pointColor = isPolygonClosed() ? "#059669" : "#2563eb";
      ctx.fillStyle = pointColor;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      
      // Start point
      ctx.beginPath();
      ctx.arc(line.start.x, line.start.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // End point
      ctx.beginPath();
      ctx.arc(line.end.x, line.end.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Enhanced measurements
      if (showMeasurements) {
        const midX = (line.start.x + line.end.x) / 2;
        const midY = (line.start.y + line.end.y) / 2;
        
        // Background for text
        const text = `${line.length.toFixed(2)}m`;
        ctx.font = "bold 14px system-ui";
        const textMetrics = ctx.measureText(text);
        const padding = 4;
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(
          midX - textMetrics.width / 2 - padding,
          midY - 10 - padding,
          textMetrics.width + padding * 2,
          20 + padding * 2
        );
        
        ctx.fillStyle = pointColor;
        ctx.textAlign = "center";
        ctx.fillText(text, midX, midY + 3);
      }

      // Line number
      if (lines.length > 1) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.font = "10px system-ui";
        ctx.textAlign = "center";
        ctx.fillText((index + 1).toString(), line.start.x, line.start.y - 12);
      }
    });

    // Enhanced preview line
    if (startPoint && mousePos && !isPolygonClosed()) {
      const previewLength = Math.sqrt(
        Math.pow(mousePos.x - startPoint.x, 2) +
        Math.pow(mousePos.y - startPoint.y, 2)
      ) / GRID_SIZE;

      if (previewLength >= MIN_LINE_LENGTH) {
        ctx.strokeStyle = "rgba(59, 130, 246, 0.6)";
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);
        
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        
        ctx.setLineDash([]);

        // Preview measurement
        if (showMeasurements) {
          const midX = (startPoint.x + mousePos.x) / 2;
          const midY = (startPoint.y + mousePos.y) / 2;
          
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.strokeStyle = "rgba(59, 130, 246, 0.6)";
          ctx.lineWidth = 1;
          
          const text = `${previewLength.toFixed(2)}m`;
          const textMetrics = ctx.measureText(text);
          const padding = 3;
          
          ctx.fillRect(
            midX - textMetrics.width / 2 - padding,
            midY - 8 - padding,
            textMetrics.width + padding * 2,
            16 + padding * 2
          );
          ctx.strokeRect(
            midX - textMetrics.width / 2 - padding,
            midY - 8 - padding,
            textMetrics.width + padding * 2,
            16 + padding * 2
          );
          
          ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
          ctx.font = "12px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(text, midX, midY + 2);
        }
      }
    }

    // Polygon fill when closed
    if (isPolygonClosed() && lines.length >= 3) {
      ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
      ctx.beginPath();
      ctx.moveTo(lines[0].start.x, lines[0].start.y);
      lines.forEach(line => ctx.lineTo(line.end.x, line.end.y));
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }, [lines, mousePos, startPoint, showGrid, showMeasurements, scale, panOffset, isPolygonClosed]);

  // Canvas setup and drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Responsive canvas sizing
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = Math.max(600, rect.height);
        
        // Enable high DPI support
        const dpr = window.devicePixelRatio || 1;
        canvas.width *= dpr;
        canvas.height *= dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = Math.max(600, rect.height) + 'px';
        
        draw(ctx);
      }
    }
  }, [draw]);

  // Enhanced area calculation with better precision
  const calculateArea = useCallback((points: Point[]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    const n = points.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    
    return Math.abs(area / 2) / (GRID_SIZE * GRID_SIZE);
  }, []);

  const calculatePerimeter = useCallback((lines: Line[]): number => {
    return lines.reduce((sum, line) => sum + line.length, 0);
  }, []);

  // Enhanced intersection detection
  const checkIntersection = useCallback((line1: Line, line2: Line): boolean => {
    // Skip if lines share a point (connected lines)
    if (
      (line1.start.x === line2.start.x && line1.start.y === line2.start.y) ||
      (line1.start.x === line2.end.x && line1.start.y === line2.end.y) ||
      (line1.end.x === line2.start.x && line1.end.y === line2.start.y) ||
      (line1.end.x === line2.end.x && line1.end.y === line2.end.y)
    ) {
      return false;
    }

    const { start: p1, end: p2 } = line1;
    const { start: p3, end: p4 } = line2;

    const denominator = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (Math.abs(denominator) < 1e-10) return false;

    const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denominator;
    const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denominator;

    return t > 0.01 && t < 0.99 && u > 0.01 && u < 0.99;
  }, []);

  // Enhanced coordinate conversion
  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x = (e.clientX - rect.left - panOffset.x) / scale;
    let y = (e.clientY - rect.top - panOffset.y) / scale;

    if (isSnapping) {
      x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      y = Math.round(y / GRID_SIZE) * GRID_SIZE;
    }

    return { x, y };
  }, [scale, panOffset, isSnapping]);

  // Enhanced mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      // Middle mouse or Ctrl+Click for panning
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (e.button !== 0 || isPolygonClosed()) return;

    const coords = getCanvasCoordinates(e);
    
    if (!startPoint) {
      setStartPoint(coords);
      setIsDrawing(true);
      setError("");
    } else {
      const previewLength = Math.sqrt(
        Math.pow(coords.x - startPoint.x, 2) + 
        Math.pow(coords.y - startPoint.y, 2)
      ) / GRID_SIZE;

      if (previewLength < MIN_LINE_LENGTH) {
        setError(`Garis terlalu pendek! Minimum ${MIN_LINE_LENGTH}m`);
        return;
      }

      const newLine: Line = {
        id: Math.random().toString(36).substr(2, 9),
        start: startPoint,
        end: coords,
        length: previewLength,
      };

      // Check intersections with existing lines (except adjacent ones)
      const hasIntersection = lines.some((line, index) => {
        if (index === lines.length - 1) return false; // Skip last line (adjacent)
        return checkIntersection(newLine, line);
      });

      if (hasIntersection) {
        setError("Garis tidak boleh berpotongan dengan garis lain!");
        return;
      }

      const newLines = [...lines, newLine];
      setUndoStack([...undoStack, lines]);
      setRedoStack([]);
      setLines(newLines);
      setError("");

      // Check if polygon can be closed
      const first = newLines[0].start;
      const last = coords;
      const distanceToStart = Math.sqrt(
        Math.pow(first.x - last.x, 2) + Math.pow(first.y - last.y, 2)
      );

      if (newLines.length >= 3 && distanceToStart < SNAP_THRESHOLD) {
        // Close polygon
        const polygonPoints = newLines.map(line => line.start);
        const calculatedArea = calculateArea(polygonPoints);
        const calculatedPerimeter = calculatePerimeter(newLines);
        
        setArea(calculatedArea);
        setPerimeter(calculatedPerimeter);
        setStartPoint(null);
        setMousePos(null);
        setIsDrawing(false);

        // Calculate tiles needed
        const tileAreaM2 = (tileWidth * tileHeight) / 10000; // Convert cm² to m²
        const baseTiles = Math.ceil(calculatedArea / tileAreaM2);
        const additionalTiles = Math.ceil(baseTiles * WASTE_FACTOR);
        const totalTiles = baseTiles + additionalTiles;

        onCalculate?.({
          area: calculatedArea,
          perimeter: calculatedPerimeter,
          totalTiles,
          additionalTiles,
          costEstimate: tilePrice > 0 ? totalTiles * tilePrice : undefined
        });
      } else {
        setStartPoint(coords);
      }
    }
  }, [startPoint, lines, undoStack, checkIntersection, calculateArea, calculatePerimeter, getCanvasCoordinates, onCalculate, isPolygonClosed, tileWidth, tileHeight, tilePrice]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning && lastPanPoint) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!startPoint || isPolygonClosed()) return;

    const coords = getCanvasCoordinates(e);
    setMousePos(coords);
  }, [startPoint, isPanning, lastPanPoint, getCanvasCoordinates, isPolygonClosed]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
  }, []);

  // Zoom handlers
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    // Jika tombol ctrl ditahan
    if( e.ctrlKey || e.metaKey) {
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
  
      setScale(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * delta)));
    }
  }, []);

  // Prevent default wheel behavior on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const preventScroll = (e: WheelEvent) => {
        e.preventDefault();
      };
      
      canvas.addEventListener('wheel', preventScroll, { passive: false });
      return () => {
        canvas.removeEventListener('wheel', preventScroll);
      };
    }
  }, []);

  // Enhanced utility functions
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const prevLines = undoStack[undoStack.length - 1];
    setRedoStack([lines, ...redoStack]);
    setLines(prevLines);
    setUndoStack(undoStack.slice(0, -1));
    setArea(0);
    setPerimeter(0);
    setError("");
    setStartPoint(prevLines.length > 0 ? prevLines[prevLines.length - 1].end : null);
  }, [undoStack, lines, redoStack]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const nextLines = redoStack[0];
    setUndoStack([...undoStack, lines]);
    setLines(nextLines);
    setRedoStack(redoStack.slice(1));
    setStartPoint(nextLines.length > 0 ? nextLines[nextLines.length - 1].end : null);
  }, [redoStack, undoStack, lines]);

  const handleReset = useCallback(() => {
    setLines([]);
    setUndoStack([]);
    setRedoStack([]);
    setStartPoint(null);
    setMousePos(null);
    setArea(0);
    setPerimeter(0);
    setError("");
    setIsDrawing(false);
    setPanOffset({ x: 0, y: 0 });
    setScale(1);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLCanvasElement>) => {
    console.log("Key pressed:", e.key);
    if (e.key === "Escape") {
      handleReset();
    } else if (e.key === "z" && e.ctrlKey) {
      handleUndo();
    } else if (e.key === "y" && e.ctrlKey) {
      handleRedo();
    }
  },[handleRedo, handleUndo, handleReset]);

  

  // JSON Save/Load Functions
  const handleSaveJSON = useCallback(() => {
    try {
      setIsSaving(true);
      
      const canvasData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        lines: lines,
        area: area,
        perimeter: perimeter,
        settings: {
          isSnapping,
          showGrid,
          showMeasurements,
          scale,
          panOffset
        },
        tileInfo: {
          tileWidth,
          tileHeight,
          tilePrice
        },
        metadata: {
          totalLines: lines.length,
          isPolygonClosed: isPolygonClosed()
        }
      };

      const jsonString = JSON.stringify(canvasData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `tile-calculator-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // setSaveSuccess(true);
      // setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving JSON:', error);
      setError('Gagal menyimpan file JSON!');
    } finally {
      setIsSaving(false);
    }
  }, [lines, area, perimeter, isSnapping, showGrid, showMeasurements, scale, panOffset, tileWidth, tileHeight, tilePrice, isPolygonClosed]);

  const handleLoadJSON = useCallback((file: File) => {
    // setIsLoading(true);
    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonContent = e.target?.result as string;
        const canvasData = JSON.parse(jsonContent);

        // Validate JSON structure
        if (!canvasData.lines || !Array.isArray(canvasData.lines)) {
          throw new Error('Format JSON tidak valid!');
        }

        // Validate line structure
        const validLines = canvasData.lines.every((line: Line) => 
          line.id && 
          line.start && 
          line.end && 
          typeof line.start.x === 'number' && 
          typeof line.start.y === 'number' &&
          typeof line.end.x === 'number' && 
          typeof line.end.y === 'number' &&
          typeof line.length === 'number'
        );

        if (!validLines) {
          throw new Error('Data garis dalam JSON tidak valid!');
        }

        // Reset current state
        setUndoStack([]);
        setRedoStack([]);
        setStartPoint(null);
        setMousePos(null);
        setIsDrawing(false);

        // Load lines
        setLines(canvasData.lines);

        // Load settings if available
        if (canvasData.settings) {
          setIsSnapping(canvasData.settings.isSnapping ?? true);
          setShowGrid(canvasData.settings.showGrid ?? true);
          setShowMeasurements(canvasData.settings.showMeasurements ?? true);
          setScale(canvasData.settings.scale ?? 1);
          setPanOffset(canvasData.settings.panOffset ?? { x: 0, y: 0 });
        }

        // Load calculated values if available
        if (canvasData.area !== undefined) {
          setArea(canvasData.area);
        }
        if (canvasData.perimeter !== undefined) {
          setPerimeter(canvasData.perimeter);
        }

        // If polygon is closed, recalculate values to ensure accuracy
        if (canvasData.lines.length >= 3) {
          const polygonPoints = canvasData.lines.map((line: Line) => line.start);
          const calculatedArea = calculateArea(polygonPoints);
          const calculatedPerimeter = calculatePerimeter(canvasData.lines);
          
          setArea(calculatedArea);
          setPerimeter(calculatedPerimeter);

          // Trigger calculation callback if polygon is closed
          if (canvasData.metadata?.isPolygonClosed) {
            const tileAreaM2 = (tileWidth * tileHeight) / 10000;
            const baseTiles = Math.ceil(calculatedArea / tileAreaM2);
            const additionalTiles = Math.ceil(baseTiles * WASTE_FACTOR);
            const totalTiles = baseTiles + additionalTiles;

            onCalculate?.({
              area: calculatedArea,
              perimeter: calculatedPerimeter,
              totalTiles,
              additionalTiles,
              costEstimate: tilePrice > 0 ? totalTiles * tilePrice : undefined
            });
          }
        }

        setError("");
      } catch (error) {
        console.error('Error loading JSON:', error);
        setError(`Gagal memuat file JSON: ${error instanceof Error ? error.message : 'Format tidak valid'}`);
      } finally {
        //setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Gagal membaca file!');
      //setIsLoading(false);
    };

    reader.readAsText(file);
  }, [calculateArea, calculatePerimeter, tileWidth, tileHeight, tilePrice, onCalculate]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        setError('Harap pilih file JSON yang valid!');
        return;
      }
      handleLoadJSON(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleLoadJSON]);

  // Calculate final results
  const tileAreaM2 = (tileWidth * tileHeight) / 10000;
  const baseTiles = Math.ceil(area / tileAreaM2);
  const additionalTiles = Math.ceil(baseTiles * WASTE_FACTOR);
  const totalTiles = baseTiles + additionalTiles;
  const costEstimate = tilePrice > 0 ? totalTiles * tilePrice : 0;

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
                  onClick={() => setScale(prev => Math.min(MAX_ZOOM, prev * 1.2))}
                  disabled={scale >= MAX_ZOOM}
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
                  onClick={() => setScale(prev => Math.max(MIN_ZOOM, prev / 1.2))}
                  disabled={scale <= MIN_ZOOM}
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
                  onClick={() => { setScale(1); setPanOffset({ x: 0, y: 0 }); }}
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
                checked={showGrid}
                onCheckedChange={(val) => setShowGrid((val as boolean))}
                className="rounded"
              />
              <span>Tampilkan Grid</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <Checkbox
                checked={showMeasurements}
                onCheckedChange={(val) => setShowMeasurements((val as boolean))}
                className="rounded"
              />
              <span>Tampilkan Ukuran</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <Checkbox
                checked={isSnapping}
                onCheckedChange={(val) => setIsSnapping((val as boolean))}
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
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
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
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
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
                  onClick={handleReset}
                  disabled={lines.length === 0}
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
                  onClick={handleSaveJSON}
                  disabled={lines.length === 0 || isSaving}
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
                    onChange={handleFileInputChange}
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
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className={cn("border-2 border-gray-300 cursor-crosshair w-full",isPanning && "cursor-grabbing")}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={handleKeyDown}
        />
        
        {/* Status Overlay */}
        {isDrawing && !isPolygonClosed() && (
          <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-md">
            <p className="text-sm font-medium">
              {startPoint ? "Klik untuk titik berikutnya" : "Klik untuk memulai"}
            </p>
            {lines.length >= 2 && (
              <p className="text-xs mt-1">Klik dekat titik awal untuk menutup polygon</p>
            )}
          </div>
        )}

        {/* Scale Indicator */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded text-sm">
          Zoom: {(scale * 100).toFixed(0)}% | 1 kotak = 1 meter
        </div>
      </div>

      {/* Enhanced Results Panel */}
      {isPolygonClosed() && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-bold text-xl text-green-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hasil Perhitungan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-700">Dimensi Ruangan</h4>
              <p className="text-2xl font-bold text-blue-600">{area.toFixed(2)} m²</p>
              <p className="text-sm text-gray-500">Keliling: {perimeter.toFixed(2)} m</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-700">Ukuran Keramik</h4>
              <p className="text-lg font-bold text-purple-600">{tileWidth} × {tileHeight} cm</p>
              <p className="text-sm text-gray-500">({tileAreaM2.toFixed(4)} m² per keping)</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-700">Kebutuhan Keramik</h4>
              <p className="text-2xl font-bold text-green-600">{totalTiles} keping</p>
              <p className="text-sm text-gray-500">
                Dasar: {baseTiles} + Cadangan: {additionalTiles}
              </p>
            </div>
            
            {tilePrice > 0 && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-700">Estimasi Biaya</h4>
                <p className="text-2xl font-bold text-red-600">
                  Rp {costEstimate.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-500">
                  @ Rp {tilePrice.toLocaleString('id-ID')} per keping
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