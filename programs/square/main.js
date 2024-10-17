import { display } from "./square.js"

const initCanvas = () => {
    const canvas = document.querySelector("#glCanvas");

    const gl = canvas.getContext("webgl");

    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    return gl;
}

function main() {
    let gl = initCanvas();
    display(gl);
}

main();
