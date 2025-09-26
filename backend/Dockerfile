# ---- Stage 1: Build ----
# Use a slim Debian-based image which has better compatibility than Alpine
FROM node:22-slim AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate the Prisma client using the correct binary
# The schema should have: binaryTargets = ["native", "debian-openssl-3.0.x"]
# If you stick with alpine, use "linux-musl-openssl-3.0.x"
RUN npx prisma generate

# Copy the rest of your source code
COPY . .

# Build the application
RUN npm run build

# ---- Stage 2: Production ----
# Use the same slim image for the final stage
FROM node:22-slim AS production

WORKDIR /usr/src/app

# Copy package files for installing production dependencies
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the generated Prisma client and schema from the builder stage
# This is crucial for Prisma to work in production
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/prisma/schema.prisma ./prisma/

# Expose the application port
EXPOSE 1001

# Command to run the application
CMD ["node", "dist/src/main"]