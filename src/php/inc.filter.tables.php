<?php
/*
This file is updated automatically as your applications is run.
*/
$filter_tables = array (
  'companies' => 
  array (
    'company_ID' => 'is_natural_no_zero|integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'company_username' => 'max_length[255]',
    'company_name' => 'max_length[65535]',
    'company_url' => 'max_length[65535]',
    'company_phone' => 'max_length[255]',
    'company_details' => 'max_length[65535]',
    'user_default_ID' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'location_default_ID' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'timestamp_create' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'timestamp_update' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
  ),
  'follow_groups' => 
  array (
    'group_ID' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'group_name' => 'max_length[255]',
    'group_count' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'group_color' => 'max_length[255]',
    'user_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
  ),
  'follows' => 
  array (
    'user_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'company_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'follow_user_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'follow_company_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'group_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'timestamp' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
  ),
  'locations' => 
  array (
    'location_ID' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'company_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'location_name' => 'max_length[255]',
    'location_phone' => 'max_length[255]',
    'address_1' => 'max_length[65535]',
    'address_2' => 'max_length[65535]',
    'city' => 'max_length[255]',
    'region_code' => 'max_length[255]',
    'country_code' => 'max_length[255]',
    'mail_code' => 'max_length[255]',
    'latitude' => 'decimal[9,6]',
    'longitude' => 'decimal[9,6]',
    'timestamp_create' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'timestamp_update' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
  ),
  'messages' => 
  array (
    'user_key' => 'max_length[255]',
    'user_to_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'user_from_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'timestamp' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'message' => 'max_length[65535]',
    'read' => 'integer|max_length[4]|greater_than_or_equal[-128]|less_than_or_equal[127]',
  ),
  'notifications' => 
  array (
    'user_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'message' => 'max_length[65535]',
    'timestamp' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'read' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
  ),
  'password_blacklist' => 
  array (
    'password' => 'max_length[255]',
  ),
  'password_dictionary' => 
  array (
    'word' => 'max_length[255]',
    'lang' => 'max_length[255]',
    'length' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
  ),
  'sessions' => 
  array (
    'PHPSESSID' => 'max_length[255]',
    'ip' => 'max_length[65535]',
    'ua' => 'max_length[65535]',
    'lang' => 'max_length[255]',
    'user_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'user_email' => 'max_length[255]',
    'user_level' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'remember' => 'integer|max_length[1]|greater_than_or_equal[-128]|less_than_or_equal[127]',
    'company_ID' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    'totp_secret' => 'max_length[255]',
    'timestamp' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
  ),
  'user_confirm' => 
  array (
    'user_ID' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'hash' => 'max_length[255]',
  ),
  'user_reset' => 
  array (
    'user_ID' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'hash' => 'max_length[255]',
    'expire_timestamp' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
  ),
  'users' => 
  array (
    'user_ID' => 'is_natural_no_zero|integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'company_ID' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'user_level' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'user_email' => 'max_length[255]',
    'user_username' => 'max_length[255]',
    'user_name_first' => 'max_length[255]',
    'user_name_last' => 'max_length[255]',
    'user_function' => 'max_length[255]',
    'user_phone' => 'max_length[255]',
    'user_url' => 'max_length[255]',
    'user_details' => 'max_length[65535]',
    'notify_json' => 'max_length[65535]',
    'security_json' => 'max_length[65535]',
    'password' => 'max_length[65535]',
    'password_timestamp' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'password_history' => 'max_length[65535]',
    'referral_user_ID' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'timestamp_create' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'timestamp_confirm' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'timestamp_update' => 'integer|max_length[10]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    'user_dob' => '',
  ),
);
?>