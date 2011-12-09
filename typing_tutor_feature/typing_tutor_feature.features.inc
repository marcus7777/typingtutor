<?php
/**
 * @file
 * typing_tutor_feature.features.inc
 */

/**
 * Implements hook_node_info().
 */
function typing_tutor_feature_node_info() {
  $items = array(
    'typing_tutor' => array(
      'name' => t('Typing Tutor'),
      'base' => 'node_content',
      'description' => t('A Typing Tutor'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  return $items;
}
