export default async function handler(req,res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query } = req.query;

    if (!query || !query.trim()) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
            {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.status_message || 'Failed to fetch movies from TMDB',
            });
        }
        
        return res.status(200).json({
            results: data.results || [],  
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Something went wrong while search for movies',
        });
    }
}