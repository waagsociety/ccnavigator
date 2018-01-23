<?php

/**
 * @file
 * Contains \Drupal\json_field\Plugin\Field\FieldWidget\JSONTextareaWidget.
 */

namespace Drupal\json_field\Plugin\Field\FieldWidget;

use Drupal\Core\Field\Plugin\Field\FieldWidget\StringTextareaWidget;

/**
 * Plugin implementation of the 'json_textarea' widget.
 *
 * @FieldWidget(
 *   id = "json_textarea",
 *   label = @Translation("Json textarea (multiple rows)"),
 *   field_types = {
 *     "json"
 *   }
 * )
 */
class JSONTextareaWidget extends StringTextareaWidget {
}
