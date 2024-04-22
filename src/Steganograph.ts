import sharp from "sharp";
import fs from "fs";

const header = "STEGAN",
	headerBuffer = Buffer.from(header, "ascii"),
	headerBufferLength = headerBuffer.length,
	fullHeaderBufferLength = headerBufferLength + 4,
	fullHeaderBufferBitLength = fullHeaderBufferLength * 8;

export async function encode(inputImageFileBuffer: Buffer, text: string) {
	const { info: imageInfo, data: imageBuffer } = await sharp(inputImageFileBuffer)
		.png()
		.ensureAlpha(1)
		.rotate()
		// .extractChannel(2)
		.toColourspace("srgb")
		.raw()
		.toBuffer({ resolveWithObject: true });

	const textBuffer = Buffer.from(text, "utf8");
	const textBufferLength = textBuffer.length;

	const textBufferLengthBuffer = Buffer.alloc(4, 0);
	textBufferLengthBuffer.writeUInt32BE(textBufferLength);

	const dataBuffer = Buffer.concat([headerBuffer, textBufferLengthBuffer, textBuffer]);
	const dataBufferLength = dataBuffer.length;

	const imageBufferLength = imageBuffer.length;
	const writableBytesLength = (imageBufferLength / 4) * 3;

	if (dataBufferLength * 8 > writableBytesLength) {
		throw "Data length is longer than writable pixels in image.";
	}

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

	const outputImageFileBuffer = await sharp(newImageBuffer, {
		// because the input does not contain its dimensions or how many channels it has
		// we need to specify it in the constructor options
		raw: {
			width: imageInfo.width,
			height: imageInfo.height,
			channels: 4,
		},
	})
		.flatten()
		.removeAlpha()
		.png()
		.toBuffer();

	return outputImageFileBuffer;
}

export async function decode(inputImageFileBuffer: Buffer) {
	const { info: imageInfo, data: imageBuffer } = await sharp(inputImageFileBuffer)
		.ensureAlpha(1)
		.toColourspace("srgb")
		// .raw({ depth: "ushort" })
		.raw()
		.toBuffer({ resolveWithObject: true });

	let dataBuffer: Buffer = Buffer.alloc(fullHeaderBufferLength);

	let textLength: number,
		textLengthBits: number,
		imageBufferIndex = 0,
		dataBufferIndex = 0,
		dataBufferBitLength = -1,
		dataTempBitsLength = 0,
		dataTempBits: (0 | 1)[] = [],
		imageDataLengthBytes = -1;

	while (true) {
		if (imageDataLengthBytes !== -1 && imageBufferIndex > imageDataLengthBytes) {
			break;
		}
		if (imageBufferIndex % 4 === 3) {
			imageBufferIndex++;
		}

		if (dataBufferIndex === fullHeaderBufferLength && dataTempBitsLength === 0) {
			const potentialHeaderBuffer = dataBuffer.subarray(0, header.length);

			if (potentialHeaderBuffer.compare(headerBuffer) !== 0) {
				throw "The image is not steganographed with Steganograph.";
			}

			// const textLengthBuffer = dataBuffer.subarray(headerBufferLength, 4);
			const textLengthBuffer = dataBuffer.subarray(
				headerBufferLength,
				headerBufferLength + 4,
			);

			textLength = textLengthBuffer.readUInt32BE();
			textLengthBits = textLength * 8;
			dataBufferBitLength = fullHeaderBufferBitLength + textLengthBits;
			imageDataLengthBytes = Math.floor((dataBufferBitLength * 4) / 3);

			dataBuffer = Buffer.concat([dataBuffer, Buffer.alloc(textLength)]);
		}

		const imageByte = imageBuffer[imageBufferIndex];
		const dataBit: 0 | 1 = (imageByte % 2) as any;

		dataTempBits.push(dataBit);

		dataTempBitsLength++;

		if (dataTempBitsLength === 8) {
			let dataByteInt = parseInt(dataTempBits.join(""), 2);

			const newDataByte = Buffer.alloc(1);
			newDataByte.writeUInt8(dataByteInt);

			dataBuffer.set(newDataByte, dataBufferIndex);

			dataBufferIndex++;
			dataTempBits = [];
			dataTempBitsLength = 0;
		}
		imageBufferIndex++;
	}

	const textBuffer = dataBuffer.subarray(fullHeaderBufferLength);
	const text = textBuffer.toString("utf8");

	return text;
}
