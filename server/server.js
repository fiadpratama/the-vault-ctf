const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

const FLAG = "FLAG{N3w_V4ult_N3w_M3ch4n1cs}";
const E2EE_KEY = Buffer.from("99887766554433221100aabbccddeeff");

function decryptPayload(encryptedBase64, ivBase64, authTagBase64) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-gcm', E2EE_KEY, Buffer.from(ivBase64, 'base64'));
        decipher.setAuthTag(Buffer.from(authTagBase64, 'base64'));
        let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    } catch (e) {
        return null;
    }
}

// ==========================================
// API ENDPOINT: /api/vault/stage1
// ==========================================
app.post('/api/vault/stage1', (req, res) => {
    const { payload, iv, tag } = req.body;
    
    if (!payload || !iv || !tag) {
        return res.status(400).json({ error: "E2EE Required" });
    }

    const decryptedData = decryptPayload(payload, iv, tag);
    if (!decryptedData) {
        return res.status(401).json({ error: "Decryption failed." });
    }

    if (decryptedData.backdoor_code === "0M3G4_PR0T0C0L_99") {
        const challengeNum = Math.floor(Math.random() * 10000) + 1000;
        res.setHeader('X-Secret-Multiplier', Buffer.from('109').toString('base64'));
        
        return res.status(200).json({
            message: "Stage 1 Cleared.",
            instruction: "Find the multiplier, multiply it with the challenge number, and send it to /api/vault/stage2 encrypted.",
            challenge: challengeNum
        });
    }

    return res.status(401).json({ error: "Invalid Backdoor Code" });
});

// ==========================================
// API ENDPOINT: /api/vault/stage2
// ==========================================
app.post('/api/vault/stage2', (req, res) => {
    const { payload, iv, tag } = req.body;
    
    if (!payload || !iv || !tag) {
        return res.status(400).json({ error: "E2EE Required" });
    }

    const decryptedData = decryptPayload(payload, iv, tag);
    if (!decryptedData) {
        return res.status(401).json({ error: "Decryption failed." });
    }

    const { challenge, answer } = decryptedData;

    if (!challenge || !answer) {
        return res.status(400).json({ error: "Invalid payload format." });
    }

    const expectedAnswer = parseInt(challenge) * 109;

    if (parseInt(answer) === expectedAnswer) {
        return res.status(200).json({
            message: "ACCESS GRANTED.",
            flag: FLAG
        });
    }

    return res.status(401).json({ error: "Invalid calculation." });
});

// ==========================================
// API ENDPOINT: /api/vault/verify-flag
// ==========================================
app.post('/api/vault/verify-flag', (req, res) => {
    const { flag } = req.body;
    
    if (flag === FLAG) {
        return res.status(200).json({
            success: true,
            title: "HALL OF FAME",
            message: "SYSTEM OVERRIDE SUCCESSFUL\n\n" +
                     "> ACCESS GRANTED\n" +
                     "> CLEARANCE LEVEL: OMNI\n\n" +
                     "To the unknown entity:\n\n" +
                     "The parameters of this simulation were designed to be unbreakable. The cryptographic handshake, the native memory obfuscation, the network payload encryption—all intended to filter out the unworthy.\n\n" +
                     "You have systematically dismantled every security protocol. The C++ JNI bridge was bypassed. The AES-256-GCM cipher was compromised. The hidden X-Secret-Multiplier header was intercepted.\n\n" +
                     "This is no longer a test. You have proven mastery over both dynamic analysis and network penetration.\n\n" +
                     "The Vault is now fully under your control. The data is yours.\n\n" +
                     "End of transmission.\n\n\n\n\n" +
                     "PROJECT DIRECTOR\n" +
                     "The Architect\n\n\n" +
                     "TARGET OPERATIVE\n" +
                     "Classified / Unknown\n\n\n" +
                     "AUDIO FRAMEWORK\n" +
                     "W.A. Mozart - Dies Irae (Requiem in D minor)\n\n\n" +
                     "INFRASTRUCTURE\n" +
                     "Android Native C++ / Vercel Edge Network\n\n\n\n\n\n\n\n" +
                     "> CONNECTION TERMINATED.\n\n\n" +
                     "FLAG ACQUIRED:\n" + FLAG
        });
    }

    return res.status(401).json({ error: "INVALID FLAG" });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[VAULT API] Multi-Layer Server running on port ${PORT}`);
    });
}

module.exports = app;
