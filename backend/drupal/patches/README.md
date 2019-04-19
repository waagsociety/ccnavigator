# some patches are required to fix Drupal

Generally patching goes like this.
patch -d /var/www/mydrupaldir -p1 < mypatchfile.patch

## 2543726-309.patch : make JSON api include hierarchy in taxonomy_term vocabularies

*NOT NEEDED ANYMORE IN 8.6.x*  
This patch works with Drupal release 8.5.3. Don't forget to `drush updb` afterwards.
The patch doesn't seem to work when the HAL modules is enabled.
