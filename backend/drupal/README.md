# installation

> drupal > composer install

# `patches` directory

Contains some patches to fix Drupal bugs that we can't wait for the be fixed in upcoming core release.

# `db` directory

Contains sql database dump

# development

In development mode it's handy to run the REACT client hosted by node (npm start). For this the CORS setting in Drupal services.yml need to be adapted. Apache settings as well.

> \#REQUIRED FOR CORS  
> Header set Access-Control-Allow-Origin "http://localhost:3000"  
> Header set Access-Control-Allow-Credentials "true"  
> Header set Access-Control-Allow-Headers "X-Accept-Charset,X-Accept,Content-Type,Authorization,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,X-CSRF-Token"

# deploy

For deployment drupal needs to be placed in a subdir of the web root (which contains the react app).

> \#WEB DIRECTORY LIKE THIS:  
> drupal@ -> drupal-latest/web  
> drupal-latest/  
> index.html
