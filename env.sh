#!/bin/sh
sed -i 's|http://localhost:3000|'${BACKEND_URL}'|g' /usr/share/nginx/html/env.js
