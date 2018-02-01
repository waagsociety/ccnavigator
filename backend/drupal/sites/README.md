# notes on using Drupal decoupled via REST and JSONAPI

## CORS

- `default/services.yml` was adapted to support CORS
- `default/settings.php` contains DB configuration

## Approach

- React stores user data in data field of user (JSONField module)

## Authentication (Drupal service):

https://www.drupal.org/docs/8/modules/json-api/what-json-api-does-not-do

### LOGIN
    POST http://127.0.0.1/user/login?_format=json
    data: {"name":"test1", "pass":"test1"}
    returns JSON containing creds and tokens

### STATUS
    GET http://127.0.0.1/user/login_status?_format=json
    returns 1 or 0

### LOGOUT (with logout token return from login)
    POST http://127.0.0.1/user/logout?_format=json&token=Z9Z92eq3cKog_y7g4oafuXIcxOvkpUhv9T79a6TOp8M
    should return with status code 204

## Saving and getting user data using JSON API (having uuid)

### retrieve
    GET http://127.0.0.1/jsonapi/user/user/0e20a953-d880-4193-a18e-12716ed37a76
    returns json user representations

### update (only post user data changes)
    PATCH http://127.0.0.1/jsonapi/user/user/0e20a953-d880-4193-a18e-12716ed37a76
    data:
    {
      "data": {
        "id": "af6506c2-9d19-4d1c-b22b-a12bc5168753",
        "attributes": {
          "field_preferences": "bla"
        }
      }
    }
    Headers:
    Accept: application/vnd.api+json
    Content-Type:application/vnd.api+json

## JSON API examples

    http://127.0.0.1/jsonapi/node/tool?filter[f1][path]=title&filter[f1][value]=knuff&filter[f1][operator]=CONTAINS
    http://127.0.0.1/jsonapi/node/tool?filter[f2][path]=field_category.name&filter[f2][value]=team&filter[f2][operator]=CONTAINS
    http://127.0.0.1/jsonapi/node/tool?filter[field_category.uuid][value]=ba361f0b-01af-4ce3-b039-253d03f0fcec
    http://127.0.0.1/jsonapi/user/user?filter[uid][value]=2
    http://127.0.0.1/jsonapi/taxonomy_term/category?filter[parent.uuid][value]=6cec371d-6597-4332-a300-c6fed37b3ab0

    include relationships like:
    http://l2thel.local/jsonapi/node/tool?include=field_category
    get only title field:
    http://l2thel.local/jsonapi/node/tool?fields[node--tool]=title
    get nodes by nid:
    http://l2thel.local/jsonapi/node/tool?filter[nid][value]=2
    multiple:
    http://l2thel.local/jsonapi/node/tool?filter[nodes][condition][path]=nid&filter[nodes][condition][operator]=IN&filter[nodes][condition][value][]=1&filter[nodes][condition][value][]=2

## Using REST with views
    http://127.0.0.1/nl/[view-name]/feed
    http://127.0.0.1/[view-name]/feed
