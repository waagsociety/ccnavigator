<?php

namespace Drupal\ccn_coaching;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\user\EntityOwnerInterface;
use Drupal\Core\Entity\EntityChangedInterface;

/**
 * Provides an interface defining a CCNMessage entity.
 *
 * We have this interface so we can join the other interfaces it extends.
 *
 * @ingroup ccn_coaching
 */
interface CCNMessageInterface extends ContentEntityInterface {

}
