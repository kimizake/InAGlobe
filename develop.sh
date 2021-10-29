export $(cat .env | xargs)
alias mysqlconnect="mysql -h inaglobe-db.cmgio9ss2qr7.us-east-1.rds.amazonaws.com -P 3306 -u admin -p"
alias migrate="python src/manage.py db migrate && python src/manage.py db upgrade"
alias prod="gunicorn backend.run:app -k gevent -b 127.0.0.1:5000 -t 99999 --log-level DEBUG"
