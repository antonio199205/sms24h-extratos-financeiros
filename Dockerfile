FROM --platform=linux/amd64 node:alpine
workdir /app
copy . .
CMD ["sh", "-c", "sleep 1 && node app.js"]
