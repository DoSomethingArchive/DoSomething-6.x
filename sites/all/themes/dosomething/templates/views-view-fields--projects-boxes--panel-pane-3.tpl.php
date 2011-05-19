<?php
// $Id: views-view-fields.tpl.php,v 1.6 2008/09/24 22:48:21 merlinofchaos Exp $
/**
 * @file views-view-fields.tpl.php
 * Default simple view template to all the fields as a row.
 *
 * - $view: The view in use.
 * - $fields: an array of $field objects. Each one contains:
 *   - $field->content: The output of the field.
 *   - $field->raw: The raw data for the field, if it exists. This is NOT output safe.
 *   - $field->class: The safe class id to use.
 *   - $field->handler: The Views field handler object controlling this field. Do not use
 *     var_export to dump this object, as it can't handle the recursion.
 *   - $field->inline: Whether or not the field should be inline.
 *   - $field->inline_html: either div or span based on the above flag.
 *   - $field->separator: an optional separator that may appear before a field.
 * - $row: The raw result object from the query, with all data it fetched.
 *
 * @ingroup views_templates
 */

  global $row_meta;
  if ( ! isset ( $row_meta[$view->name][$view->current_display]['rownum'] )) {
    $row_meta[$view->name][$view->current_display]['rownum'] = 1;
  } else {
    $row_meta[$view->name][$view->current_display]['rownum']++;
  }
  $row_number = $row_meta[$view->name][$view->current_display]['rownum'];

?>
<?php
  $has_video = 0;
  foreach ($fields as $id => $field): ?>
<?
  if ( $id == 'field_project_photo_fid' && $has_video ) {
    continue;
  } elseif ($id == 'field_embedded_video_embed' && $field->content) {
     $has_video = 1;
  } ?>
  <?php if (!empty($field->separator)): ?>
    <?php print $field->separator; ?>
  <?php endif; ?>

  <<?php print $field->inline_html;?> class="views-field-<?php print $field->class; ?>">
    <?php if ($field->label): ?>
      <label class="views-label-<?php print $field->class; ?>">
        <?php print $field->label; ?>:
      </label>
    <?php endif; ?>
      <?php
      // $field->element_type is either SPAN or DIV depending upon whether or not
      // the field is a 'block' element type or 'inline' element type.
      ?>
      <<?php print $field->element_type; ?> class="field-content"><?php
       if (($field->class == 'field-embedded-video-embed' || $field->class=='field-project-photo-fid')
            && $row_number == 1) {
              print str_replace('<img', '<img class="play" src="/sites/all/micro/projects/play-white.png"/> <img', $field->content);
       } else {
         print $field->content; }?></<?php print $field->element_type; ?>>
  </<?php print $field->inline_html;?>>
  <? if ($field->class == 'title-1' && $row_number > 1) {
       print '<hr>';
     } ?>
<?php endforeach; ?>