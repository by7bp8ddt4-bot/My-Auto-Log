#!/bin/bash
cd /home/team/shared/myautolog-app
git add -A
git commit -m "Update How It Works section text on landing page"
git push
echo "PUSH_EXIT_CODE=$?"