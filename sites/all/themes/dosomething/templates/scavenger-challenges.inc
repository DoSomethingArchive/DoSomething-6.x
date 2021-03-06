<?
include 'sites/all/themes/dosomething/templates/scavenger-globals.inc';

$available_challenge_selections = array();
global $available_challenge_selections;
foreach ($challenges as $i => $c) {
  if ($i > $current_day) {
    break;
  }
  $available_challenge_selections[$i] = 'Day '.$i.' - '.$c['name'];
}

krsort($available_challenge_selections);

$found_team = 0;

global $team_names;

if (isset($_POST['email_or_cell'])) {

  //Sanitize user input
  $email_or_cell = $_POST['email_or_cell'];
  if (! preg_match('/@/', $email_or_cell)) {
    $email_or_cell = preg_replace('/[^0-9]*/','',$email_or_cell);
  }
  $email_or_cell = trim($email_or_cell);

 if ($email_or_cell) {
    $query = db_query("
     select title,l.city,l.province,l.postal_code
      from node n
      inner join location_instance li on n.nid=li.nid and n.vid=li.vid
      inner join location l on l.lid=li.lid
      inner join content_field_campaign_first_name f on f.nid=n.nid and f.vid=n.vid
      inner join content_field_campaign_last_name last on last.nid=n.nid and last.vid=n.vid
      left join content_field_email e on e.nid=n.nid and e.vid=n.vid
      left join content_field_campaign_phone p on p.nid=n.nid and p.vid=n.vid
      where n.type='scavenger_2011_signup' and (e.field_email_value='%s' OR p.field_campaign_phone_value='%s')
    ",$email_or_cell,$email_or_cell);

    $teams = array();
    while ($team = db_fetch_object($query)) {
      $key = $team->title.'+'.$team->postal_code;
      $teams[$key] = $team;
    }
    foreach ($teams as $t) {
      $team_names[$t->title.'HnzMneI'.$t->postal_code.'HnzMneI'.$email_or_cell] = $t->title.' - '.$t->city.', '.$t->province;
    }

    //Check if user has signed up
    if (count($teams)) {
      $found_team = 1;
   } else {
      drupal_set_message("We were unable to find your team.  Did you register with a different email address or cell phone number?  Make sure you register first!", 'error');
    }
  } else {
    drupal_set_message("Please provide the email or cell phone number you used during signup.",'error');
  }
}

if ($found_team) {
  $selected_day = $_POST['selected_day'];
  print '<h2>Day '.$selected_day.' - '.$challenges[$selected_day]['name'].'</h2>';
  print drupal_get_form('report_form_part_two');
  print '<style type="text/css">
    #hunt-signup { display: none; }
    div.challenge.not-selected { display: none; }
    </style>';
} else {
  //print drupal_get_form('report_form_part_one');
}


function report_form_part_one($form_state) {
  global $available_challenge_selections;
  global $current_day;
  $form['email_or_cell'] = array(
    '#type' => 'textfield',
    '#title' => t('Your email or cell'),
    '#default_value' => '',
    '#size' => 20,
    '#maxlength' => 128,
  );
  $form['selected_day'] = array(
    '#type' => 'select',
    '#title' => t('Select a day'),
    '#default_value' => '',
    '#options' => $available_challenge_selections,
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Report Back'),
    '#attributes' => array('class' => 'button button-wide shadow rounded'), 
  );
  return $form;
}

function report_form_part_two($form_state) {
  global $team_names;
  global $challenges;
  global $_POST;
  $selected_day = $_POST['selected_day'];
  $form['team'] = array(
    '#type' => 'select',
    '#title' => t('Team'),
    '#default_value' => '',
    '#options' => $team_names,
  );
  $form['selected_day'] = array(
    '#type' => 'hidden',
    '#title' => t('Selected Day'),
    '#default_value' => '',
    '#value' => $selected_day,
  );
  $form['challenge'] = array(
    '#type' => 'hidden',
    '#title' => t('Challenge'),
    '#default_value' => '',
    '#value' => $challenges[$selected_day]['name'],
  );
  $form['tid'] = array(
    '#type' => 'hidden',
    '#title' => t('Term ID'),
    '#default_value' => '',
    '#value' => $challenges[$selected_day]['tid'],
  );
  $form['#method'] = 'get';
  $form['#action'] = '/scavenger-hunt/report-back';
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Select this team'),
    '#attributes' => array('class' => 'button button-wide shadow rounded'),
 );
    return $form;
}




?>
