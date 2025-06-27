import { Vector2 } from "three";
import * as lil_gui from "lil-gui";

let localStorageVariable = "";

export const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export const mouse = new Vector2();

export const commonEventListeners = (camera, renderer, canvas) => {
    autoResize(camera, renderer);
    mouseMove();
    // doubleClickToFullScreen(canvas);
};

export const autoResize = (camera, renderer) => {
    window.addEventListener("resize", () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
};

export const doubleClickToFullScreen = (canvas) => {
    window.addEventListener("dblclick", () => {
        const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
        if (!fullscreenElement) {
            if (canvas.requestFullscreen) canvas.requestFullscreen();
            else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    });
};

export const mouseMove = () => {
    window.addEventListener("mousemove", (e) => {
        mouse.x = (e.clientX / sizes.width) * 2 - 1;
        mouse.y = -(e.clientY / sizes.height) * 2 + 1;
    });
};

export const guiInit = (lesson = "", debugObj) => {
    localStorageVariable = lesson;
    const gui = new lil_gui.GUI({ closed: true, width: 400 });
    // gui.domElement.style.display = 'none';

    gui.onFinishChange(() => {
        localStorage.setItem(localStorageVariable, JSON.stringify(debugObj));
    });
    gui.onFinishChange(() => {
        localStorage.setItem(localStorageVariable, JSON.stringify(debugObj));
    });

    const savedSettings = JSON.parse(localStorage.getItem(localStorageVariable));
    if (savedSettings) {
        console.log(
            `Debug parameters from localStorage [${localStorageVariable}] : `,
            savedSettings
        );
        Object.assign(debugObj, savedSettings);
    }
    const temp = {
        copyToClipboard: () => {
            const copyParams = { ...debugObj };
            delete copyParams.copyToClipboard;

            const code = `const debugObj = ${JSON.stringify(copyParams, null, 4)};`;
            navigator.clipboard.writeText(code).then(() => {
                console.log(`[${localStorageVariable}] Debug parameters copied to clipboard`);
            });
        },
    };

    gui.add(temp, "copyToClipboard").name("📋 Copy Config");

    return gui;
};

