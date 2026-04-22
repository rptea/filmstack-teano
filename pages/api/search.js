export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { query } = req.query;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Query is required." });
  }

  if (!process.env.TMDB_API_TOKEN) {
    return res.status(500).json({ error: "Missing TMDB_API_TOKEN." });
  }

  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
          accept: "application/json",
        },
      }
    );

    const data = await tmdbRes.json();

    if (!tmdbRes.ok) {
      return res.status(tmdbRes.status).json({
        error: data.status_message || "TMDb request failed.",
      });
    }

    return res.status(200).json({
      results: data.results || [],
    });
  } catch (error) {
    console.error("Search route error:", error);
    return res.status(500).json({ error: "Server error." });
  }
}