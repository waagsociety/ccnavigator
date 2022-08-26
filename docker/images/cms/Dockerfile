FROM php:8.1-apache

# import some build stage environment variables from compose file for substituting vars in template files
ARG MAIL_USER
ARG MAIL_PASS
RUN echo "MSMTP_USER $MAIL_USER"
RUN echo "MSMTP_USER $MAIL_PASS"

# import for settings.php
ARG MYSQL_USER
ARG MYSQL_PASS
ARG MYSQL_DB
ARG MYSQL_HOST

RUN a2enmod rewrite
# mod headers is needed for CORS, CORS is needed for some local development setups
RUN a2enmod headers

# install some things we need
RUN apt-get update && apt-get install -y rsync git unzip zip mariadb-client nano msmtp gettext wget uuid-runtime

# install php extensions
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions gd pdo_mysql bcmath zip intl opcache

# install composer
COPY --from=composer:2.0 /usr/bin/composer /usr/local/bin/composer

# copy apache conf
COPY images/cms/apache/sites-enabled/site.conf /etc/apache2/sites-available/site.conf

# enable apache conf
RUN a2dissite 000-default.conf
RUN a2ensite site.conf

# required for composer to create cache dir
RUN chown -R www-data:www-data /var/www

# copy site source
COPY --chown=www-data:www-data images/cms/composer /var/www/drupal

USER www-data
WORKDIR /var/www/drupal

# install drupal core, mods and dependencies
RUN composer install

# make sym link to have Drupal in sub directory
RUN ln -s web drupal

# files dir should be there
RUN mkdir -p /var/www/drupal/web/sites/default/files

# concat settings to default settings
RUN cp web/sites/default/default.settings.php web/sites/default/settings.php
ARG settings=web/sites/default/settings.php
RUN echo '//Added from Dockerfile' >> $settings
RUN echo '$settings['"'"reverse_proxy"'"'] = TRUE;' >> $settings
RUN echo '$settings['"'"reverse_proxy_addresses"'"'] = [@$_SERVER['"'"REMOTE_ADDR"'"']];' >> $settings
RUN echo '$settings['"'"hash_salt"'"'] = '"'"`uuidgen`"'"';' >> $settings
RUN echo '$databases['"'"default"'"']['"'"default"'"'] = array (' >> $settings
RUN echo '  '"'"database"'"' => '"'"$MYSQL_DB"'"',' >> $settings
RUN echo '  '"'"username"'"' => '"'"$MYSQL_USER"'"',' >> $settings
RUN echo '  '"'"password"'"' => '"'"$MYSQL_PASS"'"',' >> $settings
RUN echo '  '"'"prefix"'"' => '"'""'"',' >> $settings
RUN echo '  '"'"host"'"' => '"'"$MYSQL_HOST"'"',' >> $settings
RUN echo '  '"'"port"'"' => '"'"3306"'"',' >> $settings
RUN echo '  '"'"namespace"'"' => '"'"Drupal\\Core\\Database\\Driver\\mysql"'"',' >> $settings
RUN echo '  '"'"driver"'"' => '"'"mysql"'"',' >> $settings
RUN echo ');' >> $settings
RUN echo '$settings['"'"trusted_host_patterns"'"'] = array (' >> $settings
RUN echo '  '"'"'^.*?.\.waag\.org$'"'"',' >> $settings
RUN echo '  '"'"'^127\.0\.0\.1$'"'"',' >> $settings
RUN echo '  '"'"'^localhost$'"'"',' >> $settings
RUN echo '  '"'"'^ccn\.local$'"'"'' >> $settings
RUN echo ');' >> $settings

# special sql setting for complex JSONAPI queries
RUN echo '$databases['"'"default"'"']['"'"default"'"']['"'"init_commands"'"']['"'"optimizer_search_depth"'"'] = '"'"SET SESSION optimizer_search_depth = 7"'"';' >> $settings
RUN echo '$settings['"'"config_sync_directory"'"'] = '"'"../config/sync"'"';' >> $settings

# create a services YAML file for CORS
ARG services=web/sites/default/services.yml
RUN echo '# Created from Dockerfile' >> $services
RUN echo 'parameters:' >> $services
RUN echo '  cors.config:' >> $services
RUN echo '    enabled: true' >> $services
RUN echo '    allowedHeaders: ['"'"content-type"'"','"'"accept"'"','"'"origin"'"','"'"x-requested-with"'"', '"'"access-control-allow-origin"'"','"'"x-allowed-header"'"']' >> $services
RUN echo '    allowedMethods: ['"'"*"'"']' >> $services
RUN echo '    allowedOrigins: ['"'"'https://ccn.waag.org'"'"','"'"'https://cmk.cities4people.eu'"'"','"'"'http://ccn.local'"'"']' >> $services
RUN echo '    allowedOriginsPatterns: ['"'"'#^.*?127\.0\.0\.1.*$#'"'"']' >> $services
RUN echo '    exposedHeaders: false' >> $services
RUN echo '    maxAge: false' >> $services
RUN echo '    supportsCredentials: false' >> $services

# put back www-data as owner for files volume, somehow mostly does not work and needs to done in running container once
USER root
RUN chown -R www-data:www-data /var/www/drupal/web/sites/default/files
