FROM node:16

WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install # to create Docker cache layer
ENV PATH="node_modules/.bin:${PATH}"

COPY . .
RUN npm install
RUN npm run build # for production

EXPOSE 5000

CMD ["npm", "run", "start"]
