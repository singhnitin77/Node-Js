const fs = require('fs');
const http = require('http');
const url = require('url');


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

const server = http.createServer((req, res) => {
    // console.log(req.url);
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end('This is the OVERVIEW');
    } else if (pathName === '/product') {
        res.end('This is the PRODUCT');
    } else if (pathName === '/api') {

        // reading file
        fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data) => {
            const productData = JSON.parse(data);
            // console.log(productData);
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(data);
        });

        // res.end('API');
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
        // res.end('Page not found!');
    }
    // res.end('Hello from the server!');
});

/* 
This is not perfect, each time someone hits /api route, the file have to be read and then sent back. Instead what we can do is to just read the file once in the beginning and each time someone hits this route simply sent back the data without having to read it each time. 
*/

server.listen(8000,'127.0.0.1', () => {
    console.log('Listening to request on port 8000');
})
