#! /bin/bash

# Enable some bash magic that pipe commands will fail.
set -e
set -o pipefail

function prefixed {
	sed -e "s/^/       /"
}

function assert_command {
	cmd="$1"

	command -v $cmd >/dev/null 2>&1 || {
		echo "$cmd: Command required but not found. Aborting." >&2;
		exit 1;
	}

	echo "$cmd: $(command -v $cmd)";
}

function assert_commands {
	commands="$@"

	for cmd in $commands; do
		assert_command $cmd
	done
}

echo "-----> Checking for required commands and tools"
assert_commands git node npm composer 2>&1 | prefixed

# Global Required Repos
#echo "-----> Installing required development commands and tools"
#echo "       After you enter your password it will take several minutes to run."
#sudo npm install -g grunt-cli bower karma mocha 2>&1 | prefixed

# Load in npm & bower Repos
#echo "-----> Installing required npm, bower, and composer dependencies"
#npm install --save-dev && bower install 2>&1 | prefixed

# Load in Composer Repos
#cd src/php && composer install 2>&1 | prefixed && cd ../../

# Copy Deps to testing
#echo "-----> Moving dependencies into place and compile"
#grunt setup 2>&1 | prefixed

# Test and Compile
#echo "-----> Testing and compiling project ***** reenable"
#grunt deploy --force 2>&1 | prefixed

# Setup VM Env (docker)
# Files from src/ will be synced
#echo "-----> Building docker container"
#bash scripts/docker-build.sh 2>&1 | prefixed

#docker ps -a > docker_ps.txt
#docker_get_ID
#rm -f docker_ps.txt
#echo "Grab the container ID (this will be the first one in the list)." &&
#echo "Run 'docker commit <container_id> <your username>/<image name>'"

#docker commit ${IDs[0]} vagrant-docker/localhost
#docker run -d -p 6379 <your username>/redis /usr/bin/redis-server
