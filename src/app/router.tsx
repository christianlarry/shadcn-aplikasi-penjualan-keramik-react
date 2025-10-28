import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { paths } from '@/config/paths'; // Import objek paths
import MainLayout from '@/components/layouts/main-layout'; // Import MainLayout
import ErrorPage from '@/pages/error-page'; // Import ErrorPage

// Fungsi helper untuk lazy loading komponen dan mengintegrasikan clientLoader/clientAction
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient), // Jika ada clientLoader, panggil dengan queryClient
    action: clientAction?.(queryClient), // Jika ada clientAction, panggil dengan queryClient
    Component, // Komponen utama
  };
};

const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path, // Path dasar aplikasi, yaitu '/'
      errorElement: <ErrorPage />, // Tampilkan ErrorPage jika ada error di rute ini atau turunannya
      children: [
        {
          element: <MainLayout />, // Gunakan MainLayout sebagai wrapper untuk rute-rute utama
          children: [
            {
              index: true, // Rute default untuk path '/', akan menampilkan HomePage
              lazy: () => import('@/pages/home-page').then(convert(queryClient)),
            },
            {
              // Rute untuk '/catalog', akan me-redirect ke '/catalog/all-products'
              path: paths.catalog.root.path, // Ambil 'catalog' dari '/catalog'
              element: <Navigate to={paths.catalog.allProducts.path} replace />,
            },
            {
              // Rute untuk '/catalog/all-products'
              path: paths.catalog.allProducts.path, // Ambil 'catalog/all-products'
              lazy: () =>
                import('@/features/catalog/pages/all-product-page').then(
                  convert(queryClient),
                ),
            },
            {
              // Rute untuk '/catalog/best-seller'
              path: paths.catalog.bestSeller.path, // Ambil 'catalog/best-seller'
              lazy: () =>
                import('@/features/catalog/pages/best-seller-page').then(
                  convert(queryClient),
                ),
            },
            {
              // Rute untuk '/catalog/new-arrivals'
              path: paths.catalog.newArrivals.path, // Ambil 'catalog/new-arrivals'
              lazy: () =>
                import('@/features/catalog/pages/new-arrivals-page').then(
                  convert(queryClient),
                ),
            },
            {
              // Rute untuk '/catalog/discount'
              path: paths.catalog.discount.path, // Ambil 'catalog/discount'
              lazy: () =>
                import('@/features/catalog/pages/discount-page').then(
                  convert(queryClient),
                ),
            },
            {
              // Rute untuk '/catalog/product/:id'
              path: paths.catalog.productDetail.path, // Ambil 'catalog/product/:id'
              lazy: () =>
                import('@/features/catalog/pages/product-detail-page').then(
                  convert(queryClient),
                ),
            },
          ],
        },
        {
          // Rute untuk '/tile-calculator'
          path: paths.tileCalculator.path, // Ambil 'tile-calculator'
          lazy: () =>
            import('@/features/tile-calculator/pages/tile-calculator-page').then(
              convert(queryClient),
            ),
        },
        // Bagian ini adalah rute autentikasi yang disimpan untuk kemungkinan penggunaan di masa mendatang.
        // Saat ini, paths.auth di paths.ts dikomentari, sehingga rute ini tidak akan aktif.
        // Jika paths.auth di paths.ts diaktifkan, Anda bisa menghapus komentar di bawah ini.
        /*
        {
          path: paths.auth.register.path,
          lazy: () => import('./routes/auth/register').then(convert(queryClient)),
        },
        {
          path: paths.auth.login.path,
          lazy: () => import('./routes/auth/login').then(convert(queryClient)),
        },
        */
      ],
    },
    {
      path: '*', // Rute catch-all untuk halaman yang tidak ditemukan (404)
      lazy: () => import('@/pages/error-page').then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  // Gunakan useMemo untuk memastikan router hanya dibuat ulang jika queryClient berubah
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};