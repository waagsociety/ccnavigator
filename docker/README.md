# CCN docker

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
# then
docker exec -it ccn-db bash -c 'mysqlcheck -u root -o ccn -p'
```

## N.B.

### Drupal 9 seems to have trouble with JSONAPI filters, overloads mariadb

https://www.drupal.org/project/drupal/issues/3022864

To make queries like the following work

```
http://127.0.0.1:9205/jsonapi/node/tool?filter[a][group][conjunction]=OR&filter[a1][condition][path]=field_facilitator_participant.id&filter[a1][condition][value]=065cfb65-0fc6-49d6-a7e7-791c3d4faa4f&filter[a1][condition][memberOf]=a&filter[b][group][conjunction]=OR&filter[b1][condition][path]=field_group_size.id&filter[b1][condition][value]=3c24410d-f30f-43c1-b74f-8cb96ff2bfd1&filter[b1][condition][memberOf]=b&filter[b2][condition][path]=field_group_size.id&filter[b2][condition][value]=2e85c40a-5bb7-4d45-8979-6791b14fd769&filter[b2][condition][memberOf]=b&filter[c][group][conjunction]=OR&filter[c1][condition][path]=field_duration.id&filter[c1][condition][value]=72208106-699f-4a29-870a-1bd0f6d9ea1c&filter[c1][condition][memberOf]=c&filter[d][group][conjunction]=OR&filter[d1][condition][path]=field_experience_level.id&filter[d1][condition][value]=0e26463b-c93a-4cfb-96d2-ed49b2da9c43&filter[d1][condition][memberOf]=d&filter[e][group][conjunction]=OR&filter[e1][condition][path]=field_online_offline.id&filter[e1][condition][value]=f06f71c8-9bb3-44d0-8a1c-4f76eeba4324&filter[e1][condition][memberOf]=e&fields[node--tool]=title,field_category&page[offset]=0&sort=-changed
```

* have the following line in `settings.php` (generated from Dockerfile)

```
$databases['default']['default']['init_commands']['optimizer_search_depth'] = 'SET SESSION optimizer_search_depth = 7';
```

* enter the db container and do this to recreate the tables:

```
> mysqlcheck -u root -o ccn -p
```

### Drupal in a subdirectory behind Nginx proxy

Could not find wanted solution (having Drupal run in the web root of the container) and having a sub path only in Nginx conf.
However what works is: having Drupal in a subdirectory of the webroot of the container and proxying the original path to Drupal.

**Nginx conf snippet**

```
server {
  server_name ccn.local;

  location /drupal/ {
      proxy_pass http://127.0.0.1:9205;
      proxy_redirect off;

      proxy_set_header Host               $host;
      proxy_set_header X-Real-IP          $remote_addr;
      proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto  https;

      client_max_body_size 256M;
  }
  listen 80;
}
```

### Run development inside container

```
REACT_APP_API_ENDPOINT="http://127.0.0.1:9205/drupal" npm start
```
