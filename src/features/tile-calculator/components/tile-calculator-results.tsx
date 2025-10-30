import type { useTileCalculator } from "../hooks/use-tile-calculator";
import { WASTE_FACTOR } from "../utils/canvas-helpers";
import type { TileCalculatorProps } from "./tile-calculator-canvas";

type TileCalculatorResultsProps = TileCalculatorProps & Omit<ReturnType<typeof useTileCalculator>, "refs"|"handlers"|"setter">

const TileCalculatorResults = ({
  state,
  tileHeight,
  tileWidth,
  tilePrice = 0,
  tilesPerBox
}:TileCalculatorResultsProps) => {

  // Calculate final results
  const tileAreaM2 = (tileWidth * tileHeight) / 10000;
  const baseTiles = Math.ceil(state.area / tileAreaM2);
  const additionalTiles = Math.ceil(baseTiles * WASTE_FACTOR);
  const totalTiles = baseTiles + additionalTiles;
  const totalBox = Math.ceil(totalTiles / tilesPerBox);
  const costEstimate = tilePrice > 0 ? totalBox * tilePrice : 0;

  return (
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
  )
}

export default TileCalculatorResults