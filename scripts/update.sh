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

# Update npm & bower Repos
echo "-----> Updating required npm, bower, and composer dependencies"
npm update && bower update 2>&1 | prefixed

# Update Composer Repos
cd src/php && composer update 2>&1 | prefixed && cd ../../

# Update Dependencies
echo "-----> Moving updated dependencies into place and compile"
grunt update 2>&1 | prefixed

# Test and Compile
echo "-----> Testing and compiling project **** reset"
#grunt deploy --force 2>&1 | prefixed


# update docker

