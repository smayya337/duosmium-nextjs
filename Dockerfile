FROM node:lts
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
CMD ["npm", "run", "dev"]
