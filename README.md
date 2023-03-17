# NGINX serving and routing basics

This workshop will be a hands-on introduction to NGINX (pronounced "engine-ex"), the open-source web server that, since its initial success as a web server, is now also used as a reverse proxy, HTTP cache, and load balancer.

## Requirements

- a machine running a linux os
- docker
- docker compose plugin

If you are taking part in this workshop live, you have been provided with a VM with all the necessary requirements.

# 0. 
Login and open Code Editor

## 0.1 
Open your browser and go to signup.devopsplayground.org

## 0.2 
Login with your Meetup username (or if you joined by RSVPing to the Teams invite, use your Teams username, including any spaces)

## 0.3
After successfully logging in, use the urls provided to open two tabs:

- a tab for your VM's terminal
- a tab for your VM's code editor

*nb. If you want to, you can do all of this on your own machine, with your own code editor, but any configurations you may have previously made may affect the steps in the workshop.*

## 0.4 
In your code editor, navigate to and open NGINX-Workshop/README.md. This will provide all the steps and code snippets to follow along during the workshop.


# 1. Install NGINX

## 1.1 
In your terminal:

    sudo amazon-linux-extras install nginx1

This installs NGINX and, by default, starts NGINX on your machine.

## 1.2 
We can see that NGINX is running with this command:

    ps -ef |grep nginx

The default 'master' and 'worker' process run by default, but for this workshop, these processes should be stopped.

## 1.3 
Kill NGINX by getting each PID from step 1.2 :

    sudo kill -9 <the PID of the master nginx process>
    sudo kill -9 <the PID of the worker nginx processes>

This means we can now start and stop NGINX when we want to.

# 2. Try out some commands

## 2.1 
To start nginx:

    sudo nginx

Go to your browser and see the default web page being served.

## 2.2 
While NGINX is running, we send further commands with the -s "signal" flag. To stop nginx gracefully:

    sudo nginx -s quit

## 2.3 
To stop nginx forcefully:

    sudo nginx -s stop

## 2.4 
To see access logs (start nginx first):

    sudo tail -f /var/log/nginx/access.log

## 2.5 
Try reloading the page, or accessing it from another device. Notice the logs.

From your own terminal, let's compare 

    curl http://54.217.161.86
    curl http://54.217.161.86 -X POST

Look at the access logs, you can see the GET request was ok, but POST request 'Not Allowed'
Why is this? Where is this behaviour configured? Can we change this behaviour?

# 3. Configuring NGINX

The behaviour of NGINX is configured in various files stored (by default) at /etc/nginx/.

Lets look at the nginx.conf file, which is the 'main' configuration file *(although it makes reference to other config files, similar to importing modules)*

## 3.1 
In your terminal:

    cat /etc/nginx/nginx.conf

## 3.2 
Replace the contents of the nginx.conf file:

To take advantage of the Code Editor (and avoid using vi!!) we can edit the contents of nginx.conf like so:

### 3.2.1 
In the **'/project/config'** directory of your Code editor, **create a new file called mynginx.conf**

### 3.2.2 
Insert (copy + paste) this code into mynginx.conf:

    user ec2-user;

    http {
        server {
            listen 80;
            root /usr/share/nginx/html;
        }
    }

    events {}

### 3.2.3 
Save this (command + s)

### 3.2.4 
In your terminal:

    cat ~/NGINX-Workshop/config/mynginx.conf > /etc/nginx/nginx.conf

### 3.2.5 
Check this was successful:

    cat /etc/nginx/nginx.conf

Check your browser, we should have the same result as before. So what can we change?

## 3.3 
Observe the line **root /usr/share/nginx/html;**. 

This single single key-pair, separated by a space and punctuated with a semi-colon is known as a 'directive'. 

This directive tells NGINX which folder to look in when serving web content (html, css, javascript, php etc.)

## 3.4 
Observe the **listen** directive. This tells NGINX which port to listen on.

# 4. Serve your own web content

## 4.1 
In your code editor create a folder inside /project called 'public'.

## 4.2 
Inside /public create an index.html file.

Add the following html (or some thing similarly basic)

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>
            This is a sample page
        </h1>
    </body>
    </html>

and, in nginx.conf, change the root directive;

    user ec2-user;
    
    http {
        server {
            listen 80;
            root /home/ec2-user/NGINX-Workshop/public;
        }
    }

    events {}

## 4.3 
Check your browser. What happened? Why wasn't the page updated?

Nothing has changed because we haven't told NGINX to 'reload' the contents of the config file.

    cat ~/NGINX-Workshop/config/mynginx.conf > /etc/nginx/nginx.conf
    nginx -s reload

Reload, then check your browser.

# 5 Page routing

What if you want to serve multiple pages eg /, /cart, /shipping, /contact ...

## 5.1 
Add a location context to nginx.conf:

    user ec2-user;
    
    http {
        server {
            listen 80;
            root /home/ec2-user/NGINX-Workshop/public;

            location /cart {
                root /home/ec2-user/NGINX-Workshop/public;
                try_files /cart.html =404;
            }
        }
    }

    events {}

## 5.2 
Add a new html file inside /public called cart.html:

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
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

    cat ~/NGINX-Workshop/config/mynginx.conf > /etc/nginx/nginx.conf
    nginx -s reload

Then check your browser at /cart.

So what if we want mutliple pages? Multiple location contexts? Is there is a cleaner way?

## 5.3 
Update your nginx.conf with this:

    user ec2-user;

    http {
        server {
            listen 80;
            root /NGINX-Workshop/public;

            location / {
                root /home/ec2-user/NGINX-Workshop/public;
            }
        }
    }

    events {}

## 5.4 
And create folders to organise all the files for our pages, eg.

    +-- /project
    |   +-- /config
    |      +-- mynginx.conf
    |   +-- /public
    |      +-- index.html
    |      +-- /cart
    |          +-- index.html
    |      +-- /about
    |          +-- index.html
    | ...

public/cart/index.html

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
       <h1>
            Shopping Cart (inside /cart folder)
        </h1>
        <ul>
            <li>Bread</li>
            <li>Milk</li>
            <li>Oranges</li>
        </ul>
    </body>
    </html>

public/about/index.html

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>
            About (inside /about folder)
        </h1>
        <p>
            This page serves information about our store.
        </p>
    </body>
    </html>

Then, check the following in your browser

- [your_ip]
- [your_ip]/cart.html
- [your_ip]/cart
- [your_ip]/about

# 5 Serving other files

The most common types of files to serve alongside .html files are .css and .js files (and .php files but we're not going into that today) since these contain styles and logic for the web page.

## 5.1 
Add .css and .js files to your folders

    +-- /project
    |   +-- /config
    |      +-- mynginx.conf
    |   +-- /public
    |      +-- index.html
    |      +-- styles.css
    |      +-- script.js
    |      +-- /cart
    |          +-- index.html
    |          +-- styles.css
    |          +-- script.js
    |      +-- /about
    |          +-- index.html
    |          +-- styles.css
    |          +-- script.js
    | ...

## 5.2 
In each index.html file, **add the links to styles.css and script.js** eg:

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="./styles.css">
        <script src="script.js" defer></script>
        <title>Document</title>
    </head>
    <body>
        <h1>
            This is a sample page
        </h1>
    </body>
    </html>

## 5.3 
Check each route in your browser. Huh?

Using the 'inspect' tool, looking at 'sources', we can see that 'styles.css' and script.js was loaded but styles have not been aplied and (depending on your browser) the script might not have loaded. So what's going on?

## 5.4 
Let's talk about MIME types!

MIME types describe the media type of content served by web servers or web applications. They are intended to help provide a hint as to how the content should be processed and displayed. These days, most browsers have the ability to 'guess' the intention of a file by either scanning it or looking at its file extension, but this is not widely applied for reasons of security and loss of control.

TLDR - We need to tell the browser, when the content loads, which type of files (other than text/html) to accept.

## 5.5 
Add the following to nginx.conf:


    user ec2-user;

    http {

        include mime.types;

        server {
            listen 80;
            root /NGINX-Workshop/public;

            location / {
                root /home/ec2-user/NGINX-Workshop/public;
            }
        }
    }

    events {}

Check your browser. Now, the .css and .js files should be accepted and working.

So now we know a little bit about serving static html files, enough to explore on your own, let's look at a different feature of NGINX, loadbalancing.

# 6 Load balancing

Diagram --> multiple backend 'worker' servers reached by one NGINX endpoint.

The use a of a loadbalancer is a common way to increase capacity, and the simplest way of managing this is a 'round robin' algorithm, where traffic is directed to the next backend worker each time a new request comes in.

To do this, you could spin up multiple 'worker' hosts to learn with, but a far more cost-effective way to do this is using docker. Docker can create a virtual network of hosts, essentially a VPC that runs on your own machine.

## 6.1 
Stop NGINX on your machine:

    nginx -s quit

## 6.2 
Change directory into /loadbalancer

    cd loadbalancer

## 6.3 
Click through the files in /loabalancer to check what's happening:

In **docker-compose.yml** ...

There are four containers or 'services' we are about to start (four virtual machines in our docker network).

- NGINX will be our loadbalancer. This is mapped to our port 80, so we'll access the page in the browser the same way as previously.
- server_1, an express.js backend
- server_2, another express.js backend
- server_3, another express.js backend

The three express.js backend workers will run as three separate hosts (although they have the same logic in each one). Rather than assigning different ports to each of them, NGINX will be able to access them with this docker network's namespacing feature eg. http://server_1, http://server_2, http://server_3 .

In **/server** ...

- A Dockerfile builds a Node JS container, with express.js installed and our server.js file.
- For this demo, server.js simply returns some plain text on receiving a GET request.

In **nginx.conf** ...

For now, this will return something simple, too.

    http {
        
        server {
            listen 80;
            root /myfiles;

            location / {
                return 200 "This text is served by NGINX";
            }
        }
    }

events {}

## 6.4 
Startup this network with docker compose:

    docker compose up

After a few seconds, you will see that all four containers have started.
If you go to your browser, you will see something very uninteresting.

## 6.5 
Enable reverse-proxy:

Put simply, we need to tell NGINX to forward any requests onto someone else. NGINX will then be acting as a **reverse proxy**.

Update loadbalancer/nginx.conf to look like this:

        http {
            
            server {
                listen 80;
                root /myfiles;

                location / {
                    proxy_pass http://server_1;
                }
            }
        }

    events {}

Stop and re-start the containers.

    ctrl + c
    docker compose up

or, in a separate terminal

    docker-compose down && docker-compose up

Now if you go to your browser, you will see something *slightly* more interesting. 

## 6.6 
Enable loadbalancing:

For this, we declare a list of known backend hosts. We nginx stores this list as a variable now, so we could call it any string, but this example uses 'backend_hosts'.

Then, in the location context, we proxy the requests using the $backend_hosts variable.

Update loadbalancer/nginx.conf to look like this:

    http {
        upstream backend_hosts {
            server server_1;
            server server_2;
            server server_3;
        }
        
        server {
            listen 80;
            root /myfiles;

            location / {
                proxy_pass http://backend_hosts;
            }
        }
    }

    events {}

Restart the containers and check your browser. Wow!

## 6.7 Control the backend routing
If we want to specify which backend service to use, depending on the request path (instead of NGINX choosing for us), we can use a 'map' context.

Update loadbalancer/nginx.conf to look like this:

http {
        upstream backend_hosts {
            server server_1;
            server server_2;
            server server_3;
        }

        map $uri $specific_host {
            /first server_1;
            /second server_2;
            /third server_3;
            default backend_hosts;
        }
        
        server {
			resolver 127.0.0.11;
            listen 80;
            root /myfiles;

            location / {
                proxy_pass http://$specific_host;
            }
        }
    }

    events {}

# 7 NGINX for microservice apps

With the steps in (6), you know enough to envisage NGINX being used as a kind of API Gateway - a single server that manages the routing to multiple other backend services. These services could serve any kind of data including .json, images and videos.

Loadbalancing and backend routing are very useful features of NGINX from an infrastructure and performance perspective, obviously. But next we're going to look at something more DevOps minded.

To push infra/ops to he left, one approach we can take is a microservice architecture - the use of multiple backend services to be consumed by a single application. This allows two things to happen. First, it allows for good separation of concerns ( the upshot being smaller, more agile components that can be updated in iterations independently of other components). Second, it means up-scaling of capacity can be targeted to the backend services that are seeing the most activity.

As a fun experiment, we are going to build a simple UI that uses NGINX as this kind of Gateway to fetch various different page components from other backends locations ... specifically yours!

## 7.1
In your code editor, open up /microservice-app/html

You won't need to edit anything in here: these files are already being served at ADDRESS_OF_DASHBOARD_HOST. They are included in this repo only for those who want to look more closely in their own time.

Try going to ADDRESS_OF_DASHBOARD_HOST in your browser.

This app is the 'skeleton' of a dashboard page (think 1990s desktop with custom widgets).

## 7.2
In your code editor, open up /microservice-app/nginx.conf

Observe the 'map' context.

    map $uri $backend {
        /widget/example1 ADDRESS_OF_DASHBOARD_HOST:3000;
        /widget/example2 ADDRESS_OF_DASHBOARD_HOST:3001;
        /widget/example3 ADDRESS_OF_DASHBOARD_HOST:3002;
    }
