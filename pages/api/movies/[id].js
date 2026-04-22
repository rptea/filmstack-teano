import { withIronSessionApiRoute } from 'iron-session/next';
import sessionOptions from '../../../config/session';
import dbConnect from '../../../db/connection';
import Movie from '../../../db/models/movie';

async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  const sessionUser = req.session.user;

  if (!sessionUser) {
    return res.status(401).json({ error: 'You must be logged in.' });
  }

  const userId = sessionUser._id || sessionUser.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID not found in session.' });
  }

  if (method === 'PATCH') {
    try {
      const { status, favorite, rating } = req.body;

      const update = {};

      if (typeof status !== 'undefined') {
        const allowedStatuses = ['want_to_watch', 'watched', 'owned'];

        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({ error: 'Invalid status value.' });
        }

        update.status = status;
      }

      if (typeof favorite !== 'undefined') {
        update.favorite = Boolean(favorite);
      }

      if (typeof rating !== 'undefined') {
        const numericRating = Number(rating);

        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ error: 'Rating must be a number from 1 to 5.'
            });
        }

        update.rating = numericRating;
      }

      if (Object.keys(update).length === 0) {
        return res
          .status(400)
          .json({ error: 'No valid fields provided to update.' });
      }

      const updated = await Movie.findOneAndUpdate(
        { _id: id, userId },
        update,
        { new: true }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ error: 'Movie not found for this user.' });
      }

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update movie.' });
    }
  }

  if (method === 'DELETE') {
    try {
        const deletedMovie = await Movie.findOneAndDelete({
            _id: id,
            userId, 
        });

        if (!deletedMovie) {
            return res
                .status (404)
                .json({ error: 'Movie not found for this user.'});
        }

        return res.status(200).json({
            message: 'Movie deleted successfully.',
            deletedMovie,
        });
    }   catch (error) {
        return res.status(500).json({ error: 'Failed to delete movie.' });
    }   
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}

export default withIronSessionApiRoute(handler, sessionOptions);