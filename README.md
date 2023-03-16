# NGINX serving and routing basics

This workshop will be a hands-on introduction to NGINX (pronounced "engine-ex"), the open-source web server that, since its initial success as a web server, is now also used as a reverse proxy, HTTP cache, and load balancer.

## Requirements

- a machine running a linux os
- docker
- docker compose plugin

If you are taking part in this workshop live, you have been provided with a VM with all the necessary requirements.

# 0. Login and open Code Editor

0.1 Open your browser and go to signup.devopsplayground.org

0.2 Login with your Meetup username (or if you joined by RSVPing to the Teams invite, use your Teams username, including any spaces)

0.3 After successfully logging in, use the urls provided to open two tabs:

- a tab for your VM's terminal
- a tab for your VM's code editor

*nb. If you want to, you can do all of this on your own machine, with your own code editor, but any configurations you may have previously made may affect the steps in the workshop.*

0.4 In your code editor, navigate to and open NGINX-Workshop/README.md. This will provide all the steps and code snippets to follow along during the workshop.


# 1. Install NGINX

1.1 In your terminal:

    sudo amazon-linux-extras install nginx1

This installs NGINX and, by default, starts NGINX on your machine.

1.2 We can see that NGINX is running with this command:

    ps -ef |grep nginx

The default 'master' and 'worker' process run by default, but for this workshop, these processes should be stopped.

1.3 Kill NGINX by getting each PID from step 1.2 :

    sudo kill -9 <the PID of the master nginx process>
    sudo kill -9 <the PID of the worker nginx processes>

This means we can now start and stop NGINX when we want to.

# 2. Try out some commands

2.1 To start nginx:

    sudo nginx

Go to your browser and see the default web page being served.

2.2 While NGINX is running, we send further commands with the -s "signal" flag. To stop nginx gracefully:

    sudo nginx -s quit

2.3 To stop nginx forcefully:

    sudo nginx -s stop

2.4 To see access logs (start nginx first):

    sudo tail -f /var/log/nginx/access.log

2.5 Try reloading the page, or accessing it from another device. Notice the logs.

From your own terminal, let's compare 

    curl http://54.217.161.86
    curl http://54.217.161.86 -X POST

Look at the access logs, you can see the GET request was ok, but POST request 'Not Allowed'
Why is this? Where is this behaviour configured? Can we change this behaviour?

# 3. Configuring NGINX

The behaviour of NGINX is configured in various files stored (by default) at /etc/nginx/.

Lets look at the nginx.conf file, which is the 'main' configuration file *(although it makes reference to other config files, similar to importing modules)*

3.1 In your terminal:

    cat /etc/nginx/nginx.conf

3.2 Replace the contents of the nginx.conf file:

To take advantage of the Code Editor (and avoid using vi!!) we can edit the contents of nginx.conf like so:

3.2.1 In the root directory of your Code editor, create a new file called mynginx.conf

3.2.2 Insert (copy + paste) this code into mynginx.conf:

    http {
        server {
            listen 80;
            root /usr/share/nginx/html;
        }
    }

    events {}

3.2.3 Save this (command + s)

3.2.4 In your terminal:

    cat /NGINX-Workshop/mynginx.conf > /etc/nginx/nginx.conf

3.2.5 Check this was successful:

    cat /etc/nginx/nginx.conf

Check your browser, we should have the same result as before. So what can we change?

3.3 Observe the line **root /usr/share/nginx/html;**. 

This single single key-pair, separated by a space and punctuated with a semi-colon is known as a 'directive'. 

This directive tells NGINX which folder to look in when serving web content (html, css, javascript, php etc.)

3.4 Observe the **listen** directive. This tells NGINX which port to listen on.

# 4. Serve your own web content

4.1 In your code editor create a folder called 'public'.

4.2 Inside /public create a file called index.html

add the following html (or some thing similarly basic)

    <html>
        <body>
            <h1>
                This is a sample page
            </h1>
        </body>
    </html>

and, in nginx.conf, change the root directive;

    http {
        server {
            listen 80;
            root /NGINX-Workshop/public;
        }
    }

    events {}

4.3 Check your browser. What happened? Why wasn't the page updated?

Nothing has changed because we haven't told NGINX to 'reload' the contents of the config file.

    nginx -s reload

Reload, then check your browser.

# 5 Page routing

What if you want to serve multiple pages eg /, /cart, /shipping, /contact ...

5.1 Add a location block to nginx.conf:

    http {
        server {
            listen 80;
            root /NGINX-Workshop/public;

            location /about {
                try_files cart.html index.html;
            }
        }
    }

    events {}

5.2 Add a new html file called cart.html:

    <html>
        <body>
            <h1>
                Shopping Cart
            </h1>
            <ul>
                <li>Bread</li>
                <li>Milk</li>
                <li>Oranges</li>
            </ul>
        </body>
    </html>

Reload, 

    nginx -s reload

then check your browser.

5.3 So what if we want mutliple pages? Multiple location contexts? Is there is a cleaner way?

http {
        server {
                listen 80;
                root /NGINX-Workshop/public;

                location / {
                        root /home/ec2-user/NGINX-Workshop/public;
                        try_files /$uri.html /index.html =404;
                }
        }
}

events {}