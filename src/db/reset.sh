#!/bin/sh

# verbose
# set -x

printf '===Reset DB===\n'

psql -U leveled -d leveled << EOF
  DROP TABLE users;
EOF

printf '===DB Reset===\n'
