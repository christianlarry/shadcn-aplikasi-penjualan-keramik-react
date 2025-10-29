# Pola Implementasi React Query

Dokumen ini menjelaskan pola standar untuk implementasi React Query di dalam proyek ini. Tujuannya adalah untuk memastikan semua query memiliki struktur yang konsisten, *type-safe*, dan mudah dipelihara. Pola ini dicontohkan melalui file `src/features/catalog/api/get-product.ts` yang berfungsi untuk mengambil data satu produk.

## Gambaran Umum Pola

Pola ini memisahkan logika query menjadi empat bagian utama yang saling berhubungan, yang semuanya berada dalam satu file (misalnya, `get-product.ts`):

1.  **Fungsi Fetcher (`getProduct`)**: Fungsi inti yang melakukan panggilan API.
2.  **Fungsi Query Key (`getProductQueryKey`)**: Fungsi yang mendefinisikan kunci unik untuk data di dalam cache React Query.
3.  **Fungsi Query Options (`getProductQueryOptions`)**: Fungsi yang menggabungkan `queryKey` dan `queryFn` (fungsi fetcher) menjadi satu objek konfigurasi.
4.  **Custom Hook (`useGetProduct`)**: Hook React yang akan digunakan di dalam komponen untuk mengakses data.

---

## Komponen Pola

### 1. Fungsi Fetcher

Fungsi ini bertanggung jawab penuh untuk berkomunikasi dengan API dan mengembalikan data.

*   **Contoh:**
    ```typescript
    export const getProduct = (productId:string):Promise<GetProductResponse>=>{
      return api.get(`/product/${productId}`)
    }
    ```
*   **Karakteristik:**
    *   Merupakan fungsi `async` yang mengembalikan `Promise`.
    *   Menerima parameter yang dibutuhkan oleh endpoint API (misalnya, `productId`).
    *   Tidak memiliki ketergantungan pada React Query.
    *   Bertanggung jawab untuk mengembalikan data dari respons API.

### 2. Fungsi Query Key

Fungsi ini sangat penting untuk manajemen cache React Query. Ia menghasilkan sebuah array yang menjadi kunci unik untuk setiap query.

*   **Contoh:**
    ```typescript
    export const getProductQueryKey = (productId:string)=>["products",productId]
    ```
*   **Karakteristik:**
    *   Menerima parameter yang sama dengan fungsi fetcher.
    *   Mengembalikan sebuah array.
    *   Struktur array biasanya: `["nama-resource", identifier-unik]`. Contoh: `["products", "123"]`. Struktur ini memudahkan untuk melakukan invalidasi query secara massal (misalnya, menginvalidasi semua query yang dimulai dengan `"products"`).

### 3. Fungsi Query Options

Fungsi ini menggabungkan `queryKey` dan `queryFn` menggunakan `queryOptions` dari React Query. Ini adalah "jantung" dari konfigurasi query.

*   **Contoh:**
    ```typescript
    export const getProductQueryOptions = (productId:string)=>{
      return queryOptions({
        queryKey: getProductQueryKey(productId),
        queryFn: ()=>getProduct(productId),
      })
    }
    ```
*   **Karakteristik:**
    *   Menerima parameter yang sama dengan fungsi fetcher.
    *   Memanggil `getProductQueryKey` untuk mendefinisikan `queryKey`.
    *   Memanggil `getProduct` di dalam `queryFn`.
    *   Ini adalah tempat yang tepat untuk menambahkan opsi default React Query, seperti `staleTime` atau `enabled`.

### 4. Custom Hook

Ini adalah antarmuka akhir yang akan digunakan oleh komponen-komponen React. Hook ini menyembunyikan kompleksitas `useQuery` dan menyediakan cara yang bersih untuk mengambil data.

*   **Contoh:**
    ```typescript
    type UseGetProductOptions = {
      productId:string,
      queryConfig?:QueryConfig<typeof getProductQueryOptions>
    }

    export const useGetProduct = (options:UseGetProductOptions)=>{
      return useQuery({
        ...getProductQueryOptions(options.productId),
        ...options.queryConfig
      })
    }
    ```
*   **Karakteristik:**
    *   Membungkus `useQuery` dari React Query.
    *   Menerima parameter yang dibutuhkan (`productId`) dan sebuah `queryConfig` opsional.
    *   `queryConfig` memungkinkan komponen untuk menimpa (override) opsi default yang telah didefinisikan di `getProductQueryOptions` jika diperlukan (misalnya, menonaktifkan query dengan `enabled: false`).

---

## Cara Mengimplementasikan Query Baru (Contoh: `get-order`)

Gunakan pola di atas sebagai cetak biru. Misalkan Anda ingin membuat query untuk mengambil detail pesanan (`order`).

1.  **Buat File API Baru:**
    Buat file `src/features/orders/api/get-order.ts`.

2.  **Definisikan Tipe Data:**
    Pastikan Anda memiliki tipe `Order` dan `GetOrderResponse` di `src/features/orders/types/order.ts`.

3.  **Implementasikan 4 Komponen Pola di `get-order.ts`:**

    ```typescript
    // src/features/orders/api/get-order.ts
    import api from "@/lib/axios-client"
    import type { GetOrderResponse } from "../types/order"
    import { queryOptions, useQuery } from "@tanstack/react-query"
    import type { QueryConfig } from "@/lib/react-query"

    // 1. Fungsi Fetcher
    export const getOrder = (orderId:string):Promise<GetOrderResponse>=>{
      return api.get(`/orders/${orderId}`)
    }

    // 2. Fungsi Query Key
    export const getOrderQueryKey = (orderId:string)=>["orders", orderId]

    // 3. Fungsi Query Options
    export const getOrderQueryOptions = (orderId:string)=>{
      return queryOptions({
        queryKey: getOrderQueryKey(orderId),
        queryFn: ()=>getOrder(orderId),
        enabled: !!orderId // Contoh: hanya aktifkan jika orderId ada
      })
    }

    // 4. Custom Hook
    type UseGetOrderOptions = {
      orderId:string,
      queryConfig?:QueryConfig<typeof getOrderQueryOptions>
    }

    export const useGetOrder = (options:UseGetOrderOptions)=>{
      return useQuery({
        ...getOrderQueryOptions(options.orderId),
        ...options.queryConfig
      })
    }
    ```

Dengan mengikuti pola ini, seluruh codebase Anda untuk data fetching akan menjadi sangat terstruktur, mudah diprediksi, dan mudah untuk di-debug.