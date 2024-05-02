#!/usr/bin/env node

import fs from "fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { decode, encode } from "./Steganograph";

const myYargs = yargs(hideBin(process.argv))
	.version()
	// .showHelpOnFail(true)
	.command(
		"encode",
		"Encode text into an image",
		{
			input: {
				describe: "Input image path",
				demandOption: true,
				alias: "i",
				type: "string",
			},
			text: {
				describe: "Text to encode",
				demandOption: true,
				alias: "t",
				type: "string",
			},
			output: {
				describe: "Output image path",
				demandOption: true,
				alias: "o",
				type: "string",
			},
		},
		async (argv) => {
			console.log("Starting encode process...");
			const inputBuffer = await fs.readFile(argv.input);
			console.log("Read input image");
			const outputBuffer = await encode(inputBuffer, argv.text);
			await fs.writeFile(argv.output, outputBuffer);
			console.log("Wrote output image");
		},
	)
	.command(
		"decode",
		"Decode text from an image",
		{
			input: {
				describe: "Input image path",
				demandOption: true,
				alias: "i",
				type: "string",
			},
			output: {
				describe: "Output text file path",
				alias: "o",
				type: "string",
			},
		},
		async (argv) => {
			console.log("Starting decode process...");

			const inputBuffer = await fs.readFile(argv.input);
			console.log("Read input image");

			const text = await decode(inputBuffer);
			if (argv.output) {
				await fs.writeFile(argv.output, text);
				console.log("Wrote output text file to path " + argv.output);
			} else {
				console.log("Decoded text:", text);
			}
		},
	)
	.demandCommand(1, "You need at least one command before moving on")

	.help()
	.alias("version", "v")
	.alias("help", "h");

	myYargs.parse();

// const inputImage: Buffer = await fs.promises.readFile("src/data/input.png");
// const e = await encode(inputImage, "Hi");
// await fs.promises.writeFile("src/data/new2.png", e);

// const inputImage: Buffer = await fs.promises.readFile("src/data/new2.png");
// const e = await decode(inputImage);
// console.log(e);
