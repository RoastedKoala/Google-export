const express = require("express");

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

            const url = `https://serpapi.com/search.json?q=${encodeURIComponent(q)}&engine=google&api_key=TEST`;

            const response = await fetch(url);
            const json = await response.json();

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