FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install react react-dom -D vite @vitejs/plugin-react

COPY . . 

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]