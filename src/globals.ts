// globals.ts

interface ExtendedGlobal {
	audioPlayerSongList: string[];
}

declare const global: ExtendedGlobal;

export { global };
