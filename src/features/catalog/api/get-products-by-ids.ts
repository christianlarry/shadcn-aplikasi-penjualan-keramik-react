import { useQueries } from "@tanstack/react-query";
import { getProductQueryOptions } from "./get-product";
import type { QueryConfig } from "@/lib/react-query";

type UseGetProductsByIdsOptions = {
  productIds: (string)[];
  queryConfig?: QueryConfig<typeof getProductQueryOptions>;
};

/**
 * Custom hook untuk mengambil data beberapa produk berdasarkan array ID.
 * Hook ini menggunakan `useQueries` dari React Query untuk menjalankan beberapa query secara paralel.
 *
 * @param {UseGetProductsByIdsOptions} options - Opsi untuk hook.
 * @param {(string)[]} options.productIds - Array yang berisi ID produk yang akan diambil.
 * @param {QueryConfig} [options.queryConfig] - Konfigurasi tambahan untuk setiap query.
 * @returns {UseQueryResult[]} - Array hasil dari setiap query produk.
 */
export const useGetProductsByIds = ({
  productIds,
  queryConfig,
}: UseGetProductsByIdsOptions) => {
  return useQueries({
    queries: productIds.map((productId) => {
      const isEnabled = !!productId;
      return {
        ...getProductQueryOptions(productId),
        ...queryConfig,
        enabled: isEnabled && (queryConfig?.enabled ?? true),
      };
    }),
  });
};