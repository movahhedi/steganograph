import sharp from "sharp";

const { info: imageInfo, data: imageBuffer } = await sharp("src/data/new.png")
	.ensureAlpha(1)
	.toColourspace("srgb")
	// .raw({ depth: "ushort" })
	.raw()
	.toBuffer({ resolveWithObject: true });

const header = "STEGAN";
const headerBuffer = Buffer.from(header);
const headerBufferLength = headerBuffer.length;
const fullHeaderBufferLength = headerBufferLength + 4;
const fullHeaderBufferBitLength = fullHeaderBufferLength * 8;

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
			console.error("Image is not steganographed with this tool.");
			process.exit(1);
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

console.log(textBuffer.toString("utf8"));
