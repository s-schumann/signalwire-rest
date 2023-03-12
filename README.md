Signalwire REST
===============

Module for showcasing the interaction with the Signalwire RESTful LaML API. It makes use of the SDK and uses Axios for making an HTTP request.

# Using Docker 

To build the Docker image use the following commands (adapt with your respective tags):

```shell
docker build --tag signalwire-rest .
docker build -t schumann/signalwire-rest .
```

We can push or run/stop the container with the commands below.
```shell
docker push schumann/signalwire-rest:latest
docker run --env-file .env -p 30000:3000 signalwire-rest
docker ps
docker stop <container_id>
```

Pushing this build is fine for testing but won't run in most external environments.
Running the container makes its exposed content available to, e.g., `http://localhost:30000`.

To build on MacOS we should consider that a published image needs a different platform. We can use `buildx` for that:

```shell
docker buildx create --use
docker buildx build --platform linux/amd64 --push -t schumann/signalwire-rest .
```

The `buildx create` command has to be used only once. Then we can build for (the typically used) 64-bit Linux, for example.

Copyright (c) Sebastian Schumann, 2023
