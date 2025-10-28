/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, type UseMutationOptions } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // Data dianggap stale setelah 1 menit
      refetchOnWindowFocus: false, // Tidak refetch saat window focus
      retry: 1, // Coba ulang 1x jika gagal
    }
  }
})

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;