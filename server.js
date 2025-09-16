const express = require("express");
const path = require("path");
const fetch = require("node-fetch"); // Node.js v18 이상이면 필요 없음

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ React build 정적 파일 서빙
app.use(express.static(path.join(__dirname, "build")));

// ✅ 뉴스 API 프록시 엔드포인트
app.get("/api/news", async (req, res) => {
    const category = req.query.category || "general";
    const fromDate = req.query.fromDate || "2025-09-01";

    try {
        const response = await fetch(
            `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&from=${fromDate}&apiKey=${process.env.NEWS_API_KEY}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

// ✅ React 라우팅 지원 (SPA fallback)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ✅ 헬스 체크
app.get("/healthz", (req, res) => {
    res.status(200).send("OK");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


/* news배포 */
app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});
