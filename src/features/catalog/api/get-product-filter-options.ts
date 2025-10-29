import api from "@/lib/axios-client";
import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { GetProductFilterOptionsResponse } from "../types/product";

/**
 * 1. Fungsi Fetcher
 * Mengambil opsi filter yang tersedia untuk produk dari API.
 */
export const getProductFilterOptions =
  (): Promise<GetProductFilterOptionsResponse> => {
    return api.get("/product/filter-options");
  };

/**
 * 2. Fungsi Query Key
 * Mendefinisikan kunci unik untuk query filter options.
 */
export const getProductFilterOptionsQueryKey = () => ["products", "filter-options"];

/**
 * 3. Fungsi Query Options
 * Menggabungkan queryKey dan queryFn untuk konfigurasi query yang dapat digunakan kembali.
 */
export const getProductFilterOptionsQueryOptions = () => {
  return queryOptions({
    queryKey: getProductFilterOptionsQueryKey(),
    queryFn: getProductFilterOptions,
  });
};

/**
 * 4. Custom Hook
 * Hook yang digunakan di dalam komponen untuk mengambil data filter options.
 */
type UseGetProductFilterOptions = {
  queryConfig?: QueryConfig<typeof getProductFilterOptionsQueryOptions>;
};

export const useGetProductFilterOptions = (
  options: UseGetProductFilterOptions = {}
) => {
  return useQuery({
    ...getProductFilterOptionsQueryOptions(),
    ...options.queryConfig,
  });
};