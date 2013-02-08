<?php
/*
This file is updated automatically as your applications is run.
This is the best place to add the 'required' param for each function called.
*/
$filter_function = array (
  'account_post_signup' => 
  array (
    'email' => 
    array (
      'field' => 'email',
      'label' => '',
      'rules' => 'required|valid_email|valid_email_dns|is_unique[users.user_email]',
    ),
    'password' => 
    array (
      'field' => 'password',
      'label' => '',
      'rules' => 'required',
    ),
  ),
  'account_post_signin' => 
  array (
    'email' => 
    array (
      'field' => 'email',
      'label' => 'Email',
      'rules' => '',
    ),
    'password' => 
    array (
      'field' => 'password',
      'label' => 'Password',
      'rules' => '',
    ),
    'remember' => 
    array (
      'field' => 'remember',
      'label' => 'Remember',
      'rules' => '',
    ),
  ),
  'user_put' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => '',
    ),
    'user_name' => 
    array (
      'field' => 'user_name',
      'label' => 'User Name',
      'rules' => '',
    ),
    'user_name_first' => 
    array (
      'field' => 'user_name_first',
      'label' => 'User Name First',
      'rules' => '',
    ),
    'user_name_last' => 
    array (
      'field' => 'user_name_last',
      'label' => 'User Name Last',
      'rules' => '',
    ),
    'user_email' => 
    array (
      'field' => 'user_email',
      'label' => 'User Email',
      'rules' => '',
    ),
    'user_phone' => 
    array (
      'field' => 'user_phone',
      'label' => 'User Phone',
      'rules' => '',
    ),
    'user_details' => 
    array (
      'field' => 'user_details',
      'label' => 'User Details',
      'rules' => '',
    ),
    'user_url' => 
    array (
      'field' => 'user_url',
      'label' => 'User Url',
      'rules' => '',
    ),
    'user_function' => 
    array (
      'field' => 'user_function',
      'label' => 'User Function',
      'rules' => '',
    ),
  ),
  'account_reset_send' => 
  array (
    'email' => 
    array (
      'field' => 'email',
      'label' => 'Email',
      'rules' => '',
    ),
  ),
  'account_put_password_change' => 
  array (
    'old_password' => 
    array (
      'field' => 'old_password',
      'label' => 'Old Password',
      'rules' => '',
    ),
    'new_password' => 
    array (
      'field' => 'new_password',
      'label' => 'New Password',
      'rules' => '',
    ),
  ),
  'account_put_reset_password' => 
  array (
    'hash' => 
    array (
      'field' => 'hash',
      'label' => 'Hash',
      'rules' => '',
    ),
    'password' => 
    array (
      'field' => 'password',
      'label' => 'Password',
      'rules' => '',
    ),
    'new_password' => 
    array (
      'field' => 'new_password',
      'label' => 'New Password',
      'rules' => '',
    ),
  ),
  'location_post' => 
  array (
    'primary' => 
    array (
      'field' => 'primary',
      'label' => 'Primary',
      'rules' => '',
    ),
    'country_code' => 
    array (
      'field' => 'country_code',
      'label' => 'Country Code',
      'rules' => '',
    ),
    'location_name' => 
    array (
      'field' => 'location_name',
      'label' => 'Location Name',
      'rules' => '',
    ),
    'address_1' => 
    array (
      'field' => 'address_1',
      'label' => 'Address 1',
      'rules' => '',
    ),
    'city' => 
    array (
      'field' => 'city',
      'label' => 'City',
      'rules' => '',
    ),
    'region_code' => 
    array (
      'field' => 'region_code',
      'label' => 'Region Code',
      'rules' => '',
    ),
    'mail_code' => 
    array (
      'field' => 'mail_code',
      'label' => 'Mail Code',
      'rules' => '',
    ),
    'address_2' => 
    array (
      'field' => 'address_2',
      'label' => 'Address 2',
      'rules' => '',
    ),
    'latitude' => 
    array (
      'field' => 'latitude',
      'label' => 'Latitude',
      'rules' => '',
    ),
    'longitude' => 
    array (
      'field' => 'longitude',
      'label' => 'Longitude',
      'rules' => '',
    ),
    'location_phone' => 
    array (
      'field' => 'location_phone',
      'label' => 'Location Phone',
      'rules' => '',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => '',
    ),
  ),
  'company_post_user' => 
  array (
    'user_level' => 
    array (
      'field' => 'user_level',
      'label' => 'User Level',
      'rules' => '',
    ),
    'user_email' => 
    array (
      'field' => 'user_email',
      'label' => 'User Email',
      'rules' => '',
    ),
    'user_name_first' => 
    array (
      'field' => 'user_name_first',
      'label' => 'User Name First',
      'rules' => '',
    ),
    'user_name_last' => 
    array (
      'field' => 'user_name_last',
      'label' => 'User Name Last',
      'rules' => '',
    ),
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => '',
    ),
    'user_name' => 
    array (
      'field' => 'user_name',
      'label' => 'User Name',
      'rules' => '',
    ),
  ),
  'company_put_user' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => '',
    ),
    'user_level' => 
    array (
      'field' => 'user_level',
      'label' => 'User Level',
      'rules' => '',
    ),
    'user_name' => 
    array (
      'field' => 'user_name',
      'label' => 'User Name',
      'rules' => '',
    ),
    'user_name_first' => 
    array (
      'field' => 'user_name_first',
      'label' => 'User Name First',
      'rules' => '',
    ),
    'user_name_last' => 
    array (
      'field' => 'user_name_last',
      'label' => 'User Name Last',
      'rules' => '',
    ),
    'user_email' => 
    array (
      'field' => 'user_email',
      'label' => 'User Email',
      'rules' => '',
    ),
    'user_phone' => 
    array (
      'field' => 'user_phone',
      'label' => 'User Phone',
      'rules' => '',
    ),
    'user_details' => 
    array (
      'field' => 'user_details',
      'label' => 'User Details',
      'rules' => '',
    ),
    'timestamp_create' => 
    array (
      'field' => 'timestamp_create',
      'label' => 'Timestamp Create',
      'rules' => '',
    ),
    'user_function' => 
    array (
      'field' => 'user_function',
      'label' => 'User Function',
      'rules' => '',
    ),
  ),
  'location_put' => 
  array (
    'location_ID' => 
    array (
      'field' => 'location_ID',
      'label' => 'Location ID',
      'rules' => '',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => '',
    ),
    'location_name' => 
    array (
      'field' => 'location_name',
      'label' => 'Location Name',
      'rules' => '',
    ),
    'address_1' => 
    array (
      'field' => 'address_1',
      'label' => 'Address 1',
      'rules' => '',
    ),
    'address_2' => 
    array (
      'field' => 'address_2',
      'label' => 'Address 2',
      'rules' => '',
    ),
    'city' => 
    array (
      'field' => 'city',
      'label' => 'City',
      'rules' => '',
    ),
    'region_code' => 
    array (
      'field' => 'region_code',
      'label' => 'Region Code',
      'rules' => '',
    ),
    'country_code' => 
    array (
      'field' => 'country_code',
      'label' => 'Country Code',
      'rules' => '',
    ),
    'mail_code' => 
    array (
      'field' => 'mail_code',
      'label' => 'Mail Code',
      'rules' => '',
    ),
    'latitude' => 
    array (
      'field' => 'latitude',
      'label' => 'Latitude',
      'rules' => '',
    ),
    'longitude' => 
    array (
      'field' => 'longitude',
      'label' => 'Longitude',
      'rules' => '',
    ),
    'location_phone' => 
    array (
      'field' => 'location_phone',
      'label' => 'Location Phone',
      'rules' => '',
    ),
    'location_fax' => 
    array (
      'field' => 'location_fax',
      'label' => 'Location Fax',
      'rules' => '',
    ),
  ),
  'test_get' => 
  array (
  ),
  'contact_post' => 
  array (
    'name' => 
    array (
      'field' => 'name',
      'label' => 'Name',
      'rules' => '',
    ),
    'email' => 
    array (
      'field' => 'email',
      'label' => 'Email',
      'rules' => '',
    ),
    'message' => 
    array (
      'field' => 'message',
      'label' => 'Message',
      'rules' => '',
    ),
  ),
);
?>