const express = require("express");

console.log("API KEY:", process.env.SERPAPI_KEY);

function createApp(fetch) {
    const app = express();

    app.use(express.static("public"));

    function mapResults(json) {
        return (json.organic_results || []).map(r => ({
            title: r.title,
            link: r.link,
            snippet: r.snippet
        }));
    }

    app.get("/api/search", async (req, res) => {
        try {
            const q = req.query.q;

            // validace inputu
            if (!q) {
                return res.status(400).json({ error: "Missing query" });
            }
            if (!process.env.SERPAPI_KEY) { return res.status(500).json({ error: "Missing API key" }); }
                
            const url = `https://serpapi.com/search.json?q=${encodeURIComponent(q)}&engine=google&api_key=${process.env.SERPAPI_KEY}`;

            const response = await fetch(url);
            const json = await response.json();

            // validace API odpovědi
            if (json.error) {
                return res.status(500).json({ error: json.error });
            }

            res.json(mapResults(json));

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "API request failed" });
        }
    });

    return app;
}

module.exports = {
    createApp
};
