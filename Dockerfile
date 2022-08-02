FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

# Running npm install for production mode (bundling and minification)
RUN npm ci --only=production

COPY . .

# For the core api we need to run the build script on port 4000 
EXPOSE 4000

CMD [ "npm", "start"]