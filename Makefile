
default: build

compose-build:
	docker-compose build

compose-up:
	docker-compose up -d

build:
	make -C cmd/engine build
	make -C cmd/user build

up: build compose-build compose-up

.PHONY: compose-build compose-up build up
