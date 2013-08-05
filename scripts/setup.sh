
# Global Required Repos
sudo npm install -g grunt-cli bower karma mocha

# Load in npm & bower Repos
npm install && bower install

# Load in Composer Repos
cd src/php && composer install && cd ../../

# Copy Deps to testing
grunt setup

# Setup virtual Env (docker)
# TO DO!!!
cd src
rm -rf docker
git clone https://github.com/dotcloud/docker.git
vagrant init
vagrant up
