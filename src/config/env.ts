import * as z from 'zod';

const createEnv = () => {
  const EnvSchema = z.object({
    // Variabel-variabel dari file .env
    API_BASE_URL: z.url("VITE_API_BASE_URL harus berupa URL yang valid"),
    API_PRODUCT_IMG_BASEURL: z.url("VITE_API_PRODUCT_IMG_BASEURL harus berupa URL yang valid"),
    DASHBOARD_BASE_URL: z.url("VITE_DASHBOARD_BASE_URL harus berupa URL yang valid"),
    QRIS_IMAGE_URL: z.url("VITE_QRIS_IMAGE_URL harus berupa URL yang valid"),
  });

  const envVars = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((acc, curr) => {
    const [key, value] = curr;
    if (key.startsWith('VITE_APP_')) {
      acc[key.replace('VITE_APP_', '')] = value;
    }
    return acc;
  }, {});

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
The following variables are missing or invalid:
${Object.entries(parsedEnv.error.flatten().fieldErrors)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join('\n')}
`,
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();