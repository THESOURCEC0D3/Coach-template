FROM node:24-bookworm-slim
WORKDIR /server
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
EXPOSE 9000 5173
CMD ["npm", "run", "dev"]
