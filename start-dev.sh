#!/bin/bash

docker start zookeeper || docker run -d --name zookeeper jplock/zookeeper:3.4.6
docker start kafka || docker run -d --name kafka --link zookeeper:zookeeper ches/kafka

ZK_IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' zookeeper)
export KAFKA_ADDR="$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' kafka):9092"
echo "kafka listening on $KAFKA_ADDR"
go build .
./convolvr


# docker run --rm ches/kafka kafka-topics.sh --create --topic test --replication-factor 1 --partitions 1 --zookeeper $ZK_IP:2181
# Created topic "test".
# In separate terminals:
# docker run --rm --interactive ches/kafka kafka-console-producer.sh --topic test --broker-list $KAFKA_IP:9092
# docker run --rm ches/kafka kafka-console-consumer.sh --topic test --from-beginning --zookeeper $ZK_IP:2181
