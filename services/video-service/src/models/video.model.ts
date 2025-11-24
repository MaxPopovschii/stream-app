import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  releaseYear: number;
  rating: number;
  genres: string[];
  cast: string[];
  director: string;
  language: string;
  subtitles: string[];
  quality: string[];
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  releaseYear: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  genres: [{ type: String, index: true }],
  cast: [String],
  director: String,
  language: { type: String, default: 'en' },
  subtitles: [String],
  quality: [String],
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

VideoSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IVideo>('Video', VideoSchema);
