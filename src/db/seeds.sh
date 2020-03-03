#!/bin/sh

# verbose
# set -x

printf '===Seeding Data: Users===\n'

psql -U leveled -d leveled << EOF
  INSERT INTO users (username, password) VALUES 
    ('admin', '$2y$10$/AwnsJipRIOMdjFFjOYaK.Idp19mn5SdeY1SoYy9aUl979qhbJkoe')
EOF

printf '===Seeded Data: Users===\n\n'

echo '===End of script==='