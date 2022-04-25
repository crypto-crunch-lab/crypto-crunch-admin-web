#!/bin/bash

pm2 delete all

npm install
npm run build
pm2 start npm --name "next" -- start