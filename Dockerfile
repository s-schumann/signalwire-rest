# Chosing a lightweight image with Node LTS as starting point
FROM node:18.15.0-bullseye-slim
#amd64 sha256 to append for production: @575f8d9e973760ffa0f13791959f4cda1c7d4ff00a07cc1766931ddbfe21e010

# Set Node env for production use
#ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# This is done separate to our code to optimize caching
COPY package*.json ./

# We are using npm ci instead to get a reproducible build
RUN npm install

# If you are building your code for production, use this instead of npm install
# RUN npm ci --only=production

# Use non-elevated user
USER node

# Bundle app source and copy after the dependencies are installed
COPY --chown=mode:node . .

# Documenting the port where the app will be listening on
EXPOSE 3000

CMD [ "node", "index.js" ]
