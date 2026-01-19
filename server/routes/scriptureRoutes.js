const express = require("express");
const router =express.Router();

router.get("/", async (req, res) => {
    const { ref } = req.query;

    if (!ref) {
        return res.status(400).json({ message: "ref is required"});
    }

    try {
        const url = `https://bible-api.com/${encodeURIComponent(ref)}`;
        const apiRes = await fetch(url);

        if (!apiRes.ok) {
            return res.status(apiRes.status).json({ message: "Bible API error", status: apiRes.status, });
        }

        const data = await apiRes.json();

        res.json({
            reference: data.reference,
            text: (data.text || "").trim(),
            translation: data.translation_name || data.translation_id || "",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;