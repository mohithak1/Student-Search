
const bcrypt = require("bcryptjs");

async function main() {
    const password = "ChangeThisPassword123!";

    const hash = await bcrypt.hash(password, 12);

    console.log("Original password:", password);
    console.log("Hashed password:", hash);

    const isMatch = await bcrypt.compare(password, hash);
    console.log("Password matches:", isMatch);
}

main().catch(console.error);
