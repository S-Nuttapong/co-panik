import fs from 'fs';
import { editorCss } from "./ENV";

export interface DokiStickers {
    stickerDataURL: string;
    backgroundImageURL: string;
    wallpaperImageURL: string;
    backgroundAnchoring: string;
}

export enum InstallStatus {
    INSTALLED,
    NOT_INSTALLED,
    FAILURE,
    NETWORK_FAILURE,
}

type IndexFinderDude = (currentCss: string) => number;

const stickerComment = "/* Stickers */";
const hideComment = "/* Hide Watermark */";
const wallpaperComment = "/* Background Image */";
const backgroundComment = "/* EmptyEditor Image */";


export function buildCSSWithStickers(dokiStickers: Pick<DokiStickers, "stickerDataURL">): string {
    return `${getStickerScrubbedCSS()}${buildStickerCss(dokiStickers)}`;
}

function buildStickerCss({ stickerDataURL: stickerUrl }: Pick<DokiStickers, "stickerDataURL">): string {
    const style =
        "content:'';pointer-events:none;position:absolute;z-index:9001;width:100%;height:100%;background-position:100% 97%;background-repeat:no-repeat;opacity:1;";
    return `
    ${stickerComment}
    body > .monaco-workbench > .monaco-grid-view > .monaco-grid-branch-node > .monaco-split-view2 > .split-view-container::after,
    body > .monaco-workbench > .monaco-grid-view > .monaco-grid-branch-node > .monaco-split-view2 > .monaco-scrollable-element > .split-view-container::after
    {background-image: url('${stickerUrl}');${style}}
  
    /* Makes sure notification shows on top of sticker */
    .notifications-toasts {
      z-index: 9002 !important;
    }
  
    /* glass pane to show sticker */
    .notification-toast {
      backdrop-filter: blur(2px) !important;
    }
  `;
}

export const getStickerIndex = (currentCss: string) =>
    currentCss.indexOf(stickerComment);
export const getHideIndex = (currentCss: string) =>
    currentCss.indexOf(hideComment);
export const getWallpaperIndex = (currentCss: string) =>
    currentCss.indexOf(wallpaperComment);
export const getBackgroundIndex = (currentCss: string) =>
    currentCss.indexOf(backgroundComment);

const indexGetters = [
    getStickerIndex, getWallpaperIndex, getHideIndex, getBackgroundIndex
]

function getStickerScrubbedCSS() {
    return readVSCodeCSSAndScrubAsset(
        indexGetters.filter(getter => getter !== getStickerIndex),
        getStickerIndex
    );
}

function readVSCodeCSSAndScrubAsset(
    getOtherAssets: IndexFinderDude[],
    getAssetToRemoveIndex: IndexFinderDude
) {
    const currentVSCodeCss = fs.readFileSync(editorCss, "utf-8");
    return scrubProvidedCssOfAsset(getOtherAssets, getAssetToRemoveIndex, currentVSCodeCss);
}

function scrubProvidedCssOfAsset(
    getOtherAssets: IndexFinderDude[],
    getAssetToRemoveIndex: IndexFinderDude,
    currentCss: string
) {
    const otherAssetIndices = getOtherAssets.map(assetFinder => assetFinder(currentCss));
    const assetToRemoveIndex = getAssetToRemoveIndex(currentCss);
    const otherIndex = otherAssetIndices.reduce((accum, index) => Math.max(accum, index), -1);
    if (otherIndex < 0) {
        return trimCss(currentCss, assetToRemoveIndex);
    } else if (assetToRemoveIndex > -1) {
        const smolestGreater = otherAssetIndices
            .filter(otherIndex => assetToRemoveIndex < otherIndex)
            .reduce((accum, index) => Math.min(accum, index), Number.POSITIVE_INFINITY)
        return (
            currentCss.substring(0, assetToRemoveIndex) +
            (smolestGreater < Number.POSITIVE_INFINITY
                ? "\n" + currentCss.substring(smolestGreater, currentCss.length)
                : "")
        );
    }
    return currentCss;
}

function trimCss(currentCss: string, index: number): string {
    if (index >= 0) {
        return currentCss.substr(0, index).trim();
    }
    return currentCss;
}