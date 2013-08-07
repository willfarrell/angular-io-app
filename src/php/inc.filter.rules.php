<?php
$filter_rules = array (
  'Account::post_signin' => 
  array (
    'email' => 
    array (
      'field' => 'email',
      'label' => 'Email',
      'rules' => 'required',
      'filters' => '',
    ),
    'password' => 
    array (
      'field' => 'password',
      'label' => 'Password',
      'rules' => 'required',
      'filters' => '',
    ),
    'remember' => 
    array (
      'field' => 'remember',
      'label' => 'Remember',
      'rules' => 'boolean',
      'filters' => '',
    ),
  ),
  'Account::post_signup' => 
  array (
    'email' => 
    array (
      'field' => 'email',
      'label' => 'Email',
      'rules' => 'required|email|is_unique[users.user_email]',
      'filters' => '',
    ),
    'password' => 
    array (
      'field' => 'password',
      'label' => 'Password',
      'rules' => 'required|password',
      'filters' => '',
    ),
  ),
  'Account::put_password_change' => 
  array (
    'new_password' => 
    array (
      'field' => 'new_password',
      'label' => 'New Password',
      'rules' => 'required|!matches[old_password]|password',
      'filters' => '',
    ),
    'old_password' => 
    array (
      'field' => 'old_password',
      'label' => 'Old Password',
      'rules' => 'required',
      'filters' => '',
    ),
  ),
  'Account::put_reset_password' => 
  array (
    'hash' => 
    array (
      'field' => 'hash',
      'label' => 'Hash',
      'rules' => 'required',
      'filters' => '',
    ),
    'new_password' => 
    array (
      'field' => 'new_password',
      'label' => 'New Password',
      'rules' => 'required|!matches[old_password]|password',
      'filters' => '',
    ),
    'old_password' => 
    array (
      'field' => 'old_password',
      'label' => 'Old Password',
      'rules' => 'required',
      'filters' => '',
    ),
  ),
  'Account::reset_send' => 
  array (
    'email' => 
    array (
      'field' => 'email',
      'label' => 'Email',
      'rules' => 'required|email',
      'filters' => '',
    ),
  ),
  'Contact::post' => 
  array (
    'email' => 
    array (
      'field' => 'email',
      'label' => 'Email',
      'rules' => 'required|email',
      'filters' => '',
    ),
    'message' => 
    array (
      'field' => 'message',
      'label' => 'Message',
      'rules' => 'required|sanitize_string|strip_tags[]',
      'filters' => 'trim',
    ),
    'name' => 
    array (
      'field' => 'name',
      'label' => 'Name',
      'rules' => 'required',
      'filters' => 'trim|sanitize_string|strip_tags[]',
    ),
  ),
  'Location::post' => 
  array (
    'address_1' => 
    array (
      'field' => 'address_1',
      'label' => 'Address 1',
      'rules' => '',
      'filters' => '',
    ),
    'address_2' => 
    array (
      'field' => 'address_2',
      'label' => 'Address 2',
      'rules' => '',
      'filters' => '',
    ),
    'city' => 
    array (
      'field' => 'city',
      'label' => 'City',
      'rules' => '',
      'filters' => '',
    ),
    'company_ID' => 
    array (
      'field' => 'company_ID',
      'label' => 'Company  I D',
      'rules' => '',
      'filters' => '',
    ),
    'country_code' => 
    array (
      'field' => 'country_code',
      'label' => 'Country Code',
      'rules' => '',
      'filters' => '',
    ),
    'location_name' => 
    array (
      'field' => 'location_name',
      'label' => 'Location Name',
      'rules' => '',
      'filters' => '',
    ),
    'location_phone' => 
    array (
      'field' => 'location_phone',
      'label' => 'Location Phone',
      'rules' => '',
      'filters' => '',
    ),
    'mail_code' => 
    array (
      'field' => 'mail_code',
      'label' => 'Mail Code',
      'rules' => '',
      'filters' => '',
    ),
    'primary' => 
    array (
      'field' => 'primary',
      'label' => 'Primary',
      'rules' => '',
      'filters' => '',
    ),
    'region_code' => 
    array (
      'field' => 'region_code',
      'label' => 'Region Code',
      'rules' => '',
      'filters' => '',
    ),
  ),
  'User::getById' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User  I D',
      'rules' => '',
      'filters' => '',
    ),
  ),
  'User::getByName' => 
  array (
    'user_username' => 
    array (
      'field' => 'user_username',
      'label' => 'User Username',
      'rules' => '',
      'filters' => '',
    ),
  ),
  'User::get_unique' => 
  array (
    'user_username' => 
    array (
      'field' => 'user_username',
      'label' => 'User Username',
      'rules' => '',
      'filters' => '',
    ),
  ),
  'User::put' => 
  array (
    'user_ID' => 
    array (
      'field' => 'user_ID',
      'label' => 'User  I D',
      'rules' => '',
      'filters' => '',
    ),
    'user_details' => 
    array (
      'field' => 'user_details',
      'label' => 'User Details',
      'rules' => '',
      'filters' => '',
    ),
    'user_email' => 
    array (
      'field' => 'user_email',
      'label' => 'User Email',
      'rules' => '',
      'filters' => '',
    ),
    'user_function' => 
    array (
      'field' => 'user_function',
      'label' => 'User Function',
      'rules' => '',
      'filters' => '',
    ),
    'user_name_first' => 
    array (
      'field' => 'user_name_first',
      'label' => 'User Name First',
      'rules' => '',
      'filters' => '',
    ),
    'user_name_last' => 
    array (
      'field' => 'user_name_last',
      'label' => 'User Name Last',
      'rules' => '',
      'filters' => '',
    ),
    'user_phone' => 
    array (
      'field' => 'user_phone',
      'label' => 'User Phone',
      'rules' => '',
      'filters' => '',
    ),
    'user_url' => 
    array (
      'field' => 'user_url',
      'label' => 'User Url',
      'rules' => '',
      'filters' => '',
    ),
    'user_username' => 
    array (
      'field' => 'user_username',
      'label' => 'User Username',
      'rules' => '',
      'filters' => '',
    ),
  ),
  'User::put_notify' => 
  array (
    'new_follow' => 
    array (
      'field' => 'new_follow',
      'label' => 'New Follow',
      'rules' => '',
      'filters' => '',
    ),
    0 => 
    array (
      'field' => 0,
      'label' => '0',
      'rules' => '',
      'filters' => '',
    ),
    'new_message' => 
    array (
      'field' => 'new_message',
      'label' => 'New Message',
      'rules' => '',
      'filters' => '',
    ),
    1 => 
    array (
      'field' => 1,
      'label' => '1',
      'rules' => '',
      'filters' => '',
    ),
    2 => 
    array (
      'field' => 2,
      'label' => '2',
      'rules' => '',
      'filters' => '',
    ),
    3 => 
    array (
      'field' => 3,
      'label' => '3',
      'rules' => '',
      'filters' => '',
    ),
  ),
  'User::put_pgp' => 
  array (
    'keyserver' => 
    array (
      'field' => 'keyserver',
      'label' => 'Keyserver',
      'rules' => '',
      'filters' => '',
    ),
  ),
  'User::put_security' => 
  array (
    'email' => 
    array (
      'field' => 'email',
      'label' => 'Email',
      'rules' => '',
      'filters' => '',
    ),
    'totp' => 
    array (
      'field' => 'totp',
      'label' => 'Totp',
      'rules' => '',
      'filters' => '',
    ),
  ),
  'User::search' => 
  array (
    'keyword' => 
    array (
      'field' => 'keyword',
      'label' => 'Keyword',
      'rules' => '',
      'filters' => 'trim|sanitize_string',
    ),
    'limit' => 
    array (
      'field' => 'limit',
      'label' => 'Limit',
      'rules' => 'greater_than[0]|less_than[50]',
      'filters' => '',
    ),
  ),
  'User::totpCheck' => 
  array (
    'code' => 
    array (
      'field' => 'code',
      'label' => 'Code',
      'rules' => '',
      'filters' => '',
    ),
    'secret' => 
    array (
      'field' => 'secret',
      'label' => 'Secret',
      'rules' => '',
      'filters' => '',
    ),
  ),
);
?>