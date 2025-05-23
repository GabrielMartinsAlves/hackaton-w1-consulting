// next.config.ts
import type { NextConfig } from "next"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "/.env") })

const nextConfig: NextConfig = {
  env: {
    REACT_PUBLIC_URL_API: process.env.URL_API,
  },
}

export default nextConfig
