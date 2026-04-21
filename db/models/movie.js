import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema (
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tmdbId: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        posterPath: {
            type: String,
            default: '',
        },
        releaseDate: {
            type: String,
            default: '',
        },
        overview: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['want_to_watch', 'watched', 'owned'],
            default: 'want_to_watch',
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },
        notes: {
            type: String,
            trim: true,
            default: '',
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default (mongoose.models && mongoose.models.Movie) ||
  mongoose.model('Movie', MovieSchema);