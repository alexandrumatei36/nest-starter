#!/bin/bash

npm i
npm run db:migration:run
npm run test:e2e
