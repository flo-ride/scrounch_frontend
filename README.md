# Scrounch Frontend
> By Florian 'FloRide' Reimat

# About

**Scrounch Frontend** is the user-facing web application built with **Vue 3** and **TypeScript** for the Scrounch platform. This project leverages modern web development practices, offering a responsive and interactive interface for managing beverage sales. It communicates seamlessly with the Scrounch Backend, which handles business logic and data persistence.

Key features include:

## Usage
### Manual
```sh
# Dependencies (Optional)
nix develop

npm install

npm run build
```

### Docker

```sh
docker build -t <your-image-name> .

docker run <your-image-name>
```

> [!TIP]
> You can also look at [DockerHub](https://hub.docker.com/r/floride/scrounch_frontend) for the official image:
> | tag | Explanation |
> |----------|-----------------------------------------|
> | master | The master branch of github (not safe) |
> | latest | The latest safest version (recommended) |
> | vX.X.X | The image version |
