ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

.PHONY: stringer-admin
stringer-admin: clean install-deps
	yarn --cwd ./server build
	yarn --cwd ./frontend build
	mv ./frontend/build ./dist/frontend/

.PHONY: install-deps
install-deps:
	yarn --cwd ./server
	yarn --cwd ./frontend

.PHONY: clean
clean:
	rm -rf dist

.PHONY: lint
lint:
	yarn --cwd ./frontend lint
	yarn --cwd ./server lint

.PHONY: lint-fix
lint-fix:
	yarn --cwd ./server lint --fix
	yarn --cwd ./frontend lint --fix

# docker-starts should be called to start the dev server.
.PHONY: docker-start
docker-start:
	docker-compose -f docker-compose.yml -f docker-compose-ports.yml up frontend server

# docker-rebuild will only need to be called when you have made changes
# to the Dockerfile or add new node dependencies. Not calling this
# on every start should speed up the dev start process.
.PHONY: docker-rebuild
docker-rebuild:
	docker-compose build --pull

# docker-nuke should be used to kill and remove the created docker images. This
# can be used to get a fresh database or when things have gone funky.
.PHONY: docker-nuke
docker-nuke:
	docker-compose down

# docker-yarn-install can be used to install dependencies in your already running container.
# It's useful for when you have added a new dependency and already have the containers running
# with docker-start. Running docker-yarn-install in another terminal window will make the
# containers update their deps.
.PHONY: docker-yarn-install
docker-yarn-install:
	docker-compose exec frontend yarn --cwd ./frontend install
	docker-compose exec server yarn --cwd ./server install
	@ make docker-rebuild > /dev/null 2>&1 &
	@ echo "Dependencies have been updated in your local container. We're also rebuilding your docker image in the background."

.PHONY: docker-yarn-cache
docker-yarn-cache:
	@ echo "Saving docker yarn cache (may take a few minutes)..."
	@docker-compose run -v $$(pwd):/app --entrypoint=/bin/tar frontend -caf /app/.docker-yarn-cache -C /usr/local/share/.cache/yarn/v4 .
