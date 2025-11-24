import { pgTable, uuid, varchar, text, timestamp, json } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  displayName: varchar('display_name', { length: 100 }),
  avatar: text('avatar'),
  bio: text('bio'),
  preferences: json('preferences').$type<{
    language?: string;
    subtitles?: boolean;
    autoplay?: boolean;
    quality?: string;
  }>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const watchlist = pgTable('watchlist', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  videoId: varchar('video_id', { length: 100 }).notNull(),
  addedAt: timestamp('added_at').defaultNow()
});

export const watchHistory = pgTable('watch_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  videoId: varchar('video_id', { length: 100 }).notNull(),
  watchedAt: timestamp('watched_at').defaultNow(),
  duration: varchar('duration', { length: 50 }),
  progress: varchar('progress', { length: 50 })
});
