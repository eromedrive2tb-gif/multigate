import { hashPassword, verifyPassword } from "./src/utils/crypto";

async function test() {
    const password = "password123";
    console.log("Hashing password...");
    const hash = await hashPassword(password);
    console.log("Hash created:", hash);

    console.log("Verifying correct password...");
    const isValid = await verifyPassword(password, hash);
    console.log("Result (expected true):", isValid);

    console.log("Verifying wrong password...");
    const isInvalid = await verifyPassword("wrongpassword", hash);
    console.log("Result (expected false):", isInvalid);
}

test().catch(console.error);
