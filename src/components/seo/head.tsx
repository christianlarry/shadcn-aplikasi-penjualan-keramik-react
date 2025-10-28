import { INFORMASI_TOKO } from "@/constants/informasi-toko";

type HeadProps = {
  title?: string;
  description?: string;
  canonicalUrl?: string; // URL kanonis untuk menghindari duplikasi konten
  ogType?: string; // Tipe Open Graph, misal 'website', 'article'
  ogImage?: string; // URL gambar untuk Open Graph (social media sharing)
  ogUrl?: string; // URL spesifik untuk Open Graph, jika berbeda dari canonical
};

// Nilai default untuk aplikasi Anda
const DEFAULT_APP_TITLE = INFORMASI_TOKO.NAMA;
const DEFAULT_APP_DESCRIPTION = 'Solusi aplikasi penjualan toko keramik yang modern dan efisien, menyediakan berbagai pilihan keramik berkualitas tinggi.';
const DEFAULT_OG_TYPE = 'website';
const DEFAULT_OG_IMAGE_PATH = '/images/web-icon.webp'; // Asumsi ada logo di folder public

export const Head = ({
  title,
  description,
  canonicalUrl,
  ogType = DEFAULT_OG_TYPE,
  ogImage = DEFAULT_OG_IMAGE_PATH,
  ogUrl,
}: HeadProps = {}) => {
  // Gabungkan judul dengan judul default aplikasi
  const finalTitle = title ? `${title} | ${DEFAULT_APP_TITLE}` : DEFAULT_APP_TITLE;
  // Gunakan deskripsi dari props atau deskripsi default aplikasi
  const finalDescription = description || DEFAULT_APP_DESCRIPTION;
  // Gunakan canonicalUrl dari props, atau URL saat ini sebagai fallback
  const finalCanonicalUrl = canonicalUrl || window.location.href;
  // Gunakan ogUrl dari props, atau finalCanonicalUrl sebagai fallback
  const finalOgUrl = ogUrl || finalCanonicalUrl;

  // Pastikan ogImage adalah URL absolut
  const finalOgImage = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;

  return (
    <>
      {/* Tag Meta Dasar */}
      {/* Menentukan set karakter dokumen */}
      <meta charSet="utf-8" />
      {/* Mengatur viewport untuk responsivitas di berbagai perangkat */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Deskripsi halaman untuk mesin pencari */}
      <meta name="description" content={finalDescription} />
      {/* Judul halaman yang akan muncul di tab browser */}
      <title>{finalTitle}</title>

      {/* Link Kanonis */}
      {/* Memberi tahu mesin pencari URL utama untuk konten ini, menghindari masalah duplikasi */}
      <link rel="canonical" href={finalCanonicalUrl} />

      {/* Open Graph Tags (untuk Facebook, WhatsApp, LinkedIn, dll.) */}
      {/* Menentukan tipe konten (misal: website, article) */}
      <meta property="og:type" content={ogType} />
      {/* URL yang akan dibagikan di media sosial */}
      <meta property="og:url" content={finalOgUrl} />
      {/* Judul yang akan muncul saat dibagikan di media sosial */}
      <meta property="og:title" content={finalTitle} />
      {/* Deskripsi yang akan muncul saat dibagikan di media sosial */}
      <meta property="og:description" content={finalDescription} />
      {/* URL gambar yang akan muncul saat dibagikan di media sosial */}
      <meta property="og:image" content={finalOgImage} />

      {/* Twitter Card Tags */}
      {/* Menentukan tipe Twitter Card (misal: summary_large_image) */}
      <meta property="twitter:card" content="summary_large_image" />
      {/* URL yang akan dibagikan di Twitter */}
      <meta property="twitter:url" content={finalOgUrl} />
      {/* Judul yang akan muncul saat dibagikan di Twitter */}
      <meta property="twitter:title" content={finalTitle} />
      {/* Deskripsi yang akan muncul saat dibagikan di Twitter */}
      <meta property="twitter:description" content={finalDescription} />
      {/* URL gambar yang akan muncul saat dibagikan di Twitter */}
      <meta property="twitter:image" content={finalOgImage} />

      {/* Favicon (opsional, namun direkomendasikan) */}
      {/* <link rel="icon" href="/favicon.ico" /> */}
      {/* <link rel="apple-touch-icon" href="/logo192.png" /> */}
    </>
  );
};