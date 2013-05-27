<?php
$filter_table = array (
  'table_companies' => 
  array (
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'company_name' => 
    array (
      'field' => 'company_name',
      'label' => 'Company Name',
      'rules' => 'max_length[65535]',
    ),
    'company_url' => 
    array (
      'field' => 'company_url',
      'label' => 'Company Url',
      'rules' => 'max_length[65535]',
    ),
    'company_phone' => 
    array (
      'field' => 'company_phone',
      'label' => 'Company Phone',
      'rules' => 'max_length[255]',
    ),
    'company_details' => 
    array (
      'field' => 'company_details',
      'label' => 'Company Details',
      'rules' => 'max_length[65535]',
    ),
    'location_default_ID' => 
    array (
      'field' => 'location_default_ID',
      'label' => 'Location Default ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'user_default_ID' => 
    array (
      'field' => 'user_default_ID',
      'label' => 'User Default ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp_create' => 
    array (
      'field' => 'timestamp_create',
      'label' => 'Timestamp Create',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp_update' => 
    array (
      'field' => 'timestamp_update',
      'label' => 'Timestamp Update',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_follow_user' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'follow_ID' => 
    array (
      'field' => 'follow_ID',
      'label' => 'Follow ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'group_ID' => 
    array (
      'field' => 'group_ID',
      'label' => 'Group ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp' => 
    array (
      'field' => 'timestamp',
      'label' => 'Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_follow_user_groups' => 
  array (
    'group_ID' => 
    array (
      'field' => 'group_ID',
      'label' => 'Group ID',
      'rules' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'group_name' => 
    array (
      'field' => 'group_name',
      'label' => 'Group Name',
      'rules' => 'max_length[255]',
    ),
    'group_count' => 
    array (
      'field' => 'group_count',
      'label' => 'Group Count',
      'rules' => 'integer|max_length[6]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'group_color' => 
    array (
      'field' => 'group_color',
      'label' => 'Group Color',
      'rules' => 'max_length[255]',
    ),
  ),
  'table_locations' => 
  array (
    'location_ID' => 
    array (
      'field' => 'location_ID',
      'label' => 'Location ID',
      'rules' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'location_name' => 
    array (
      'field' => 'location_name',
      'label' => 'Location Name',
      'rules' => 'max_length[65535]',
    ),
    'address_1' => 
    array (
      'field' => 'address_1',
      'label' => 'Address 1',
      'rules' => 'max_length[65535]',
    ),
    'address_2' => 
    array (
      'field' => 'address_2',
      'label' => 'Address 2',
      'rules' => 'max_length[65535]',
    ),
    'city' => 
    array (
      'field' => 'city',
      'label' => 'City',
      'rules' => 'max_length[65535]',
    ),
    'region_code' => 
    array (
      'field' => 'region_code',
      'label' => 'Region Code',
      'rules' => 'max_length[255]',
    ),
    'country_code' => 
    array (
      'field' => 'country_code',
      'label' => 'Country Code',
      'rules' => 'max_length[255]',
    ),
    'mail_code' => 
    array (
      'field' => 'mail_code',
      'label' => 'Mail Code',
      'rules' => 'max_length[255]',
    ),
    'latitude' => 
    array (
      'field' => 'latitude',
      'label' => 'Latitude',
      'rules' => 'decimal[9,6]',
    ),
    'longitude' => 
    array (
      'field' => 'longitude',
      'label' => 'Longitude',
      'rules' => 'decimal[9,6]',
    ),
    'location_phone' => 
    array (
      'field' => 'location_phone',
      'label' => 'Location Phone',
      'rules' => 'max_length[255]',
    ),
    'location_fax' => 
    array (
      'field' => 'location_fax',
      'label' => 'Location Fax',
      'rules' => 'max_length[255]',
    ),
    'timestamp_create' => 
    array (
      'field' => 'timestamp_create',
      'label' => 'Timestamp Create',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp_update' => 
    array (
      'field' => 'timestamp_update',
      'label' => 'Timestamp Update',
      'rules' => 'integer|max_length[11]|is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]',
    ),
  ),
  'table_password_blacklist' => 
  array (
    'password' => 
    array (
      'field' => 'password',
      'label' => 'Password',
      'rules' => 'max_length[255]',
    ),
    'upper_count' => 
    array (
      'field' => 'upper_count',
      'label' => 'Upper Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'lower_count' => 
    array (
      'field' => 'lower_count',
      'label' => 'Lower Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'number_count' => 
    array (
      'field' => 'number_count',
      'label' => 'Number Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'symbol_count' => 
    array (
      'field' => 'symbol_count',
      'label' => 'Symbol Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'special_count' => 
    array (
      'field' => 'special_count',
      'label' => 'Special Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'use_count' => 
    array (
      'field' => 'use_count',
      'label' => 'Use Count',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp' => 
    array (
      'field' => 'timestamp',
      'label' => 'Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_password_dictionary' => 
  array (
    'word' => 
    array (
      'field' => 'word',
      'label' => 'Word',
      'rules' => 'max_length[255]',
    ),
    'lang' => 
    array (
      'field' => 'lang',
      'label' => 'Lang',
      'rules' => 'max_length[255]',
    ),
    'length' => 
    array (
      'field' => 'length',
      'label' => 'Length',
      'rules' => 'integer|max_length[2]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_sessions' => 
  array (
    'PHPSESSID' => 
    array (
      'field' => 'PHPSESSID',
      'label' => 'PHPSESSID',
      'rules' => 'max_length[255]',
    ),
    'ip' => 
    array (
      'field' => 'ip',
      'label' => 'Ip',
      'rules' => 'max_length[65535]',
    ),
    'ua' => 
    array (
      'field' => 'ua',
      'label' => 'Ua',
      'rules' => 'max_length[65535]',
    ),
    'lang' => 
    array (
      'field' => 'lang',
      'label' => 'Lang',
      'rules' => 'max_length[255]',
    ),
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'user_email' => 
    array (
      'field' => 'user_email',
      'label' => 'User Email',
      'rules' => 'max_length[255]',
    ),
    'user_level' => 
    array (
      'field' => 'user_level',
      'label' => 'User Level',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'remember' => 
    array (
      'field' => 'remember',
      'label' => 'Remember',
      'rules' => 'integer|max_length[1]|greater_than_or_equal[-128]|less_than_or_equal[127]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp' => 
    array (
      'field' => 'timestamp',
      'label' => 'Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_sites' => 
  array (
    'site_ID' => 
    array (
      'field' => 'site_ID',
      'label' => 'Site ID',
      'rules' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'site' => 
    array (
      'field' => 'site',
      'label' => 'Site',
      'rules' => 'max_length[255]',
    ),
  ),
  'table_user_confirm' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'hash' => 
    array (
      'field' => 'hash',
      'label' => 'Hash',
      'rules' => 'max_length[65535]',
    ),
  ),
  'table_user_reset' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'hash' => 
    array (
      'field' => 'hash',
      'label' => 'Hash',
      'rules' => 'max_length[65535]',
    ),
    'expire_timestamp' => 
    array (
      'field' => 'expire_timestamp',
      'label' => 'Expire Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
  'table_users' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User ID',
      'rules' => 'is_natural_no_zero|integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'user_level' => 
    array (
      'field' => 'user_level',
      'label' => 'User Level',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'user_username' => 
    array (
      'field' => 'user_username',
      'label' => 'User Name',
      'rules' => 'max_length[65535]',
    ),
    'user_name_first' => 
    array (
      'field' => 'user_name_first',
      'label' => 'User Name First',
      'rules' => 'max_length[65535]',
    ),
    'user_name_last' => 
    array (
      'field' => 'user_name_last',
      'label' => 'User Name Last',
      'rules' => 'max_length[65535]',
    ),
    'user_email' => 
    array (
      'field' => 'user_email',
      'label' => 'User Email',
      'rules' => 'max_length[255]',
    ),
    'user_phone' => 
    array (
      'field' => 'user_phone',
      'label' => 'User Phone',
      'rules' => 'max_length[255]',
    ),
    'user_details' => 
    array (
      'field' => 'user_details',
      'label' => 'User Details',
      'rules' => 'max_length[65535]',
    ),
    'password' => 
    array (
      'field' => 'password',
      'label' => 'Password',
      'rules' => 'max_length[65535]',
    ),
    'password_timestamp' => 
    array (
      'field' => 'password_timestamp',
      'label' => 'Password Timestamp',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'password_history' => 
    array (
      'field' => 'password_history',
      'label' => 'Password History',
      'rules' => 'max_length[65535]',
    ),
    'referral_user_ID' => 
    array (
      'field' => 'referral_user_ID',
      'label' => 'Referral User ID',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp_create' => 
    array (
      'field' => 'timestamp_create',
      'label' => 'Timestamp Create',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp_confirm' => 
    array (
      'field' => 'timestamp_confirm',
      'label' => 'Timestamp Confirm',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
    'timestamp_update' => 
    array (
      'field' => 'timestamp_update',
      'label' => 'Timestamp Update',
      'rules' => 'integer|max_length[11]|greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]',
    ),
  ),
);
?>
