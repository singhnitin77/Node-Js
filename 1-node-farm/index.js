const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify'); //3rd party module
/* 
So slugify will be a function which we can use to basically create slugs
Slug is just the last part of a URL that contains a unique string that identifies the resource that the website is displaying 
*/

const replaceTemplate = require('./modules/replaceTemplate');


////////////////////////////////////////////////
// fs stands for file system. by using this module here we will get access to functions for reading data and writing data to the the file object. This returns an object which we store 

// Synchronous version of file reading, 
/* 
processed line by line one after another, first file system module is required then file is read n we log the result to the console. This can become a problem specially with slow operations because each line blocks the execution of the rest of the code, so we say synchronous code is also called as blocking code  
*/



/*there is also an asynchronous version
readFileSync takes 2 arguments 
1. Path to the file that we are reading 
2. Character encoding
*/
// fs.readFileSync('./txt/input.txt','utf-8');
const textIn = fs.readFileSync('./txt/input.txt','utf-8');
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt',textOut);
console.log("File written");

//////////////// Reading and writing files asynchronously
/* fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data3) => {
            console.log(data3);

            fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8', err => {
                console.log("Your file has been written");

            })
        });
    });
});
console.log('WIll read file!'); */

/* 
WIll read file!
read-this
*/

/////////////////////////////////////////////////////////////////////////////////////
// SERVER
/* http.createServer((req, res) => {
    res.end('Hello from the server!');
}); */

/* 
Creating a server 
Listening to incoming request from the client 
*/

/* const server = http.createServer((req, res) => {
    console.log(req);
    res.end('Hello from the server!');
});

server.listen(8000,'127.0.0.1', () => {
    console.log('Listening to request on port 8000');
}) */

/* 
We created our server using create server n passsed in callback function that is executed each time a new request hits the server  and then we started listening for incoming requests on the local host IP and then port 8000 
*/

// ////////////////////////////////////////////////////////////////////////////////////
// Routing
/* 
We use another built-in module i.e URL 
*/

/* const server = http.createServer((req, res) => {
    // console.log(req.url);
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end('This is the OVERVIEW');
    } else if (pathName === '/product') {
        res.end('This is the PRODUCT');
    } else if (pathName === '/api') {
        res.end('API');
    }else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
        // res.end('Page not found!');
    }
    // res.end('Hello from the server!');
}); */

/* 
An HTTP header is basically a piece of information about the response that we are sending back. 
These routes that we defined in our code and the routes that we put in the URLs in the browser have nothing to do with the files and folders in our project file system.
*/

/* server.listen(8000,'127.0.0.1', () => {
    console.log('Listening to request on port 8000');
}) */

/////////////////////////////////////////////////////////////////////////////////////
// BULDING A VERY SIMPLE API
/* 
An API is a service from which we can request some data.
JSON format look likes js code 
We want to read the data from the JSON file, then parse json into javascript and then send back that result to the client.
*/


// Using Sync version
/* const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data); */

/* 
As this is top level code so it will be only executed once we no need to worry about Sync version code-blocking problem.
*/

/* const server = http.createServer((req, res) => {
    // console.log(req.url);
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end('This is the OVERVIEW');
    } else if (pathName === '/product') {
        res.end('This is the PRODUCT');
    } else if (pathName === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
        // res.end('API');
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>'); */
        // res.end('Page not found!');
    // }
    // res.end('Hello from the server!');
// });

/* 
This is not perfect, each time someone hits /api route, the file have to be read and then sent back. Instead what we can do is to just read the file once in the beginning and each time someone hits this route simply sent back the data without having to read it each time. 
*/

/* server.listen(8000,'127.0.0.1', () => {
    console.log('Listening to request on port 8000');
}) */

// /////////////////////////////////////////////////////////////////////////////
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
  
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
  
// console.log(slugify('Fresh Avocadoes', { lower: true }));

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);
/* 
this slugify is now a dependency of our code because without that package this piece of code would no longer work.  
*/
  
const server = http.createServer((req, res) => {
const { query, pathname } = url.parse(req.url, true);
  
    // Overview page
    if (pathname === '/' || pathname === '/overview') {
      res.writeHead(200, {
        'Content-type': 'text/html'
      });
  
      const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
      const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
      res.end(output);
  
      // Product page
    } else if (pathname === '/product') {
      res.writeHead(200, {
        'Content-type': 'text/html'
      });
      const product = dataObj[query.id];
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
  
      // API
    } else if (pathname === '/api') {
      res.writeHead(200, {
        'Content-type': 'application/json'
      });
      res.end(data);
  
      // Not found
    } else {
      res.writeHead(404, {
        'Content-type': 'text/html',
        'my-own-header': 'hello-world'
      });
      res.end('<h1>Page not found!</h1>');
    }
  });
  
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});

/* 
Till now we have seen how to require nodejs core modules , how to require our own modules, Now we'll see how to requrie 3rd party modules from the NPM registry 

Core module first
then 3rd party modules
modules coming from local file system
*/

///////////////////////////////////////////////////
// PACKAGE VERSIONING AND UPDATING
/* 
Most of the packages on npm follow the so-called semantic version notation, which means version no. is expressed as 3 numbers.
"nodemon": "^2.0.15"
The patch version - 15 is only intended to fix bugs
Minor version - 0 
Major version - 2
^ before 2 specifies which updates we accept for each of the packages, we accept patch and minor releases. 
*/

// UPDATING PACKAGES
/* 
npm outdated - gives us a table with all packages that are outdated.
We can actually install a certain package with a certain number.
npm install slugify@1.0.0

npm update slugify

npm i express
npm uninstall express

NODE MODULES FOLDER
We will never share mode modules folder because we can get these from npm, It has tons of folders with tons of files

How to get back our dependicies or node module folder
npm install
It read our package.json file and downloads node modules.

If we share our code, we want the other developer to be using same exact version , so that code works exactly same for both

Always share your package.json file and package-lock.json files.
*/

