<?php

$current_path = drupal_get_path_alias(request_uri());
$last_path_item = array_pop(explode('/', $current_path));

drupal_add_js(path_to_theme().'/js/FB.Share', 'theme', 'footer', TRUE);

$is_plan = preg_match('|^/epic-book-drive/sign-up/|', $current_path);
$node_prefix = '';
if ($is_plan) {
  $node_prefix .= '<h2>'.$title.'</h2>';
  $boxes = $node->field_what_is_your_goal_number_[0]['value'];
  if ($boxes) {
    $node_prefix .= '<p><br/><strong>Boxes pledged: </strong>'.$boxes.'</p>';
  }
}
?>

<div class="node <?=$node->type.' '.$last_path_item;?>">
   <div class="body">
    <div class="body-text">
    <? 
      print $node_prefix.$node->content['body']['#value'];
     ?>
    </div>
   </div>
</div>