cd backend/
coverage run --source src/ -m pytest -v
check=$?
coverage report
cd ..
exit $check
