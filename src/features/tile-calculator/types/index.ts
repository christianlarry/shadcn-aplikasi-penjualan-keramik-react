export interface Point {
  x: number;
  y: number;
}

export interface Line {
  start: Point;
  end: Point;
  length: number;
  id: string;
}

export interface TileCalculatorData {
  area: number;
  totalTiles: number;
  perimeter: number;
  additionalTiles: number;
  costEstimate?: number;
}

// ...existing code...
export interface CanvasSaveData {
  version: string;
  timestamp: string;
  lines: Line[];
  area: number;
  perimeter: number;
  settings: {
    isSnapping: boolean;
    showGrid: boolean;
    showMeasurements: boolean;
    scale: number;
    panOffset: Point;
  };
  tileInfo: {
    tileWidth: number;
    tileHeight: number;
    tilePrice: number;
  };
  metadata: {
    totalLines: number;
    isPolygonClosed: boolean;
  };
}