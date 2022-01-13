FROM ubuntu:18.04

ENV LANG=C.UTF-8
ENV TZ=Asia/Seoul
ENV DEBIAN_FRONTEND=noninteractive


RUN apt-get update -y
RUN apt-get install -y --no-install-recommends tzdata g++ git curl apt-utils
RUN apt-get install -y default-jdk default-jre
RUN apt-get install -y python3 python3-pip python3-dev
RUN apt-get install -y python-psycopg2
RUN apt-get install -y vim
RUN apt-get install cron
RUN cd /usr/local/bin && \
    ln -s /usr/bin/python3 python && \
    ln -s /usr/bin/pip3 pip && \
    pip3 install --upgrade pip
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN pip install jpype1-py3 konlpy
CMD bash <(curl -s https://raw.githubusercontent.com/konlpy/konlpy/master/scripts/mecab.sh)

COPY ./requirements.txt /code/requirements.txt

RUN apt-get install -y python3-pip
RUN pip install --upgrade pip
RUN pip install -r /code/requirements.txt
RUN python3 -c "import nltk; nltk.download(['punkt', 'averaged_perceptron_tagger'])"
#RUN python3 -m nltk.downloader punkt
#RUN python3 -m nltk.downloader averaged_perceptron_tagger

RUN touch /usr/sbin/entrypoint.sh
RUN chmod 777 /usr/sbin/entrypoint.sh

ENTRYPOINT ["/usr/sbin/entrypoint.sh"]
