# Configuring Apache for CORS
The origin of the front-end React app must match

<pre><code>
Header set Access-Control-Allow-Origin "http://l2thel.local:3000"
Header set Access-Control-Allow-Credentials "true"
Header set Access-Control-Allow-Headers "X-Accept-Charset,X-Accept,Content-Type,Authorization,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers"
</pre></code>

# Drupal installation

Drupal core 8.4.0 with MariaDB

## patches

Required patches are in `drupal/patches`

## modifications

- HACKED `UserAuthenticationController.php` to return uuid

  Getting the uuid from the logged in user is quite inconvenient in Druapl. For that purpose the login response was extended in order to make it return the user entity id (uuid) besides the normal user id.

<pre><code>
    modules/user/src/Controller/UserAuthenticationController.php
    ...
    public function login(Request $request)
    if ($user->get('uuid')->access('view', $user)) { //HACK: LL
	      $response_data['current_user']['uuid'] = $user->get('uuid')->value;
    }
    ...
</pre></code>

## setup

- Site specific stuff is in `drupal/sites` directory. Symlink the `sites` directory of your Drupal installation to it.
- a commandline to like `drush` or `drupalconsole` is recommended to import the database.
