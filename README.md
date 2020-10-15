# task.bz



##pm2 start
```
NODE_ENV=production PORT=1111 pm2 start server/index.jsx --name burse --interpreter ./node_modules/.bin/babel-node
```

##nginx config

```
server {
    client_max_body_size 10m;
    server_name 359848-cy32947.tmweb.ru www.359848-cy32947.tmweb.ru;
    error_log /var/log/nginx/task.bz.error.log;
    location / {
        proxy_pass http://91.210.168.196:1111;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

##docker 

local
```
docker run --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres
docker ps -a // список контейнеров
docker start d69940715251 // запустить контейнер
```

```
docker run --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v /var/www/project/docker_postgres:/var/lib/postgresql/data postgres
```
