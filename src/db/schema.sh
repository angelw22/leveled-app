#!/bin/sh

# verbose
# set -x

printf '===Loading Schema===\n'

psql -U leveled -d leveled << EOF
  CREATE TABLE users (
    user_id serial PRIMARY KEY,
    username VARCHAR (240) UNIQUE NOT NULL,
    password VARCHAR (240) NOT NULL,
    created_at TIMESTAMP default current_timestamp NOT NULL,
    last_login TIMESTAMP,
    upload_info JSONB 
  );

EOF

printf '===Schema Loaded===\n\n'

echo '===End of script===\n'