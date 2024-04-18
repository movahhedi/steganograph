import sharp from "sharp";
import fs from "fs";

// fs.promises.readFile("src/data/input2.png")

// Extract raw, unsigned 8-bit RGB pixel data from JPEG input
/* const { data, info } = await sharp("input.jpg")
	.raw()
	.toBuffer({ resolveWithObject: true }); */

// Extract alpha channel as raw, unsigned 16-bit pixel data from PNG input
const { info: imageInfo, data: imageBuffer } = await sharp("src/data/input2.png")
	.ensureAlpha(1)
	// .extractChannel(2)
	.toColourspace("srgb")
	// .raw({ depth: "ushort" })
	.raw()
	.toBuffer({ resolveWithObject: true });

console.log(imageBuffer);

const text = "Hello";
const textBuffer = Buffer.from(text, "utf8");
const textBufferLength = textBuffer.length;

const textBufferLengthBuffer = Buffer.alloc(4, 0);
textBufferLengthBuffer.writeUInt32BE(textBufferLength);

const header = "STEGAN";
const headerBuffer = Buffer.from(header, "ascii");

const dataBuffer = Buffer.concat([headerBuffer, textBufferLengthBuffer, textBuffer]);
const dataBufferLength = dataBuffer.length;

const imageBufferLength = imageBuffer.length;
const writableBytesLength = (imageBufferLength / 4) * 3;

if (dataBufferLength * 8 > writableBytesLength) {
	console.error("Data length is longer than writable pixels in image.");
	process.exit(1);
}

/* for (let imageBufferIndex = 0; imageBufferIndex < imageBufferLength; imageBufferIndex++) {
	if (imageBufferIndex % 4 === 0) continue;
} */

console.log(dataBuffer);

const newImageBuffer = imageBuffer;

let imageBufferByteIndex = 0,
	dataBufferByteIndex = 0,
	dataBufferByteBitIndex = 0,
	dataBufferByteBits: string[] = dataBuffer[dataBufferByteIndex]
		.toString(2)
		.padStart(8, "0")
		.split("");

while (dataBufferByteIndex < dataBufferLength) {
	if (imageBufferByteIndex % 4 === 3) {
		imageBufferByteIndex++;
	}

	const imageByte = newImageBuffer[imageBufferByteIndex];
	const bitToWrite = dataBufferByteBits[dataBufferByteBitIndex];
	let newByte: Buffer;

	let newByteInt = (imageByte >> 1) << 1;
	if (bitToWrite === "1") {
		newByteInt++;
	}

	newByte = Buffer.alloc(1);
	newByte.writeUInt8(newByteInt);

	// console.log(dataBufferByteBits, dataBufferByteBitIndex, bitToWrite);

	// newImageBuffer.write(newByte, imageBufferByteIndex, 1, "binary");
	newImageBuffer.set(newByte, imageBufferByteIndex);

	imageBufferByteIndex++;
	dataBufferByteBitIndex++;

	if (dataBufferByteBitIndex === 8) {
		dataBufferByteBitIndex = 0;
		dataBufferByteIndex++;

		const dataBufferByte = dataBuffer[dataBufferByteIndex];

		if (dataBufferByteIndex >= dataBufferLength) {
			break;
		}

		dataBufferByteBits = dataBufferByte.toString(2).padStart(8, "0").split("");
		// .map((i) => +i);
	}
}

console.log(newImageBuffer);

await sharp(newImageBuffer, {
	// because the input does not contain its dimensions or how many channels it has
	// we need to specify it in the constructor options
	raw: {
		width: imageInfo.width,
		height: imageInfo.height,
		channels: 4,
	},
})
	// .flatten()
	.png()
	.toFile("src/data/new.png");
