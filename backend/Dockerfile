
# Use a pinned LTS image for predictable builds. Amra akta specific stable version use korchi, jeta 20-bookworm-slim. Slim images are smaller and more secure.and erom version mention krechi karon jate jara docker e amr app run krbe tader ei version tai chole across all OS and environments. This ensures consistency and reduces the chance of code breakage in production due to different versions of Node.js.
FROM node:22-alpine

# Set app directory where your code lives in the container.
WORKDIR /app

# Install dependencies first to leverage Docker layer caching.

# Copy both package.json and package-lock.json only if it exists.
COPY package*.json ./  
# The --omit=dev flag tells npm to skip installing devDependencies, which are typically only needed during development and not in production. This helps reduce the size of the final image and minimizes potential security vulnerabilities by not including unnecessary packages.And package.json e dev dependy chara ja ache sob install maro
RUN npm ci --omit=dev

# Copy the rest of the source code as per the exact folder structure as it is in the owner's repository.
COPY . .

# Keep container port aligned with app default (PORT || 8000).
EXPOSE 8000
 
# command to run the server
CMD [ "npm", "start" ]