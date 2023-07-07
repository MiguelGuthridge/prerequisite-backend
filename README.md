# Waydriver Backend

Waydriver is a cutting-edge task management system. For more info about it,
visit the project's [main page](https://github.com/Waydriver).

This repository contains the code for the backend, which is written with
TypeScript, using the Express framework.

## Running the backend

1. `git clone` the project
2. `npm install`
3. Create a `.env` file by copying `.env_example`, then modify as required
4. `npm run dev`

### Running in production

I haven't thought about this yet, check back later. I might put together a nice
Docker system or something.

## This is a work in progress

I'm planning to continue working on this in my spare time. Currently, it is not
in a workable state, and probably won't be for some time (there isn't even a
frontend yet). Hopefully it'll be ready to try out soon!

## Roadmap

These are the things I'm hoping to tackle on the backend, in no particular
order:

* [X] Basic task management
* [ ] Path-finding algorithm for suggesting tasks.
* [ ] Task dimensions (eg, estimated time, priority, number of spoons, maybe
      custom dimensions as well)
* [ ] Path-finding algorithm that lets users prioritise dimensions
* [ ] Use a proper database, preferably something that plays nice with
      TypeScript?
* [ ] Create some kind of validation system for the API that is more reliable,
      perhaps using [express-openapi-validator](https://github.com/cdimascio/express-openapi-validator#readme)
      with a `swagger.yaml` or something?

I'm not sure where I'll go from there - this project is primarily designed to
match my own needs for a task management system, so after I've got the basic
stuff working, I'll add things as I see fit.
