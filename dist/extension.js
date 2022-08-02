/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = exports.withEnableCommand = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(__webpack_require__(1));
const vscode_1 = __webpack_require__(1);
let posX = 0;
const objectToCssString = (settings) => {
    let value = '';
    const cssString = Object.keys(settings).map(setting => {
        value = settings[setting];
        if (typeof value === 'string' || typeof value === 'number') {
            return `${setting}: ${value};`;
        }
    }).join(' ');
    return cssString;
};
const DEFAULT_CSS = objectToCssString({
    position: 'absolute',
    right: "5%",
    top: "20px",
    ['font-family']: "monospace",
    ['font-weight']: "900",
    // width: "50px",
    ['z-index']: 1,
    ['pointer-events']: 'none',
    ["text-align"]: "right",
});
const imgUrl = "https://raw.githubusercontent.com/S-Nuttapong/co-panik/main/assets/panik.gif";
const bgImgCss = objectToCssString({
    width: `60vh`,
    height: `80vh`,
    "background-repeat": 'no-repeat',
    ["background-size"]: 'contain',
    ["background-position"]: 'right',
    ["z-index"]: 9999,
    ["background-color"]: `red`,
    ["background-image"]: `url("${imgUrl}")`,
    right: `${-10}vh`,
    top: '-10vh'
});
function withEnableCommand() {
    return vscode_1.commands.registerCommand("enable", () => {
        vscode_1.window.showInformationMessage("panik enable !!");
    });
}
exports.withEnableCommand = withEnableCommand;
function onDidChangeTextDocument(event) {
    console.debug('text changed', { event });
    console.debug(event.contentChanges);
}
function activate(context) {
    console.log({ DEFAULT_CSS, bgImgCss });
    const editor = vscode.window.activeTextEditor;
    const decoration = vscode.window.createTextEditorDecorationType({
        // Title and Count cannot use the same pseudoelement
        before: {
            contentText: "",
            color: "#fff",
            textDecoration: `none; ${DEFAULT_CSS} ${bgImgCss}`,
        },
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    });
    //@ts-ignore
    const firstVisibleRange = editor?.visibleRanges.sort()[0];
    const position = firstVisibleRange.start;
    const ranges = [new vscode.Range(position, position)];
    editor?.setDecorations(decoration, ranges);
    vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map