import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const editions = sqliteTable("editions", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  status: text("status").notNull().default("draft"),
  coverImage: text("cover_image").notNull().default(""),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const magazinePages = sqliteTable("magazine_pages", {
  id: text("id").primaryKey(),
  editionId: text("edition_id").notNull(),
  position: integer("position").notNull(),
  label: text("label").notNull().default("EDITORIAL"),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  layout: text("layout").notNull().default("editorial"),
});

export const submissions = sqliteTable("submissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  instagram: text("instagram").notNull().default(""),
  category: text("category").notNull(),
  plan: text("plan").notNull(),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("new"),
  createdAt: integer("created_at").notNull(),
});

export const articleViews = sqliteTable("article_views", {
  pageId: text("page_id").primaryKey(),
  views: integer("views").notNull().default(0),
});

export const editorialCategories = sqliteTable("editorial_categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  description: text("description").notNull().default(""),
  href: text("href").notNull(),
  position: integer("position").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
export const photoAlbums=sqliteTable("photo_albums",{id:text("id").primaryKey(),title:text("title").notNull(),description:text("description").notNull().default(""),coverImage:text("cover_image").notNull().default(""),status:text("status").notNull().default("draft"),allowDownload:integer("allow_download",{mode:"boolean"}).notNull().default(true),createdAt:integer("created_at").notNull(),updatedAt:integer("updated_at").notNull()});
export const albumPhotos=sqliteTable("album_photos",{id:text("id").primaryKey(),albumId:text("album_id").notNull(),imageUrl:text("image_url").notNull(),caption:text("caption").notNull().default(""),position:integer("position").notNull().default(0)});
export const events=sqliteTable("events",{id:text("id").primaryKey(),title:text("title").notNull(),type:text("type").notNull().default("EVENTO"),eventDate:text("event_date").notNull(),eventTime:text("event_time").notNull().default(""),place:text("place").notNull().default(""),description:text("description").notNull().default(""),imageUrl:text("image_url").notNull().default(""),ticketUrl:text("ticket_url").notNull().default(""),status:text("status").notNull().default("published"),featured:integer("featured",{mode:"boolean"}).notNull().default(false),createdAt:integer("created_at").notNull()});
export const articles=sqliteTable("articles",{id:text("id").primaryKey(),slug:text("slug").notNull().unique(),title:text("title").notNull(),subtitle:text("subtitle").notNull().default(""),category:text("category").notNull().default("EDITORIAL"),author:text("author").notNull().default("Equipe DEU CAPA."),subject:text("subject").notNull().default(""),body:text("body").notNull().default(""),coverImage:text("cover_image").notNull().default(""),instagram:text("instagram").notNull().default(""),contact:text("contact").notNull().default(""),status:text("status").notNull().default("draft"),featured:integer("featured",{mode:"boolean"}).notNull().default(false),scheduledAt:text("scheduled_at").notNull().default(""),createdAt:integer("created_at").notNull(),updatedAt:integer("updated_at").notNull()});
