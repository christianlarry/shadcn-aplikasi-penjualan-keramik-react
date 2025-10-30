import type { CanvasSaveData, Line, Point } from "@/features/tile-calculator/types";

// Configuration constants
export const GRID_SIZE = 50; // 1 grid = 1 meter
export const WASTE_FACTOR = 0.1; // 10% waste factor
export const MIN_LINE_LENGTH = 0.1; // Minimum line length in meters
export const SNAP_THRESHOLD = 25; // Snap threshold in pixels
export const MAX_ZOOM = 3;
export const MIN_ZOOM = 0.3;

export const calculateArea = (points: Point[]): number => {
  if (points.length < 3) return 0;
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area / 2) / (GRID_SIZE * GRID_SIZE);
};

export const calculatePerimeter = (lines: Line[]): number => {
  return lines.reduce((sum, line) => sum + line.length, 0);
};

export const checkIntersection = (line1: Line, line2: Line): boolean => {
  // Skip if lines share a point
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
};

export const isPolygonClosed = (lines: Line[]) => {
  if (lines.length < 3) return false;
  const first = lines[0].start;
  const last = lines[lines.length - 1].end;
  const distance = Math.sqrt(
    Math.pow(first.x - last.x, 2) + Math.pow(first.y - last.y, 2)
  );
  return distance < SNAP_THRESHOLD;
}

export const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>, panOffset: Point, scale: number, isSnapping: boolean) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x = (e.clientX - rect.left - panOffset.x) / scale;
    let y = (e.clientY - rect.top - panOffset.y) / scale;

    if (isSnapping) {
      x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      y = Math.round(y / GRID_SIZE) * GRID_SIZE;
    }

    return { x, y };
  };

/**
 * Memicu unduhan file JSON dari data kanvas yang diberikan.
 * @param data - Objek data kanvas yang akan disimpan.
 * @throws Akan melempar error jika proses pembuatan file gagal.
 */
export const saveCanvasAsJSON = (data: CanvasSaveData): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `tile-calculator-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating JSON file:', error);
    throw new Error('Gagal membuat file JSON untuk diunduh.');
  }
};

/**
 * Membaca, mem-parsing, dan validasi file JSON.
 * @param file - File JSON yang akan dimuat.
 * @returns Promise yang akan resolve dengan data kanvas yang valid.
 * @rejects Akan melempar error jika file tidak bisa dibaca, tidak valid, atau formatnya salah.
 */
export const loadCanvasFromJSON = (file: File): Promise<CanvasSaveData> => {
  return new Promise((resolve, reject) => {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      return reject(new Error('Harap pilih file JSON yang valid!'));
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonContent = e.target?.result as string;
        const data = JSON.parse(jsonContent) as CanvasSaveData;

        // Validasi struktur dasar
        if (!data.lines || !Array.isArray(data.lines) || !data.settings || !data.tileInfo) {
          throw new Error('Struktur file JSON tidak valid atau korup.');
        }

        // Validasi struktur setiap garis
        const areLinesValid = data.lines.every((line: Line) =>
          typeof line.id === 'string' &&
          typeof line.start?.x === 'number' && typeof line.start?.y === 'number' &&
          typeof line.end?.x === 'number' && typeof line.end?.y === 'number' &&
          typeof line.length === 'number'
        );

        if (!areLinesValid) {
          throw new Error('Data garis di dalam file JSON tidak valid.');
        }

        resolve(data);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Gagal mem-parsing file JSON.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file.'));
    };

    reader.readAsText(file);
  });
};