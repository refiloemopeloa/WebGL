import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
import { initShaderProgram } from "./shader-program.js";

async function readFile(fileName) {
    const response = await fetch(fileName);
    return response.text();
}

async function display(gl) {
    // Load shader sources
    const vertexShaderSource = await readFile("./shaders/vertexShader.glsl");
    const fragmentShaderSource = await readFile("./shaders/fragmentShader.glsl");

    // Initialize shader program
    let shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

    // Rest of the function remains the same
    const buffers = initBuffers(gl);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

    drawScene(gl, programInfo, buffers);
}


export {display};