FROM ubuntu:14.04
MAINTAINER Johannes Brosi <me@brosi.me>

RUN echo "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) main restricted universe multiverse" > /etc/apt/sources.list
RUN echo "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc)-updates main restricted universe multiverse" >> /etc/apt/sources.list
RUN echo "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc)-security main restricted universe multiverse" >> /etc/apt/sources.list

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get -y install libc6-dev build-essential software-properties-common git
RUN add-apt-repository -y ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get -y install nodejs

#maybe add this later for caching
#ADD package.json /tmp/package.json
#RUN cd /tmp && npm install
#run mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app


WORKDIR /opt/app

ADD . /opt/app


EXPOSE 8080

ENTRYPOINT ["/usr/bin/node", "/opt/app/build/ccide_server.js"]

CMD ["--help"]
