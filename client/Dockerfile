FROM alpine:3.4

# Update & install required packages
RUN apk add --update nodejs bash git

# Set work directory to /www
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY gp-mrp-webapp/package.json .
RUN apk --no-cache add --virtual builds-deps build-base python && \
    npm install && npm rebuild bcrypt --build-from-source && apk del builds-deps

# Copy app source
COPY gp-mrp-webapp/ .
RUN npm run build

#Install and confugure gsutil
RUN apk add --update \
    python \
    py-pip \
    py-cffi \
    py-cryptography \
  && pip install --upgrade pip \
  && apk add --virtual build-deps \
    gcc \
    libffi-dev \
    python-dev \
    linux-headers \
    musl-dev \
    openssl-dev \
  && pip install gsutil \
  && apk del build-deps \
  && rm -rf /var/cache/apk/*
RUN ln -s /root/boto/.boto /root/.boto; \
ln -s /root/boto/gcs.json /root/gcs.json
