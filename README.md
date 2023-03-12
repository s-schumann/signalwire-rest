Signalwire REST
===============

Module for showcasing the interaction with the Signalwire RESTful LaML API.

# Using Docker 

To build the Docker image use the following commands:

```bash
docker build --tag signalwire-rest .
docker build -t schumann/signalwire-rest .
```

We can push or run the image now.
```bash
docker push schumann/signalwire-rest:latest
docker run --env-file .env -p 30000:3000 signalwire-rest
```

Pushing this build is fine for testing but won't run in most external environments.
Running the container makes its exposed content available to `http://localhost:30000`.

To build on MacOS we should consider that a published image needs a different platform. We can use `buildx` for that:

```bash
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 --push -t schumann/signalwire-rest .
```

Copyright (c) Sebastian Schumann, 2023
