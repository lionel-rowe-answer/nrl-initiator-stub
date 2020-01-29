#!/bin/bash

CAVAR=$(node get-ca-file)
if [ "$CAVAR" != "null" ]
then
    export NODE_EXTRA_CA_CERTS=$CAVAR
fi
node nrl-test-runner
