# some patches are required to fix Drupal 8.4.0

Generally patching goes like this.
patch -d /var/www/mydrupaldir -p1 < mypatchfile.patch 

## 2543726-216.patch : make JSON api include hierarchy in taxonomy_term vocabularies

This patch works with Drupal release 8.4.0. Don't forget to `drush updb` afterwards.
The patch doesn't seem to work when the HAL modules is enabled.
