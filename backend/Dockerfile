# ─── Backend Dockerfile ────────────────────────────────────────────────────────
# Build context must be the PROJECT ROOT (not ./backend)
# docker-compose handles this automatically.

FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Install dependencies first (layer cache)
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend source code
COPY backend/ ./backend/

# Copy CSV files for migration (read from root of project)
COPY books.csv students.csv issued_books.csv ./

WORKDIR /app/backend

EXPOSE 5000

# Start: run migration (idempotent — skips if data exists) then start server
CMD ["sh", "-c", "node migration/migrate.js && node server.js"]
