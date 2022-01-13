#!/bin/sh
 
DATE=`date +%Y%m%d-%H%M%S`
 
PROCESS=`ps -ef|grep 'invoice-job-v1.jar' | wc | awk '{print $1}'`
 
 
if [ $PROCESS -gt 1 ]
then
	PID=`ps -ef | grep "invoice-job-v1.jar" | grep -v grep | awk '{print $2}'`
	kill -9 $PID
	echo "$DATE : Vengine Batch (PID : $PID) has been stopped." 
else
	echo "$DATE : Vengine Batch is not running."
fi

java -jar -Dspring.profiles.active=dev /home/ubuntu/vengine/target/invoice-job-v1.jar > /dev/null &
