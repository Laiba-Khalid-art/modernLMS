# ─── Frontend Dockerfile ───────────────────────────────────────────────────────
# Stage 1 — Build the React app with Vite
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Serve with Nginx (tiny ~25 MB final image)
FROM nginx:1.27-alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
