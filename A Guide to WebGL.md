# A Guide to WebGL

## What is WebGL?

WebGL is a JavaScript API for rendering interactive graphics, both 2D and 3D, within any compatible web browser, and without the use of plug-ins. 

You can check if your browser is compatible from this link: [get.webgl.org](https://get.webgl.org/). If you see a spinning cube, your browser is compatible. If not, then consider using a different browser for the purposes of WebGL. You can check the list here: [WebGL - 3D Canvas graphics | Can I use... Support tables for HTML5, CSS3, etc](https://caniuse.com/webgl).

## Setup

First let us begin with preparing our environment for WebGL development. 

### Tools

#### Web Browser

I recommend the following based on your operating system:

##### Windows

**Microsoft Edge**. Trust me, you don't want both Windows and your browser hogging all your RAM while you do this.

##### Linux

**Firefox**. It is quite optimized for Linux and comes in-built into some distros, like Ubuntu.

##### macOS

**Safari**. Very optimized for macOS devices.

#### Development Environment

This is where you'll write your actual code. 

##### VS Code

By far one of the best IDE's when it comes to web development of any form. Add some WebGL and GLSL plugins and you'll be cooking!

##### WebStorm

If you love a well-built IDE that offers a seamless experience with lots of bells and whistles, then WebStorm will be your best friend. Of course, you'll have to fork out a few bucks. My recommendation is to check with your school or organization for licenses. 

##### Text Editor

Sure, go ahead... I mean, I don't know why your code isn't compiling either but, yeah, go ahead. Jokes aside, you can actually get a lot done with a text editor, if you trust your syntax knowledge.

### Node.js

Here's a guide on how to set up Node.js: [A Guide to Node.js](https://github.com/refiloemopeloa/Guides/blob/main/Web%20Development/JS/Node.js.md)

## Project structure

Every WebGL project should have the following files:

* `index.html`
* `main.js`

You can, of course, keep your JavaScript code in your HTML file in a script tag, but good practice is to separate everything so that it is easier to read and edit.

### index.html

The `index.html` page is responsible for rendering the actual page that everything and anything will be displayed on, including our graphics.

```HTML
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>WebGL Demo</title>
    <script src="main.js" type="module"></script>
  </head>

  <body>
    <canvas id="glcanvas" width="640" height="480"></canvas>
  </body>
</html>
```

Our graphics will render on the `canvas` object.

### main.js

The `main.js` file is where our actual graphics processing and rendering happens.

```js
main();

//
// start here
//
function main() {
  const canvas = document.querySelector("#glcanvas");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it.",
    );
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
}
```

The `main()` function is called when our script is loaded sets up the WebGL context and starts rendering content.

## Running our file

Unfortunately, we cannot just run our HTML file by opening the file in our browser. It needs to be run from a server. So, first, we have to set up our server. 

### Python

There's a short solution to this, by using Python. Simply open the directory where you have your project files in and run the following in your terminal:

```shell
python -m http.server 8001
```

This will create a server on your local machine with the port 8001. Then, when you want to run your project, simple type:

```http
https://localhost:8001/index.html
```

This should show your project.

The problem with this method is that every time you make your changes, you have to refresh your page to see the changes. there is a more elegant solution using Live Server.

### Live Server

In your project directory, type the following:

```shell
npm install live-server
```

This will install Live Server as a module in your directory. Then, to run your project, simply type:

```shell
npx live-server
```

You can also add it to your `package.json` file and use `npm run start` to run it:

```json
"scripts": {  
  "start": "live-server"  
}
```

Now, whenever you save, your changes will automatically update.

### What do you see?

If everything went well, you should see the following:

![hello-WebGL.png](assets/hello-WebGL.png)

## Data Structures

Let's start with the data structures we can us in WebGL.
### glMatrix

`glMatrix` is a popular library for handling matrix and vector operations in WebGL. It is optimized for high performance in graphics computations.

Here's an example:

```js
const projection = mat4.create();    // projection matrix
const modelview = mat4.create();     // modelview matrix
const modelviewProj = mat4.create(); // combined transformation matrix
const normalMatrix = mat3.create(); // matrix, derived from modelview matrix, for transforming normal vectors

mat4.multiply( modelviewProj, projection, modelview ); //Multiply the modelview and projection transforms to get the combined transform
```

### Vertex Buffer Object

A vertex buffer object is basically block of memory that holds the coordinates or other attributes for a set of vertices.

Here's some code showing to enable and use VBOs:

```js
function drawPrimitive( primitiveType, color, vertices ) {
     gl.enableVertexAttribArray(a_coords_loc);
     gl.bindBuffer(gl.ARRAY_BUFFER,a_coords_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
     gl.uniform4fv(u_color, color);
     gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
     gl.drawArrays(primitiveType, 0, vertices.length/3);
}
```

## Model View Projection

When we give our models coordinates, they aren't immediately visible on our screen. We need to do a bit of manipulating first.

### Model matrix

The model matrix defines how you take the original model and move it around in 3D world space.

### Projection matrix

The projection matrix is used to convert world space coordinates into clip space coordinates.

#### Perspective projection matrix

This mode is used to mimic the effects of a typical camera viewing the world.

### View matrix

The view matrix moves the objects in the scene to simulate the position of the camera being changed, altering what the viewer currently sees. It's job is to translate, rotate, and scale objects in the scene.

### Clip space

Clip space defines the region that the GPU renders. The vertex shader transforms the points of our model to clip space for the GPU to render. Anything outside of the range of clip space will not be rendered. Clip coordinates range between `(-1,-1,-1)` and `(1,1,1)`. This is known as Normalized Device Coordinates (NDC).

### Viewing frustrum

The viewing frustrum represents the region of space that is visible to the user. It is defined by the field-of-view, nearest distance and farthest distance.
## Adding 2D objects

Let's start by adding a 2D square to our WebGL context. To do this, we will be using the `glMatrix` library to perform matrix operations. To do this, we have to make a few changes to our `index.html` file template.

Create a new directory called `square` and add the usual `index.html` and `main.js` files. Then, add the following code to your `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>WebGL Demo</title>
    <link rel="stylesheet" href="./webgl.css" type="text/css" />
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js"
      integrity="sha512-zhHQR0/H5SEBL3Wn6yYSaTTZej12z0hVZKOv3TwCUXT1z5qeqGcXJLLrbERYRScEDDpYIJhPC1fk31gqR783iQ=="
      crossorigin="anonymous"
      defer></script>
    <script src="webgl-demo.js" type="module"></script>
  </head>

  <body>
    <canvas id="glcanvas" width="640" height="480"></canvas>
  </body>
</html>
```

To display anything in WebGL, you have to make use of shaders. Because of this, the guide for adding 2D objects continues in this guide: [Shaders in WebGL: Square demo](https://github.com/refiloemopeloa/Shaders/blob/main/WebGL/Shaders%20in%20WebGL.md#square-demo). You can read on shaders if you would like, but if not skip straight to the part where we add a square to the screen.


# References

1. [WebGL: 2D and 3D graphics for the web - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
2. [Getting started with WebGL - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL)
3. [WebGL model view projection - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection)