# You may add here your server {
#       ...
# }
# statements for each of your virtual hosts to this file
##
# You should look at the following URL's in order to grasp a solid
# understanding of Nginx configuration files in order to fully unleash
# the power of Nginx. http://wiki.nginx.org/Pitfalls
# http://wiki.nginx.org/QuickStart http://wiki.nginx.org/Configuration
#
# Generally, you will want to move this file somewhere, and start with a
# clean file but keep this around for reference. Or just disable in
# sites-enabled.
#
# Please see /usr/share/doc/nginx-doc/examples/ for more detailed
# examples.
##
server {
        listen 80;
        listen [::]:80;
        listen 443 ssl http2;
        root /var/www/html/spacehexagon.com;
        index index.html index.htm;
        # Make site accessible from http://localhost/
        server_name spacehexagon.com www.spacehexagon.com;
        ssl_certificate /etc/ssl/certs/spacehexagon-bundle.pem;
    	ssl_certificate_key /etc/ssl/private/spacehexagon.key;
        if ($host = 'www.spacehexagon.com' ) {
          rewrite ^/(.*)$ http://spacehexagon.com/$1 permanent;
        }
        if ($ssl_protocol = "") {
                rewrite ^ https://$host$request_uri? permanent;
        }
        location / {
                # First attempt to serve request as file, then as
                # directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
                # Uncomment to enable naxsi on this location include
                # /etc/nginx/naxsi.rules
        }
        # Redirect all non-SSL traffic to SSL.

        gzip on;
        gzip_disable "msie6";
        gzip_comp_level 6;
        gzip_min_length 1100;
        gzip_buffers 16 8k;
        gzip_proxied any;
        gzip_types
                text/plain
                text/css
                text/js
                text/xml
                text/javascript
                application/javascript
                application/x-javascript
                application/json
                application/xml
                application/xml+rss;

        # Only for nginx-naxsi used with nginx-naxsi-ui : process denied
        #requests location /RequestDenied {
        #       proxy_pass http://127.0.0.1:8080;
        #}
        #error_page 404 /404.html;
        # redirect server error pages to the static page /50x.html
        #
        #error_page 500 502 503 504 /50x.html;
        location = /50x.html {
                root /usr/share/nginx/html;
        }
        # pass the PHP scripts to FastCGI server listening on
        # 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #        try_files $uri =404;
        #        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        #        # NOTE: You should have "cgi.fix_pathinfo = 0;" in
        #        # php.ini With php5-cgi alone: fastcgi_pass
        #        # 127.0.0.1:9000; With php5-fpm:
        #        fastcgi_param SCRIPT_FILENAME
        #$document_root$fastcgi_script_name;
                fastcgi_pass unix:/var/run/php5-fpm.sock;
                fastcgi_index index.php;
                include fastcgi_params;
        }
        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        location ~ /\.ht {
                deny all;
        }
}
