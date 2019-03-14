# GrubGrab Server

Welcome to the grubgrab api

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. Ask @msajaffe about deployment and ssh keys.

### Installing

How to get it running

If you haven't created a local postgres db called grubgrab, do that now

```
(install postgres & create db)[https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb]
```

Install dependencies

```
yarn
```

Run server

```
yarn dev
```
Should be running at localhost:9010

If first time running, you'll also want to run the migrations

```
yarn migrate
```
