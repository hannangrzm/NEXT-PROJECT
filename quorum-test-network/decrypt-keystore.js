import fs from "fs";
import { ethers } from "ethers";

const keystore = JSON.parse(fs.readFileSync("./keystore-key.json", "utf8"));
const password = ""; // leave blank if passwords.txt was empty

(async () => {
  try {
    const wallet = await ethers.Wallet.fromEncryptedJson(JSON.stringify(keystore), password);
    console.log("Address:", wallet.address);
    console.log("Private Key:", wallet.privateKey);
  } catch (err) {
    console.error("❌ Failed to decrypt keystore:", err.message);
  }
})();
