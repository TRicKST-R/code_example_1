FROM alpine:3.4

# Update & install required packages
RUN apk add --update nodejs bash git

# Set work directory to /www
WORKDIR /www
# Install app dependencies
COPY gp-mrp-api-gateway/package.json .
RUN apk --no-cache add --virtual builds-deps build-base python && \
    npm install && npm rebuild bcrypt --build-from-source && apk del builds-deps

# Copy app source
COPY gp-mrp-api-gateway/ .

# set your port
ENV PORT 80

# expose the port to outside world
EXPOSE  80

# start command as per package.json
CMD ["npm", "start"]
