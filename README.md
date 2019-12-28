# 2k20 website

> Website for 2k20 NYE hat message submissions

## Running locally

In production we run the service inside of docker and we do the same when running locally. When running locally we watch for file changes and automatically rebuild and restart the service when detected.

You can start the local development server by running the following.

```
make docker-start
```

### But `make docker-start` doesn't nuke everything before starting...

We shouldn't need to remove and destroy everything every time we launch a docker container, it makes starting the containers extremely slow. Instead when running locally the source files are mounted into the container using volumes, this means your code changes will be reflected in your container without needing to rebuild the container from scratch.

#### Gotcha: Adding a new npm package

The `node_modules` folder is not mounted as a volume inside the docker container, this is to avoid issues with package that are compiled for a specific OS. This means that when you add a new package you will need to tell the container to reinstall the packages.

You can do this using the following command.

```
make docker-yarn-install
```

#### Gotcha: Changes to the Dockerfile

If you make changes to the Dockerfile for those changes reflected you will need to rebuild the containers.

You can do this using the following command.

```
make docker-rebuild
```

#### I still want to nuke everything.

Ok. Sometimes it's useful to nuke everything, say if something has gone wrong or you want a clean fresh build.

You can use the following command:

```
make docker-nuke
```

### Why have two containers for frontend and server?

When running locally (and only when running locally) we spin up two containers, one for the frontend and one for the server.

Having the frontend and server as two separate containers gives us the ability to hot reload the frontend and server independently, this means your code changes will appear much quicker.
