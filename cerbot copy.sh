server {

        server_name wwm-bk.greatsohis.online www.wwm-bk.greatsohis.online;
        location / {
                proxy_pass http://localhost:8000;
        }


    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/wwm-bk.greatsohis.online/fullchain.pem; # managed by Certbot  ssl_certificate_key /etc/letsencrypt/live/wwm-bk.greatsohis.online/privkey.pem; # managed by Certbotinclude /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = wwm-bk.greatsohis.online) {
        return 301 https://$host$request_uri;
    } # managed by Certbot



        server_name wwm-bk.greatsohis.online www.wwm-bk.greatsohis.online;
    listen 80;
    return 404; # managed by Certbot


}