<VirtualHost *:80>
        ServerName flask.mydomain.com
        ServerAlias flask-api

        WSGIDaemonProcess flask-api user=datapot group=www threads=5 home=/var/www/flask-api/
        WSGIScriptAlias / /var/www/flask-api/flask-api.wsgi

        <directory /var/www/flask-api>
                WSGIProcessGroup flask-api
                WSGIApplicationGroup %{GLOBAL}
                WSGIScriptReloading On
                Order deny,allow
                Allow from all
        </directory>
</VirtualHost>