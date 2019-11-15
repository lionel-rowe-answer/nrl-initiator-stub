@ECHO OFF

FOR /F "tokens=* USEBACKQ" %%F IN (`node get-ca-file`) DO (
    IF NOT "%%F" == "null" SET NODE_EXTRA_CA_CERTS=%%F
)

node nrl-test-runner