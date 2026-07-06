const request = require("supertest");
const { createApp } = require("../server");

describe("GET /api/search", () => {

beforeEach(() => {
    process.env.SERPAPI_KEY = "test_key";
});

test("vrátí pole výsledků", async () => {

    const mockFetch = jest.fn().mockResolvedValue({
        json: async () => ({
            organic_results: [
                {
                    title: "Test",
                    link: "https://test.com",
                    snippet: "Hello"
                }
            ]
        })
    });

    const app = createApp(mockFetch);

    const res = await request(app).get("/api/search?q=test");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
        {
            title: "Test",
            link: "https://test.com",
            snippet: "Hello"
        }
    ]);
});

test("vrátí 500 pokud chybí API key", async () => {
    delete process.env.SERPAPI_KEY;

    const app = createApp(() => {});

    const res = await request(app).get("/api/search?q=test");

    expect(res.statusCode).toBe(500);
});

test("vrátí 400 pokud chybí query", async () => {
    const app = createApp(() => {});

    const res = await request(app).get("/api/search");

    expect(res.statusCode).toBe(400);
});

test("vrátí 500 pokud API vrátí chybu", async () => {

    const mockFetch = jest.fn().mockResolvedValue({
        json: async () => ({
            error: "API failed"
        })
    });

    const app = createApp(mockFetch);

    const res = await request(app).get("/api/search?q=test");

    expect(res.statusCode).toBe(500);
});

});
