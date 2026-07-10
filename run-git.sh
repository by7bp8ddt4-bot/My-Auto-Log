#!/bin/bash
cd /home/team/shared/myautolog-app
git add src/components/LandingPage.jsx
git commit -m "Update landing page step descriptions - VIN Copy & Paste and AI Co-Pilot copy"
git push
echo "GIT_EXIT:$?" > /tmp/git-done.txt