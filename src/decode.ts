import sharp from "sharp";
import fs from "fs";

const { info: imageInfo, data: imageBuffer } = await sharp("src/data/new.png")
	.ensureAlpha(1)
	.toColourspace("srgb")
	// .raw({ depth: "ushort" })
	.raw()
	.toBuffer({ resolveWithObject: true });

console.log(imageBuffer);

const header = "STEGAN";
const headerBuffer = Buffer.from(header);

const potentialHeader = imageBuffer.subarray(0, header.length);

if (potentialHeader.compare(headerBuffer) !== 0) {
	console.error("Image is not steganographed with this tool.");
	process.exit(1);
}
