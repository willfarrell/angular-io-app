
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

