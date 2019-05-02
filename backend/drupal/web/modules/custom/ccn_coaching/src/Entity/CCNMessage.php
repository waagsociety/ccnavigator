<?php

namespace Drupal\ccn_coaching\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\ccn_coaching\CCNMessageInterface;
use Drupal\user\UserInterface;
use Drupal\Core\Entity\EntityChangedTrait;

/**
 *
 * @ContentEntityType(
 *   id = "ccn_message",
 *   label = @Translation("CCN message entity"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\ccn_coaching\Entity\Controller\CCNMessageListBuilder",
 *     "form" = {
 *       "add" = "Drupal\ccn_coaching\Form\CCNMessageForm",
 *       "edit" = "Drupal\ccn_coaching\Form\CCNMessageForm",
 *       "delete" = "Drupal\ccn_coaching\Form\CCNMessageDeleteForm",
 *     },
 *     "access" = "Drupal\ccn_coaching\CCNMessageAccessControlHandler",
 *   },
 *   list_cache_contexts = { "user" },
 *   base_table = "ccn_message",
 *   admin_permission = "administer ccn_coaching entity",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid"
 *   },
 *   links = {
 *     "canonical" = "/ccn_coaching/message/{ccn_message}",
 *     "edit-form" = "/ccn_coaching/message/{ccn_message}/edit",
 *     "delete-form" = "/ccn_coaching/message/{ccn_message}/delete",
 *     "collection" = "/ccn_coaching/message/list"
 *   },
 *   field_ui_base_route = "entity.ccn_message.admin_form",
 * )
 */
class CCNMessage extends ContentEntityBase implements CCNMessageInterface {

  /**
   * {@inheritdoc}
   *
   * Define the field properties here.
   *
   * Field name, type and size determine the table structure.
   *
   * In addition, we can define how the field and its content can be manipulated
   * in the GUI. The behaviour of the widgets used can be determined here.
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {

    // Standard field, used as unique if primary index.
    $fields['id'] = BaseFieldDefinition::create('integer')
      ->setLabel(t('ID'))
      ->setDescription(t('The ID of the entity.'))
      ->setReadOnly(TRUE);

    // Standard field, unique outside of the scope of the current project.
    $fields['uuid'] = BaseFieldDefinition::create('uuid')
      ->setLabel(t('UUID'))
      ->setDescription(t('The UUID of the entity.'))
      ->setReadOnly(TRUE);

    // Label for the message.
    $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Name'))
      ->setDescription(t('The name of the ccn message.'))
      ->setSettings([
        'max_length' => 255,
        'text_processing' => 0,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield'
      ])
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'string'
      ])
      ->setDefaultValue(NULL);

    $fields['subject'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Subject'))
      ->setDescription(t('The subject of this message, always treated as non-markup plain text.'))
      ->setRequired(TRUE)
      ->setTranslatable(TRUE)
      ->setSettings(array(
        'default_value' => '',
        'max_length' => 255,
      ))
      ->setDisplayOptions('form', [
        'type' => 'string_textfield'
      ])
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string'
      ]);

    $fields['body'] = BaseFieldDefinition::create('text_long')
      ->setLabel(t('Body'))
      ->setDescription(t('The body of the message'))
      ->setRequired(TRUE)
      ->setTranslatable(TRUE)
      ->setDisplayOptions('form', [
        'type' => 'string_textfield'
      ])
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string'
      ]);

    $fields['langcode'] = BaseFieldDefinition::create('language')
      ->setLabel(t('Language code'))
      ->setDescription(t('The language code of message.'));

    return $fields;
  }

}
