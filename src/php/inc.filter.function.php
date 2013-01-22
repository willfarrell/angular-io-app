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
  ),
);
?>