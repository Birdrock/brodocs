FROM node:7.2.0

MAINTAINER Phillip Wittrock <pwittroc@google.com>

ADD . /brodocs
WORKDIR /brodocs

RUN npm install

CMD ./runbrodocs.sh
