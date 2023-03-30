# CCN to docker

## local install

```
docker-compose up -d
```

**db import**

```
# clean
docker exec -w /var/www/drupal -i ccn-cms bash -c './vendor/bin/drush sql-dump | grep "DROP TABLE IF EXISTS" | ./vendor/bin/drush sql-cli'
# import
gunzip -c db.sql.gz | docker exec -w /var/www/drupal -i ccn-cms bash -c './vendor/bin/drush sqlc'
# or
cat ccn.sql | docker exec -w /var/www/drupal -i ccn-cms bash -c './vendor/bin/drush sqlc'
# then rebuild db
docker exec -it ccn-db bash -c 'mysqlcheck -u root -o ccn -p'
#
docker exec -w /var/www/drupal -i ccn-cms bash -c './vendor/bin/drush cr'
```

**troubleshooting**

Might need to `chown -R www-data:www-data` Drupal files directory.


## N.B.

#### Drupal 9 seems to have trouble with JSONAPI filters, overloads mariadb

* have the following line in `settings.php` (generated from Dockerfile)

```
$databases['default']['default']['init_commands']['optimizer_search_depth'] = 'SET SESSION optimizer_search_depth = 7';
```

* enter the db container and do this to recreate the tables:

```
> mysqlcheck -u root -o ccn -p
```

#### Drupal in a subdirectory behind Nginx proxy

Could not find wanted solution (having Drupal run in the web root of the container) and having a sub path only in Nginx conf.
However what works is: having Drupal in a subdirectory of the webroot of the container and proxying the original path to Drupal.

**Nginx conf snippet**

```
server {
        server_name ccn.waag.org;

        location / {
           proxy_pass http://127.0.0.1:9206;
           proxy_redirect off;
           proxy_set_header Host               $host;
           proxy_set_header X-Real-IP          $remote_addr;
           proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto  https;

           client_max_body_size 256M;
        }

        location /drupal/ {
          proxy_pass http://127.0.0.1:9205;
          proxy_redirect off;

          proxy_set_header Host               $host;
          proxy_set_header X-Real-IP          $remote_addr;
          proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto  https;

          client_max_body_size 256M;
        }

        listen 443 ssl;
        ssl_certificate /etc/letsencrypt/live/ccn.waag.org/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/ccn.waag.org/privkey.pem;
}

server {
        listen 80;
        server_name ccn.waag.org;
        rewrite ^ https://$server_name$request_uri? permanent;
}
```

#### Mail

```
chown www-data:www-data /etc/msmtprc
chmod 400 /etc/msmtprc
```

#### Run development inside container

```
REACT_APP_API_ENDPOINT="http://127.0.0.1:9205/drupal" npm start
```
