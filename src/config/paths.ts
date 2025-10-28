export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  // Paths untuk autentikasi, disimpan untuk kemungkinan penggunaan di masa mendatang
  // auth: {
  //   register: {
  //     path: '/auth/register',
  //     getHref: (redirectTo?: string | null | undefined) =>
  //       `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
  //   },
  //   login: {
  //     path: '/auth/login',
  //     getHref: (redirectTo?: string | null | undefined) =>
  //       `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
  //   },
  // },

  catalog: {
    // Path dasar untuk katalog, mengarah ke semua produk
    root: {
      path: 'catalog',
      getHref: () => '/catalog',
    },
    allProducts: {
      path: 'catalog/all-products',
      getHref: () => '/catalog/all-products',
    },
    bestSeller: {
      path: 'catalog/best-seller',
      getHref: () => '/catalog/best-seller',
    },
    newArrivals: {
      path: 'catalog/new-arrivals',
      getHref: () => '/catalog/new-arrivals',
    },
    discount: {
      path: 'catalog/discount',
      getHref: () => '/catalog/discount',
    },
    productDetail: {
      path: 'catalog/product/:id',
      getHref: (id: string) => `/catalog/product/${id}`,
    },
  },

  tileCalculator: {
    path: 'tile-calculator',
    getHref: () => '/tile-calculator',
  },
} as const;