// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as CSS from 'csstype';
import * as vscode from 'vscode';
import { commands, window } from "vscode";

interface Style extends CSS.Properties, CSS.PropertiesHyphen { }

const objectToCssString = (settings: any) => {
	let value = '';
	const cssString = Object.keys(settings).map(setting => {
		value = settings[setting];
		if (typeof value === 'string' || typeof value === 'number') {
			return `${setting}: ${value};`
		}
	}).join(' ');

	return cssString;
}

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

const imgUrl = "https://raw.githubusercontent.com/S-Nuttapong/co-panik/main/assets/panik-loop.gif"


// const a: Style = {
// 	backgroundSize: 
// 	'
// }

const R = 1

const H = 20

const getHeight = (h: number) => `${h}vh`

const getWidth = (h: number) => `${h * R}vh`


const bgImgCss = objectToCssString({
	width: getWidth(H),
	height: getHeight(H),
	"background-repeat": 'no-repeat',
	["background-size"]: 'contain',
	["background-position"]: 'right',
	["z-index"]: 9999,
	["background-image"]: `url("${imgUrl}")`,
	// right: '10vh',
	// top: '10vh'
})


export function withEnableCommand() {
	return commands.registerCommand("enable", () => {
		window.showInformationMessage("panik enable !!")
	})
}

function onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
	console.debug('text changed', { event })
	console.debug(event.contentChanges)
}


export function activate(context: vscode.ExtensionContext) {
	console.log({ DEFAULT_CSS, bgImgCss })

	const editor = vscode.window.activeTextEditor

	const decoration = vscode.window.createTextEditorDecorationType({
		// Title and Count cannot use the same pseudoelement
		before: {
			contentText: "",
			color: "#fff",
			textDecoration: `none; ${DEFAULT_CSS} ${bgImgCss}`,
		},
		rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
	})

	//@ts-ignore
	const firstVisibleRange = editor?.visibleRanges.sort()[0];
	const position = firstVisibleRange.start;
	const ranges = [new vscode.Range(position, position)];

	editor?.setDecorations(decoration, ranges)

	vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument)
}

// this method is called when your extension is deactivated
export function deactivate() { }
