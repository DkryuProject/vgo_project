#!/bin/sh

DATE=`date +%Y%m%d-%H%M%S`
PROCESS=`ps -ef|grep 'api-vengine-V1.jar' | wc | awk '{print $1}'`

if [ $PROCESS -gt 1 ]
then
	PID=`ps -ef | grep "api-vengine-V1.jar" | grep -v grep | awk '{print $2}'`
	kill -9 $PID
	echo "$DATE : Vengine Api (PID : $PID) has been stopped."
else
	echo "$DATE : Vengine Api is not running."
fi

java -jar -Dspring.profiles.active=dev /home/ubuntu/vengine/target/api-vengine-V1.jar > /dev/null &

