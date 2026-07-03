const request = require("supertest");
const { createApp } = require("../server");

console.log(require("../server"));

describe("GET /api/search", () => {

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
});