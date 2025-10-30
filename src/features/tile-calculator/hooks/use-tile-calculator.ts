import { useCallback, useEffect, useRef, useState } from "react";
import type { CanvasSaveData, Line, Point } from "../types";
import { calculateArea, calculatePerimeter, checkIntersection, getCanvasCoordinates, GRID_SIZE, isPolygonClosed, loadCanvasFromJSON, MAX_ZOOM, MIN_LINE_LENGTH, MIN_ZOOM, saveCanvasAsJSON, SNAP_THRESHOLD, WASTE_FACTOR } from "../utils/canvas-helpers";
import type { TileCalculatorProps } from "../components/tile-calculator-canvas";
import { toast } from "sonner";

export const useTileCalculator = ({
  tileHeight,
  tileWidth,
  tilePrice = 0,
  onCalculate
}:Omit<TileCalculatorProps, "tilesPerBox">) => {

  // --- REFS
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Core drawing state
  const [lines, setLines] = useState<Line[]>([]);
  const [undoStack, setUndoStack] = useState<Line[][]>([]);
  const [redoStack, setRedoStack] = useState<Line[][]>([]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [mousePos, setMousePos] = useState<Point | null>(null);

  // --- Calculation results
  const [area, setArea] = useState<number>(0);
  const [perimeter, setPerimeter] = useState<number>(0);

  // --- UI state
  const [isSnapping, setIsSnapping] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // --- Pan and zoom state
  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);

  // --- Save/Load state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // --- Functions
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    console.log("Drawing canvas with lines:", lines);

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
      ctx.strokeStyle = isPolygonClosed(lines) ? "#10b981" : "#3b82f6";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();

      // Enhanced endpoints
      const pointColor = isPolygonClosed(lines) ? "#059669" : "#2563eb";
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
    if (startPoint && mousePos && !isPolygonClosed(lines)) {
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
    if (isPolygonClosed(lines) && lines.length >= 3) {
      ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
      ctx.beginPath();
      ctx.moveTo(lines[0].start.x, lines[0].start.y);
      lines.forEach(line => ctx.lineTo(line.end.x, line.end.y));
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }, [lines, mousePos, startPoint, showGrid, showMeasurements, scale, panOffset]);

  // --- Effects
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
  }, [draw, canvasRef, containerRef]);

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
  }, [canvasRef]);

  // Mouse Handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();

      // Middle mouse or Ctrl+Click for panning
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (e.button !== 0 || isPolygonClosed(lines)) return;

    const coords = getCanvasCoordinates(e, panOffset, scale, isSnapping);
    
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
        const errorMsg = "Garis tidak boleh berpotongan dengan garis lain!";
        setError(errorMsg);
        
        toast.error(errorMsg,{
          position: "bottom-center"
        });
        
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
  }, [lines, panOffset, scale, isSnapping, startPoint, undoStack, tileWidth, tileHeight, onCalculate, tilePrice]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning && lastPanPoint) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!startPoint || isPolygonClosed(lines)) return;

    const coords = getCanvasCoordinates(e, panOffset, scale, isSnapping);
    setMousePos(coords);
  }, [isPanning, lastPanPoint, startPoint, lines, panOffset, scale, isSnapping]);

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
  }, [handleRedo, handleUndo, handleReset]);

  // JSON Save/Load Functions
  const handleSaveJSON = useCallback(() => {
    try {
      setIsSaving(true);

      const canvasData:CanvasSaveData = {
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
          isPolygonClosed: isPolygonClosed(lines)
        }
      };

      saveCanvasAsJSON(canvasData);
    } catch (error) {
      console.error('Error saving JSON:', error);
      setError('Gagal menyimpan file JSON!');
    } finally {
      setIsSaving(false);
    }
  }, [lines, area, perimeter, isSnapping, showGrid, showMeasurements, scale, panOffset, tileWidth, tileHeight, tilePrice]);

  const handleLoadJSON = useCallback(async (file: File) => {
    // setIsLoading(true);
    setError("");

    try {
      const canvasData = await loadCanvasFromJSON(file);

      // Reset state sebelum memuat data baru
      setUndoStack([]);
      setRedoStack([]);
      setStartPoint(null);
      setMousePos(null);
      setIsDrawing(false);

      // Muat data dari file
      setLines(canvasData.lines);
      
      // Muat pengaturan
      if (canvasData.settings) {
        setIsSnapping(canvasData.settings.isSnapping ?? true);
        setShowGrid(canvasData.settings.showGrid ?? true);
        setShowMeasurements(canvasData.settings.showMeasurements ?? true);
        setScale(canvasData.settings.scale ?? 1);
        setPanOffset(canvasData.settings.panOffset ?? { x: 0, y: 0 });
      }

      // Hitung ulang nilai untuk memastikan akurasi
      const polygonPoints = canvasData.lines.map((line: Line) => line.start);
      const calculatedArea = calculateArea(polygonPoints);
      const calculatedPerimeter = calculatePerimeter(canvasData.lines);
      setArea(calculatedArea);
      setPerimeter(calculatedPerimeter);

      // Panggil callback onCalculate jika poligon tertutup
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

    } catch (error) {
      console.error('Error loading JSON:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat file.');
    } finally {
      // setIsLoading(false);
    }
  }, [tileWidth, tileHeight, tilePrice, onCalculate]);

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

  return {
    refs: {
      canvasRef,
      containerRef,
      jsonFileInputRef
    },
    state: {
      lines,
      undoStack,
      redoStack,
      startPoint,
      mousePos,
      area,
      perimeter,
      isSnapping,
      showGrid,
      showMeasurements,
      scale,
      error,
      isDrawing,
      panOffset,
      isPanning,
      lastPanPoint,
      isSaving
    },
    setter: {
      setLines,
      setUndoStack,
      setRedoStack,
      setStartPoint,
      setMousePos,
      setArea,
      setPerimeter,
      setIsSnapping,
      setShowGrid,
      setShowMeasurements,
      setScale,
      setError,
      setIsDrawing,
      setPanOffset,
      setIsPanning,
      setLastPanPoint,
      setIsSaving
    },
    handlers: {
      handleKeyDown,
      handleSaveJSON,
      handleFileInputChange,
      handleUndo,
      handleRedo,
      handleReset,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleWheel
    }
  }
}