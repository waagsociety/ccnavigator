# UPDATE, JSONAPI patch not needed anymore in Drupal 8.6.x

Generally patching goes like this.
patch -d /var/www/mydrupaldir -p1 < mypatchfile.patch

## add_uuid_to_login_resp.patch : make REST login return a uuid for the user

This patch was used for REST login support which is currently not supported in the client.
Patch not tested in latest version. This patch is considered a HACK, probably new versions of Drupal/JSONAPI provides a workaround for this hack.
