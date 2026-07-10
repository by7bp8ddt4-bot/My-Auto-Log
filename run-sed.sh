#!/bin/bash
cd /home/team/shared/myautolog-app
sed -i 's/professional records—even offline\./professional records—or—simply upload a receipt and have a service record auto populate a log—even offline./' src/components/LandingPage.jsx
echo "SED_DONE" > /tmp/sed-step2.txt