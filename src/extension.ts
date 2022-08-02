// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { commands, window } from "vscode";


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

const R = 1 / 2

const H = 50

const getHeight = (h: number) => `${h}vh`

const getWidth = (h: number) => `${h * R}vh`


const bgImgCss = objectToCssString({
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

let hasDec = false

let yScrollPos: number = NaN

export function activate(context: vscode.ExtensionContext) {
	const decoration = vscode.window.createTextEditorDecorationType({
		// Title and Count cannot use the same pseudoelement
		before: {
			contentText: "",
			color: "#fff",
			textDecoration: `none; ${DEFAULT_CSS} ${bgImgCss}`,
		},
		rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
	})

	const updateYScrollPosition = (start: any) => {
		yScrollPos = start._line
	}

	const isScrolling = (start: any) => start._line !== yScrollPos

	const initPanik = () => {
		let editor = vscode.window.activeTextEditor;

		if (!editor) return

		//@ts-ignore
		const firstVisibleRange = editor.visibleRanges.sort()[0];
		const { _start } = firstVisibleRange
		const position = firstVisibleRange.start;

		if (isScrolling(_start)) {
			console.debug('updating panik man')
			const ranges = [new vscode.Range(position, position)];
			editor.setDecorations(decoration, ranges)
			updateYScrollPosition(_start)
		}

		return
	}

	initPanik()

	// vscode.workspace.onDidChangeTextDocument(initPanik)

	vscode.window.onDidChangeTextEditorVisibleRanges(initPanik)
}

// this method is called when your extension is deactivated
export function deactivate() { }
