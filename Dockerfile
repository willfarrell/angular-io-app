# DOCKER-VERSION 0.5.0
# VERSION 0.0.1

### LAMP ###
# runnable base
FROM centos:6.4
MAINTAINER will Farrell

# REPOS
#RUN rpm -Uvh http://mirror.webtatic.com/yum/centos/6/latest.rpm
#RUN rpm -Uhv http://apt.sw.be/redhat/el5/en/x86_64/rpmforge/RPMS//rpmforge-release-0.3.6-1.el5.rf.x86_64.rpm
# PGP
#RUN rpm -Uhv http://odiecolon.lastdot.org/el5/i386/gpgme-1.1.8-2.i386.rpm

#RUN yum update -y #Failed upstart.x86_64 0:0.6.5-12.el6        upstart.x86_64 0:0.6.5-12.el6_4.1

# EDITORS
RUN yum install -y nano

# TOOLS
RUN yum install -y curl git make wget unzip

# BUILD
RUN yum install -y gcc

# LANGS
## PHP
RUN yum install -y php5 php5-cli php-devel php-pear php5-fpm php5-common php5-mcrypt php5-gd php-apc httpd-devel
RUN yum provides /usr/bin/phpize

### APC - Alternative PHP Cache
#RUN yum install -y php-apc
#echo "extension=apc.so" > /etc/php.d/apc.ini
#echo "apc.enabled=1" > /etc/php.d/apc.ini
#service httpd restart

### PECL
#RUN pecl install tidy


### CRYPTO
# #libgpg-error libgpg-error-devel pygpgme
RUN yum install -y openssl gnupg2 gpgme gpgme-devel
RUN pecl install gnupg scrypt
echo "extension=gnupg.so" > /etc/php.ini
echo "extension=scrypt.so" > /etc/php.ini

## NODE
#RUN yum install -y nodejs

# SERVICES
## MEMCACHED
#RUN yum install -y memcached
#RUN pecl install memcache

## REDIS
 # http://codingsteps.com/install-redis-2-6-on-amazon-ec2-linux-ami-or-centos/
#RUN yum install -y redis-server

## APACHE - already in centos
#RUN yum install -y apache2 libapache2-mod-php5

## MYSQL
RUN yum install -y mysql mysql-server php-mysql
#RUN mysqld & sleep 2 && mysqladmin create mydb

## CLEAN UP
yum install yum-utils
package-cleanup --dupes
package-cleanup --cleandupes
yum clean all

## APP
RUN rm -rf /var/www/*
ADD ../../vagrant/src /var/www

# RESTART
service httpd restart

# RESET

#ENV DEBIAN_FRONTEND dialog

## CONFIG
ENV RUNNABLE_USER_DIR /var/www
# memcached -d -u www-data;
ENV RUNNABLE_SERVICE_CMDS /etc/init.d/apache2 restart; mysqld

EXPOSE 80

ENTRYPOINT ["/bin/bash"]

# Check out http://www.kstaken.com/blog/2013/07/06/how-to-run-apache-under-docker/
# docker+jenkins https://gist.github.com/jamtur01/6147676
# https://github.com/aespinosa/docker-jenkins/blob/master/Dockerfile
# https://github.com/georgebashi/jenkins-docker-plugin

