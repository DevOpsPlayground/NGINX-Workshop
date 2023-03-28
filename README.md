# NGINX serving and routing basics

This workshop will be a hands-on introduction to NGINX (pronounced "engine-ex"), the open-source web server that, since its initial success as a web server, is now also used as a reverse proxy, HTTP cache, and load balancer.

## Requirements

- a machine running a linux os
- docker
- docker compose plugin

If you are taking part in this workshop live, you have been provided with a VM with all the necessary requirements.

(*nb. If you want to, you can follow this workshop on your own machine, with your own code editor, in your own time. This SHOULD be fine, but any configurations you may have previously made may affect the steps in the workshop. If doing so, you can skip ahead to step 1.*)

# 0. 
Login and open Code Editor

## 0.1 
Open your browser and go to lab.devopsplayground.org

## 0.2 
Login with your Meetup username (or if you joined by RSVPing to the Teams invite, use your Teams username, including any spaces)

## 0.3
After successfully logging in, use the urls provided to open two tabs:

- a tab for your VM's terminal
- a tab for your VM's code editor

## 0.4 
In your code editor, navigate to and open NGINX-Workshop/README.md. This will provide all the further steps and code snippets to follow along during the workshop.

## 0.5
In your terminal run the following command to add your panda name to some files we'll be using later:

    /home/playground/workdir/NGINX-Workshop/panda_name.sh <your-pandaname>


# 1. Install NGINX

## 1.1 
In your terminal:

    sudo amazon-linux-extras install nginx1

This installs NGINX on your machine.

## 1.2 
Check it has installed:

    nginx -v


# 2. Try out some commands

## 2.1 
To start nginx:

    sudo nginx

Go to your browser and see the default web page being served.

## 2.2 
We can see whether NGINX is running with this command:

    ps -ef |grep nginx

The 'master' and 'worker' processes run by default.

## 2.3
While NGINX is running, we send further commands with the -s "signal" flag. To stop nginx gracefully:

    sudo nginx -s quit

## 2.4
To stop nginx forcefully:

    sudo nginx -s stop

## 2.5
To see access logs (start nginx first):

    tail -f /var/log/nginx/access.log

## 2.6
Try reloading the page, or accessing it from another device. Notice the logs.

From your own terminal, let's compare 

    curl [your-pandname].devopsplayground.org
    curl [your-pandname].devopsplayground.org -X POST

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
In the **'/NGINX-Workshop/config'** directory of your Code editor, **create a new file called mynginx.conf**

### 3.2.2 
Insert (copy + paste) this code into mynginx.conf:

    user playground;
    
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
In your terminal, set liberal permissions to edit nginx.conf:

    sudo chmod 777 /etc/nginx/nginx.conf

### 3.2.5
Overwrite the contents of nginx.conf with your mynginx.conf:

    cat ~/workdir/NGINX-Workshop/config/mynginx.conf > /etc/nginx/nginx.conf

### 3.2.6 
Check this was successful:

    cat /etc/nginx/nginx.conf

Check your browser, we should have the same result as before. (Check you started NGINX first).

So what can we change?

# 4. Serve your own web content

Observe the line **root /usr/share/nginx/html;**. 

This single single key-pair, separated by a space and punctuated with a semi-colon is known as a 'directive'. 

This directive tells NGINX which folder to look in when serving web content (html, css, javascript, php etc.)

## 4.1 
In your code editor create a folder inside /NGINX-Workshop called 'public'.

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

and, in mynginx.conf, change the root directive to point to you /public folder;

    user playground;
    
    http {
        server {
            listen 80;
            root /home/playground/workdir/NGINX-Workshop/public;
        }
    }

    events {}

and update /etc/nginx/nginx.conf

    cat ~/workdir/NGINX-Workshop/config/mynginx.conf > /etc/nginx/nginx.conf

## 4.3 
Check your browser. What happened? Why wasn't the page updated?

Nothing has changed because we haven't told NGINX to 'reload' the contents of the config file.

    sudo nginx -s reload

Reload, then check your browser.

# 5 Page routing

What if you want to serve multiple pages eg /, /cart, /shipping, /contact ...

## 5.1 
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

## 5.2 
Add a location context to nginx.conf:

    user playground;
    
    http {
        server {
            listen 80;
            root /home/playground/workdir/NGINX-Workshop/public;

            location /cart {
                root /home/playground/workdir/NGINX-Workshop/public;
                try_files /cart.html =404;
            }
        }
    }

    events {}


Reload, 

    cat ~/NGINX-Workshop/config/mynginx.conf > /etc/nginx/nginx.conf
    nginx -s reload

Then check your browser at /cart.

So what if we want mutliple pages? Multiple location contexts? Is there is a cleaner way?

## 5.3
Create folders to organise files for the following pages:

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


## 5.4 
And update your nginx.conf with this:

    user playground;

    http {
        server {
            listen 80;
            root /home/playground/workdir/NGINX-Workshop/public;

            location / {
                root /home/playground/workdir/NGINX-Workshop/public;
            }
        }
    }

    events {}

Then, check the following in your browser

- [your_pandaname].devopsplayground.org
- [your_pandaname].devopsplayground.org/cart.html
- [your_pandaname].devopsplayground.org/cart
- [your_pandaname].devopsplayground.org/about

# 6 Serving other files

The most common types of files to serve alongside .html files are .css and .js files (and .php files but we're not going into that today) since these contain styles and logic for the web page.

## 6.1 
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

## 6.2 
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

## 6.3
In each styles.css file, **add some super-basic styling** so we can do a sense-check.

styles.css:

    h1 {
        color: <choose a color>
    }

## 6.4
In each script.js file, **add a console.log message** so we can do a sense-check.

script.js:

    console.log("script loaded successfully")

## 6.5 
Check each route in your browser. Huh?

Using the 'inspect' tool, looking at 'sources', we can see that 'styles.css' and script.js were loaded but styles have not been applied and (depending on your browser) the script might not have loaded. So what's going on?

## 6.6 
Let's talk about MIME types!

MIME types describe the media type of content served by web servers or web applications. They are intended to help provide a hint as to how the content should be processed and displayed. These days, most browsers have the ability to 'guess' the intention of a file by either scanning it or looking at its file extension, but this is not widely applied for reasons of security and loss of control.

TLDR - We need to tell the browser, when the content loads, which type of files (other than text/html) to accept.

## 6.7 
Add the following to nginx.conf:

    user playground;

    http {

        types {
            text/html html;
            text/css css;
            application/javascript js;
        }

        server {
            listen 80;
            root /home/playground/workdir/NGINX-Workshop/public;

            location / {
                root /home/playground/workdir/NGINX-Workshop/public;
            }
        }
    }

    events {}

Check your browser. Now, the .css and .js files should be accepted and working.

This is good, but could get messy if we have to include a directive for avry type of file we want to server. (There are many!)

## 6.8 
Add the following to nginx.conf:


    user playground;

    http {

        include mime.types;

        server {
            listen 80;
            root /home/playground/workdir/NGINX-Workshop/public;

            location / {
                root /home/playground/workdir/NGINX-Workshop/public;
            }
        }
    }

    events {}

Check your browser. Now, any files you serve will be interpreted correctly by your browser.

So now we know a little bit about serving static html files, enough to explore on your own, let's look at a different feature of NGINX, loadbalancing.

# 7 Load balancing

The use a of a loadbalancer is a common way to increase capacity, and the simplest way of managing this is a 'round robin' algorithm, where traffic is directed to the next backend worker each time a new request comes in.

We could spin up multiple 'worker' hosts to see this in action, but a far more cost-effective way is using docker. Docker can create a virtual network of hosts, essentially a VPC that runs on your own machine.

## 7.1 
Stop NGINX on your machine:

    sudo nginx -s quit

## 7.2 
Change directory into /loadbalancer

    cd workdir/NGINX-Workshop/loadbalancer

## 7.3 
In your code-editor, click through the files in /loabalancer to check what's happening:

In **docker-compose.yml** ...

There are four containers or 'services' we are about to start (four virtual machines in our docker network).

- NGINX will be our loadbalancer. This is mapped to our port 80, so we'll access the page in the browser the same way as previously.
- server_1, an express.js backend
- server_2, another express.js backend
- server_3, another express.js backend

The three express.js backend workers will run as three separate hosts (although they have the same logic in each one). Rather than assigning different ports to each of them, NGINX will be able to access them with this docker network's namespacing feature eg. http://server_1, http://server_2, http://server_3 .

In **/server** ...

- A Dockerfile builds a Node JS container, with express.js installed and starts the server.
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

## 7.4 
In your terminal, startup this network with docker compose:

    docker compose up

After a few seconds, you will see that all four containers have started. (This is much quicker after the first build)

If you go to your browser, you will see something reassuring, but very uninteresting.

## 7.5 
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

Now if you go to your browser, you will see something *slightly* more interesting. The request was forwarded to worker 1 and returned to us.

## 7.6 
Enable loadbalancing:

For this, we declare a list of known backend hosts. NGINX stores this list as a variable now, so we could name it any string, but this example uses the name 'backend_hosts'.

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

Restart the containers and check your browser. Refresh the page a few times. Wow!

## 7.7 Control the backend routing
If we want to control which backend service to use, depending on the request path (instead of NGINX choosing for us), we can use a 'map' context.

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

And check the following routes

- [your_pandaname].devopsplayground.org
- [your_pandaname].devopsplayground.org/first
- [your_pandaname].devopsplayground.org/second
- [your_pandaname].devopsplayground.org/third
- [your_pandaname].devopsplayground.org/anything-else

# 8 NGINX for microservice apps

With the steps in (7), you know enough to envisage NGINX being used as a kind of API Gateway - a single server that manages the routing to multiple other backend services. These services could serve any kind of data including .json, images and videos.

Loadbalancing and backend routing are very useful features of NGINX from an infrastructure and performance perspective, obviously. But next we're going to look at something more DevOps minded.

To push infra/ops to the left, one approach we can take is a microservice architecture - the use of multiple backend services to be consumed by a single application. This has many DevOps advantages. First, good separation of concerns means smaller, more agile components that can be frequently updated in iterations independently of other components. Second, it means scaling of capacity up or down can be targeted to the backend services that are seeing the most/least activity.

As a fun experiment, we are going to build a simple UI that uses NGINX as this kind of Gateway to fetch various different page components from other backends locations ... specifically from each of you!

## 8.1
In your code editor, look in /microservice-app/html.

You won't need to edit anything in here: This app is the 'skeleton' of a dashboard page (think 1990s desktop with custom widgets).

It will be accessible by all, but only needs to be served by one single host - mine, if you're following this live (if you're following this in your own time, you can launch this dashboard with the docker-compose.yml provided).

Try going to this page in your browser (ask Phil for his URL).

## 8.2
In your code editor, open up /microservice-app/nginx.conf

Observe the 'map' context.

    map $uri $backend {
        ~/widget/(\S+) $1.devopsplayground.org/;
        /widget/script.js $pandaname.devopsplayground.org/script.js;
        /widget/styles.css $pandaname.devopsplayground.org/styles.css;
        default not_found;
    }

This says that, after the inital dashboard page loads, if our dashboard server receives a request to /widget/any-panda, it will forward this request onto one of you, and request whatever *you* are serving.

(*If you're following this README.md in your own time, this map context should be updated to include the forwarding rules for whatever endpoints you are using (but it will already work with the three sample widgets provided).*)

## 8.3
In your browser, navigate to the hosted dashboard: 

    http://[whichever-panda-phil-is].devopsplayground.org

(*or, if following in your own time, http://localhost*)

## 8.4
Start serving your widget from your machine.

    cat ~/workdir/NGINX-Workshop/widget/nginx.conf > /etc/nginx/nginx.conf
    sudo nginx -s reload
    sudo nginx

## 8.5

    Develop your widget into something cool.

    Have fun!



**... If you like using react.js ...**

**in your code editor:**

- install nodejs, nvm and update npm:

        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
        . ~/.nvm/nvm.sh
        nvm install 16
        npm install -g npm@9.6.2

- create a react-app

        npx create-react-app react-widget

- perform the react build step

        npm run build

- change your nginx.conf file to the following:

        user playground;

        http {

            include mime.types;

            server {
                listen 80;
                add_header Access-Control-Allow-Origin *;
                root /home/playground/workdir/NGINX-Workshop/<PATH_TO_YOUR_REACT_APP>/build;

                location / {
                    try_files $uri /index.html;
                }
            }
        }

        events {}

- don't forget to 'reload' your nginx configuration:

        cat ~/workdir/NGINX-Workshop/widget/nginx.conf > /etc/nginx/nginx.conf
        sudo nginx -s reload