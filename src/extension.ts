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

const panikImg = "https://raw.githubusercontent.com/S-Nuttapong/co-panik/main/assets/panik.gif"

const kalmImg = "https://raw.githubusercontent.com/S-Nuttapong/co-panik/main/assets/kalm.png"

const imgs = [kalmImg, panikImg]

// const a: Style = {
// 	backgroundSize: 
// 	'
// }

const R = 1 / 2

const H = 50

const getHeight = (h: number) => `${h}vh`

const getWidth = (h: number) => `${h * R}vh`


const bgImgCss = (imgUrl: string) => objectToCssString({
	width: getWidth(H),
	height: getHeight(H),
	"background-repeat": 'no-repeat',
	["background-size"]: 'contain',
	["background-position"]: 'right',
	["z-index"]: 9999,
	//["background-color"]: 'red',
	["background-image"]: `url("${imgUrl}")`,
	// right: '10vh',
	top: '-5vh'
})


export function withEnableCommand() {
	return commands.registerCommand("enable", () => {
		window.showInformationMessage("Co-Panik Enable 😱")
	})
}

function onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
	console.debug('text changed', { event })
	console.debug(event.contentChanges)
}

let hasDec = false

let yScrollPos: number = NaN

enum Severity {
	Kalm,
	Panik,
	VeryPanik
}

const SeverityCalculator = (sources = ['ts']) => (diagnostic: vscode.Diagnostic[] = []) => {
	const isAuditedSrc = ({ source }: vscode.Diagnostic) => !!source && sources.includes(source)
	return diagnostic.filter(isAuditedSrc).length
}

const getSeverityScore = SeverityCalculator()

const panikFactorNormalizer = (score: number) => Math.max(score - 3, 0)

const getSeverity = (score: number, normalizer = panikFactorNormalizer): Severity => {
	const normalizedScore = normalizer(score)

	switch (normalizedScore) {
		case 0: return Severity.Kalm
		case 1: return Severity.Panik
		default: return Severity.VeryPanik
	}
}

const ImgUrlBySeverity = {
	[Severity.Kalm]: kalmImg,
	[Severity.Panik]: panikImg,
	[Severity.VeryPanik]: panikImg
}

const getImgUrlBySeverity = (serverity: Severity) => ImgUrlBySeverity[serverity]

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(withEnableCommand())
	
	const initDecorationTypeFN = () => {
		let img = kalmImg
		let decoration = vscode.window.createTextEditorDecorationType({
			// Title and Count cannot use the same pseudoelement
			before: {
				contentText: "",
				color: "#fff",
				textDecoration: `none; ${DEFAULT_CSS} ${bgImgCss(img)}`,
			},
			rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
		})

		return (imgUrl: string) => {
			const isSameImg = imgUrl === img

			if (!isSameImg) {
				img = imgUrl
				decoration.dispose()
				decoration = vscode.window.createTextEditorDecorationType({
					// Title and Count cannot use the same pseudoelement
					before: {
						contentText: "",
						color: "#fff",
						textDecoration: `none; ${DEFAULT_CSS} ${bgImgCss(img)}`,
					},
					rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
				})
			}

			return { decoration, isSameImg }
		}
	}

	const getDecorationType = initDecorationTypeFN()

	const updateYScrollPosition = (start: any) => {
		yScrollPos = start._line
	}

	const getCurrentEditorDiagnostics = () => {
		const uri = vscode?.window?.activeTextEditor?.document.uri;
		if (!uri) return []
		return vscode.languages.getDiagnostics(uri);
	}

	const isScrolling = (start: any) => start._line !== yScrollPos

	const initPanik = () => {
		let editor = vscode.window.activeTextEditor;

		if (!editor) return

		//@ts-ignore
		const firstVisibleRange = editor.visibleRanges.sort()[0];
		const { _start } = firstVisibleRange
		const position = firstVisibleRange.start;

		const diagnostic = getCurrentEditorDiagnostics()
		const score = getSeverityScore(diagnostic)
		const serverity = getSeverity(score)
		const imgUrl = getImgUrlBySeverity(serverity)
		const { decoration, isSameImg } = getDecorationType(imgUrl)
		const ranges = [new vscode.Range(position, position)];

		if (isScrolling(_start)) {
			editor.setDecorations(decoration, ranges)
			return updateYScrollPosition(_start)
		}

		if (isSameImg) return

		return editor.setDecorations(decoration, ranges)
	}

	initPanik()

	vscode.workspace.onDidChangeTextDocument(initPanik)

	vscode.window.onDidChangeTextEditorVisibleRanges(initPanik)
}

// this method is called when your extension is deactivated
export function deactivate() { }
