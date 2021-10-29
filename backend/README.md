usage:

run server with
##flask run

create user with:
####curl -H 'Content-Type: application/json' -d '{"Email": "$(EMAIL)", "Password": "$(PASSWORD"}' localhost:5000/users/ -X POST

get user token with
####curl --user $(EMAIL):$(PASSWORD) localhost:5000/users/tokens/ -X GET

note: tokens expire after one hour in this version

calling other methods requires a bearer token (got from previous command) to be passed in as Authorization header, e.g
####curl -H 'Authorization: Bearer $(TOKEN)' localhost:5000/projects/ -X GET

to run tests simply cd to backend/ and use
####pytest -v