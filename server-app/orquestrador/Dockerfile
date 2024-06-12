FROM node:16 as builder

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

FROM node:16

WORKDIR /home/node/app

COPY --from=builder /home/node/app .

# Add a new "nodejs" user and switch to it
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs

# Change ownership to the non-root "nodejs" user
RUN chown -R nodejs:nodejs /home/node/app

# Switch to non-root user "nodejs"
USER nodejs

# Set broader write permissions to allow "nodejs" user to create directories/files
RUN chmod -R 775 /home/node/app

EXPOSE 5014

# Set your start command
CMD [ "node", "dist/main.js" ]