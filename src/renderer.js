/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { createApp } from 'vue'
import App from './App.vue'

import './index.css';

const app = createApp(App)

app.mount('#app')

document.addEventListener('dragover', (event) => {
    event.preventDefault()
    event.stopPropagation()
})

document.addEventListener('drop', (event) => {
    event.preventDefault()
    event.stopPropagation()

    let pathArr = []
    for (const f of event.dataTransfer.files) {
        pathArr.push(f.path)
    }

    if (pathArr.length === 1) {
        window.api.send('loadFile', pathArr[0])
    } else {
        alert('Only one file at a time, please.')
    }
})
