
default: build-engine

compose-build:
	docker-compose build

compose-up:
	docker-compose up -d

build:
	make -C cmd/engine build

up: build compose-build compose-up

.PHONY: build-engine
