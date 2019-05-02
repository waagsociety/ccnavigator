<?php

namespace Drupal\ccn_coaching\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Language\Language;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form controller for the content_message entity edit forms.
 *
 * @ingroup ccn_coaching
 */
class CCNMessageForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    /* @var $entity \Drupal\ccn_coaching\Entity\CCNMessage */
    $form = parent::buildForm($form, $form_state);
    $entity = $this->entity;
    $form['langcode'] = [
      '#title' => $this->t('Language'),
      '#type' => 'language_select',
      '#default_value' => $entity->getUntranslated()->language()->getId(),
      '#languages' => Language::STATE_ALL,
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $form_state->setRedirect('entity.ccn_message.collection');
    $entity = $this->getEntity();
    $entity->save();
  }

}
