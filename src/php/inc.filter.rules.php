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
    'user_details' => 
    array (
      'field' => 'user_details',
      'label' => 'User Details',
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