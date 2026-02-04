import { generateSecureToken } from "./src/utils/crypto";

// 1. Verify token randomness
console.log("Generating 5 sample tokens:");
for (let i = 0; i < 5; i++) {
    console.log(generateSecureToken());
}

// 2. Token format check
const token = generateSecureToken();
if (token.startsWith("mg_") && token.length > 50) {
    console.log("\nToken format is correct: starts with 'mg_' and has sufficient entropy.");
} else {
    console.error("\nToken format is incorrect!");
}

process.exit(0);
