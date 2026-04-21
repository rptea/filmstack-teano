import { withIronSessionApiRoute } from 'iron-session/next';
import sessionOptions from '../../../config/session';
import dbConnect from '../../../db/connection';
import Movie from '../../../db/models/movie';

async function handler(req, res) {
    await dbConnect();

    const sessionUser = req.session.user;

    if (!sessionUser) {
        return res.status(401).json({ error: 'You must be logged in.' });
    }

    const userId = sessionUser._id || sessionUser.id;

    if (!userId) {
        return res.status(400).json({ error: 'User ID not found in session.' });
    }

    if (req.method === 'GET') {
        try {
            const movies = (await Movie.find({ userId })).toSorted({ createdAt: -1 });
            return res.statu(200).json(movies);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch movies.' });
        }
    }

    if (req.method === 'POST') {
        try {
            const {
                tmdbId,
                title,
                posterPath,
                releaseDate,
                overview,
                status,
                rating,
                notes,
                favorite,
            } = req.body;

            if (!tmdbId || !title) {
                return res.status(400).json({
                    error: 'tmdbId, and title are required.',
                });
            }

            const existingMovie = await Movie.findOne({ userId, tmdbId });

            if (existingMovie) {
                return res.status(409).json({
                    error: 'This movie is already saved.',
                });
            }

            const movie = await Movie.create({
                userId,
                tmdbId,
                title,
                posterPath: posterPath || '',
                releaseDate: releaseDate || '',
                overview: overview || '',
                status: status || 'want_to_watch',
                rating: rating || null,
                notes: notes || '',
                favorite: favorite || false,
            });

            return res.status(201).json(movie);
        }   catch (error) {
            return res.status(500).json({ error: 'Failed to save movie.' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed.' });
}

export default withIronSessionApiRoute(handler, sessionOptions);