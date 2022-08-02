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
    // width: "50px",
    ['z-index']: 1,
    ['pointer-events']: 'none',
    ["text-align"]: "right",
});
const panikImg = "https://raw.githubusercontent.com/S-Nuttapong/co-panik/main/assets/panik.gif";
const kalmImg = "https://raw.githubusercontent.com/S-Nuttapong/co-panik/main/assets/kalm.png";
const imgs = [kalmImg, panikImg];
// const a: Style = {
// 	backgroundSize: 
// 	'
// }
const R = 1 / 2;
const H = 50;
const getHeight = (h) => `${h}vh`;
const getWidth = (h) => `${h * R}vh`;
const bgImgCss = (imgUrl) => objectToCssString({
    width: getWidth(H),
    height: getHeight(H),
    "background-repeat": 'no-repeat',
    ["background-size"]: 'contain',
    ["background-position"]: 'right',
    ["z-index"]: 9999,
    //["background-color"]: 'red',
    ["background-image"]: `url("${imgUrl}")`,
    // right: '10vh',
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
let hasDec = false;
let yScrollPos = NaN;
function activate(context) {
    const initDecorationTypeFN = () => {
        let img = kalmImg;
        let decoration = vscode.window.createTextEditorDecorationType({
            // Title and Count cannot use the same pseudoelement
            before: {
                contentText: "",
                color: "#fff",
                textDecoration: `none; ${DEFAULT_CSS} ${bgImgCss(img)}`,
            },
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        });
        return (imgUrl) => {
            if (imgUrl !== img) {
                img = imgUrl;
                decoration.dispose();
                decoration = vscode.window.createTextEditorDecorationType({
                    // Title and Count cannot use the same pseudoelement
                    before: {
                        contentText: "",
                        color: "#fff",
                        textDecoration: `none; ${DEFAULT_CSS} ${bgImgCss(img)}`,
                    },
                    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
                });
            }
            return decoration;
        };
    };
    const getDecorationType = initDecorationTypeFN();
    const updateYScrollPosition = (start) => {
        yScrollPos = start._line;
    };
    const isScrolling = (start) => start._line !== yScrollPos;
    const initPanik = () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        //@ts-ignore
        const firstVisibleRange = editor.visibleRanges.sort()[0];
        const { _start } = firstVisibleRange;
        const position = firstVisibleRange.start;
        if (!isScrolling(_start))
            return;
        const img = imgs[Math.round(Math.random())];
        const decoration = getDecorationType(img);
        const ranges = [new vscode.Range(position, position)];
        editor.setDecorations(decoration, ranges);
        updateYScrollPosition(_start);
    };
    initPanik();
    // vscode.workspace.onDidChangeTextDocument(initPanik)
    vscode.window.onDidChangeTextEditorVisibleRanges(initPanik);
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