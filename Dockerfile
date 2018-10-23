# FROM node:alpine
FROM node
ENV NPM_CONFIG_LOGLEVEL info

# dependencies
# RUN apk add  --no-cache poppler-utils \
#   unrtf \
#   antiword \
#   catdoc \
#   xpdf \
#   tesseract-ocr

# Allow execution at install
RUN echo exit 101 > /usr/sbin/policy-rc.d && \
  # Setup timezone
  echo 'Europe/Paris' > /etc/timezone && dpkg-reconfigure tzdata && \
  # Server dependencies
  apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    openssh-client \
    dirmngr \
    gnupg2 \
  # Project dependencies
    apt-utils \
    poppler-utils \
    unrtf \
    antiword \
    catdoc \
    xpdf \
    tesseract-ocr \
  # Clean up
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/

RUN npm install

# Bundle the remaining of the app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]
