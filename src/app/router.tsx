import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

import { paths } from '@/config/paths'; // Import objek paths
import MainLayout from '@/components/layouts/main-layout'; // Import MainLayout
import { LoadingScreen } from '@/components/common/screen/loading-screen';
import ErrorScreen from '@/components/common/screen/error-screen';
import NotFoundRoute from './routes/not-found';

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
      errorElement: <ErrorScreen />, // Tampilkan ErrorPage jika ada error di rute ini atau turunannya
      hydrateFallbackElement: <LoadingScreen/>, // Tampilkan LoadingScreen saat melakukan hidrasi
      children: [
        {
          element: <MainLayout />, // Gunakan MainLayout sebagai wrapper untuk rute-rute utama
          children: [
            {
              index: true, // Rute default untuk path '/', akan menampilkan HomePage
              lazy: () => import('@/app/routes/home').then(convert(queryClient)),
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
                import('@/app/routes/catalog/all-products').then(
                  convert(queryClient),
                ),
            },
            {
              // Rute untuk '/catalog/best-seller'
              path: paths.catalog.bestSeller.path, // Ambil 'catalog/best-seller'
              lazy: () =>
                import('@/app/routes/catalog/best-seller').then(
                  convert(queryClient),
                ),
            },
            {
              // Rute untuk '/catalog/new-arrivals'
              path: paths.catalog.newArrivals.path, // Ambil 'catalog/new-arrivals'
              lazy: () =>
                import('@/app/routes/catalog/new-arrivals').then(
                  convert(queryClient),
                ),
            },
            {
              // Rute untuk '/catalog/discount'
              path: paths.catalog.discount.path, // Ambil 'catalog/discount'
              lazy: () =>
                import('@/app/routes/catalog/discount').then(
                  convert(queryClient),
                ),
            },
            {
              // Rute untuk '/catalog/product/:id'
              path: paths.catalog.productDetail.path, // Ambil 'catalog/product/:id'
              lazy: () =>
                import('@/app/routes/catalog/product-detail').then(
                  convert(queryClient),
                ),
            },
          ],
        },
        {
          // Rute untuk '/tile-calculator'
          path: paths.tileCalculator.path, // Ambil 'tile-calculator'
          lazy: () =>
            import('@/app/routes/tile-calculator/tile-calculator').then(
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
      element: <NotFoundRoute />, // Tampilkan ErrorPage jika halaman tidak ditemukan
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  // Gunakan useMemo untuk memastikan router hanya dibuat ulang jika queryClient berubah
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};