실행 시
docker-compose up -d

도커에 진입 시
docker exec -it cron-img-d /bin/bash

생성 후 nltk 를 설치한다면 /usr/loca/lib/python3.6/dist-packages/konlpy/jvm.py 의 convertStrings 를 주석처리해라.
