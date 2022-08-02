import fs from 'fs';
import path from 'path';
import { ExtensionContext, workspace } from "vscode";
import { editorCss, isWSL, workbenchDirectory } from './ENV';
import { buildCSSWithStickers, DokiStickers, InstallStatus } from "./StickerService";
import { canWrite } from "./utils";

export interface Sticker {
    path: string;
    name: string;
    anchoring: string;
}

export async function installStickers(
    sticker: Sticker,
    context: ExtensionContext
): Promise<InstallStatus> {
    return installStyles(sticker, context, (stickersAndWallpaper) =>
        buildCSSWithStickers(stickersAndWallpaper)
    );
}

export class NetworkError extends Error { }

function installEditorStyles(styles: string) {
    fs.writeFileSync(editorCss, styles, "utf-8");
}

function cleanPathToUrl(stickerPath: string) {
    const scrubbedUrl = stickerPath.replace(/\\/g, "/");
    const unEncodedUrl = isWSL() ? scrubbedUrl.replace("/mnt/c", "c:") : scrubbedUrl;
    const encodedUrl = encodeURI(unEncodedUrl).replace(/[!'()*]/g, escape);
    return encodedUrl;
}

function stickerPathToUrl(currentSticker: Sticker) {
    const stickerPath = currentSticker.path;
    return cleanPathToUrl(stickerPath);
}

function getWSLStoragePath(): string {
    const appDataDirectory = "AppData";
    const userAppDataIndex = workbenchDirectory.indexOf(appDataDirectory);
    if (userAppDataIndex > -1) {
        const windowsGlobalStorageDirectory = path.resolve(
            workbenchDirectory.substring(
                0,
                userAppDataIndex + appDataDirectory.length
            ),
            "Roaming",
            "Code",
            "User",
            "globalStorage",
            "unthrottled.doki-theme"
        );
        try {
            if (!fs.existsSync(windowsGlobalStorageDirectory)) {
                fs.mkdirSync(windowsGlobalStorageDirectory, { recursive: true });
            }
            return windowsGlobalStorageDirectory;
        } catch (e) {
            console.error("Unable to create roaming directory", e);
        }
    }
    throw Error("Unable to set up WSL asset directory!");
}

function getStoragePath(context: ExtensionContext) {
    return isWSL() ? getWSLStoragePath() : context.globalStoragePath;
}

const resolveLocalStickerPath = (
    currentSticker: Sticker,
    context: ExtensionContext
): string => {
    const safeStickerPath = stickerPathToUrl(currentSticker);
    return path.join(getStoragePath(context), "stickers", safeStickerPath);
};

export const CONFIG_NAME = "doki";
export const CONFIG_STICKER = "sticker.path";
export const CONFIG_BACKGROUND = "background.path";
export const CONFIG_WALLPAPER = "wallpaper.path";
export const CONFIG_WALLPAPER_ENABLED = "wallpaper.enabled";
export const CONFIG_BACKGROUND_ANCHOR = "background.anchor";
export const CONFIG_BACKGROUND_ENABLED = "background.enabled";
export const CONFIG_STATUS_BAR_NAME = "statusbar.name";

export const getConfig = () => workspace.getConfiguration(CONFIG_NAME)

function loadImageBase64FromFileProtocol(url: string): string {
    const fileUrl = new URL(url);
    const imageBuffer = fs.readFileSync(fileUrl);
    const imageExtensionName = path.extname(fileUrl.pathname).substr(1);

    return `data:image/${imageExtensionName};base64,${imageBuffer.toString('base64')}`;
}

const createCssDokiAssetUrl = (localAssetPath: string): string => {
    return loadImageBase64FromFileProtocol(`file://${cleanPathToUrl(localAssetPath)}`);
};

export const forceUpdateSticker = async (
    context: ExtensionContext,
    currentSticker: Sticker
): Promise<Pick<DokiStickers, "stickerDataURL">> => {
    const localStickerPath = resolveLocalStickerPath(currentSticker, context);
    const config = getConfig()
    const customSticker: string = config.get(CONFIG_STICKER) + '';
    return {
        stickerDataURL: createCssDokiAssetUrl(
            fs.existsSync(customSticker) ? customSticker : localStickerPath
        )
    };
}

async function installStyles(
    sticker: Sticker,
    context: ExtensionContext,
    cssDecorator: (assets: Pick<DokiStickers, "stickerDataURL">) => string
): Promise<InstallStatus> {
    if (canWrite()) {
        try {
            const stickersAndWallpaper = await forceUpdateSticker(context, sticker);
            const stickerStyles = cssDecorator(stickersAndWallpaper);
            installEditorStyles(stickerStyles);
            return InstallStatus.INSTALLED;
        } catch (e) {
            console.error("Unable to install sticker!", e);
            if (e instanceof NetworkError) {
                return InstallStatus.NETWORK_FAILURE;
            }
        }
    }

    return InstallStatus.FAILURE;
}