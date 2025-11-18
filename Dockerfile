# syntax=docker/dockerfile:1

# Node base with workspace deps
FROM node:20-bookworm-slim AS node-base
WORKDIR /workspace
ENV NX_DAEMON=false
COPY package*.json nx.json tsconfig.base.json jest.config.ts jest.preset.js eslint.config.mjs proxy.conf.json proxy.conf.docker.json ./
RUN npm ci

# Build Angular app
FROM node-base AS frontend-build
COPY libs libs
COPY apps/frontend apps/frontend
RUN npx nx build frontend --configuration=production

# Runtime image for Angular (static) + API proxy
FROM nginx:1.27-alpine AS frontend
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /workspace/dist/apps/frontend/browser /usr/share/nginx/html
EXPOSE 80

# Python base for FastAPI
FROM python:3.12-slim AS api
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
RUN pip install --no-cache-dir uv
COPY apps/pyproject.toml apps/uv.lock ./
COPY apps/README.md README.md
RUN uv sync --frozen --no-dev --python /usr/local/bin/python
COPY apps/api api
EXPOSE 8000
CMD ["uv", "run", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Test runner image (frontend + backend tests)
FROM node:20-bookworm-slim AS tests
WORKDIR /workspace
ENV NX_DAEMON=false
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip python3-venv \
  && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir uv
COPY package*.json nx.json tsconfig.base.json jest.config.ts jest.preset.js eslint.config.mjs proxy.conf.json ./
RUN npm ci
COPY libs libs
COPY apps apps
WORKDIR /workspace/apps
RUN uv sync --frozen --all-groups
ENV PATH="/workspace/apps/.venv/bin:${PATH}"
WORKDIR /workspace
CMD ["bash", "-lc", "npx nx test frontend frontend-data-access api"]
