import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [react(), wasm()],

  server: {
    port: 3000,
  },

  optimizeDeps: {
    include: ["react-is", "@emotion/react", "react", "react-dom"],
    exclude: ["parquet-wasm"],
  },

  resolve: {
    dedupe: ["react", "react-dom", "@emotion/react"],
  },

  build: {
    sourcemap: true,
    // Prevent base64 inlining of assets; helps avoid inline data: worker payloads
    assetsInlineLimit: 0,
    // PERF: Configure manual chunks for better caching and parallel loading
    // This splits vendor code into separate chunks that can be:
    // 1. Cached independently (vendor code changes less often)
    // 2. Loaded in parallel with app code
    rollupOptions: {
      output: {
        // Use function form for manualChunks (compatible with rolldown-vite)
        manualChunks(id: string) {
          // Core React runtime - changes rarely
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router/") ||
            id.includes("node_modules/react-is/")
          ) {
            return "vendor-react";
          }
          // Apollo/GraphQL - medium change frequency
          if (id.includes("node_modules/@apollo/") || id.includes("node_modules/graphql/")) {
            return "vendor-apollo";
          }
          // AWS Amplify - changes rarely
          if (
            id.includes("node_modules/aws-amplify/") ||
            id.includes("node_modules/@aws-amplify/")
          ) {
            return "vendor-aws";
          }
          // Charts library - large, changes rarely
          if (id.includes("node_modules/recharts/")) {
            return "vendor-charts";
          }
          // Apache Arrow for parquet processing - very large, changes rarely
          if (id.includes("node_modules/apache-arrow/")) {
            return "vendor-arrow";
          }
          // UI components - Radix UI primitives
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-ui-radix";
          }
          // Emotion styling - used across app
          if (id.includes("node_modules/@emotion/")) {
            return "vendor-emotion";
          }
        },
      },
    },
  },

  worker: {
    format: "es",
    // Use a fresh wasm() instance for the worker graph
    plugins: () => [wasm()],
  },
});
