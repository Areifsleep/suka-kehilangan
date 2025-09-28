# Stage 1: build React/Vite
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./

RUN npm install @rollup/rollup-linux-x64-gnu

RUN npm ci

COPY . .
RUN npm run build

# Stage 2: serve pakai nginx
FROM nginx:1.25-alpine

# Copy global nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy server block (app.conf) → /etc/nginx/conf.d/
COPY app.conf /etc/nginx/conf.d/default.conf

# Copy hasil build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]