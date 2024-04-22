import fs from "fs";
import { decode, encode } from "./Steganograph";

// const inputImage: Buffer = await fs.promises.readFile("src/data/input.png");
// const e = await encode(inputImage, "Hi");
// await fs.promises.writeFile("src/data/new2.png", e);

const inputImage: Buffer = await fs.promises.readFile("src/data/new2.png");
const e = await decode(inputImage);
console.log(e);
