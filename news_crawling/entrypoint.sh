#!/bin/bash

chmod 644 /etc/cron.d/root
chown root:root /etc/cron.d/root

cron

while :
do
  sleep 600
done
