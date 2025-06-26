import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
});
