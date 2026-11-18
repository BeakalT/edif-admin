import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_home_hero_buttons_style" AS ENUM('gold', 'navy', 'outline-light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_home_hero_ledger_mode" AS ENUM('number', 'members');
  CREATE TYPE "public"."enum_pages_blocks_home_hero_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_home_hero_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_subnav" AS ENUM('none', 'about', 'protection');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_page_hero_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_band_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_band_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_split_text_buttons_style" AS ENUM('gold', 'navy', 'outline-light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_i_cards_buttons_style" AS ENUM('gold', 'navy', 'outline-light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_numbered_list_variant" AS ENUM('fns', 'chain', 'grid', 'uses');
  CREATE TYPE "public"."enum_pages_blocks_stat_grid_buttons_style" AS ENUM('gold', 'navy', 'outline-light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_stat_grid_columns" AS ENUM('6', '4');
  CREATE TYPE "public"."enum_pages_blocks_board_group" AS ENUM('board', 'management');
  CREATE TYPE "public"."enum_pages_blocks_profiles_group" AS ENUM('board', 'management', 'staff');
  CREATE TYPE "public"."enum_pages_blocks_link_cards_items_icon" AS ENUM('none', 'check', 'calc', 'clock', 'bank', 'shield');
  CREATE TYPE "public"."enum_pages_blocks_faq_part_category" AS ENUM('Protection', 'Payout', 'The Fund');
  CREATE TYPE "public"."enum_pages_blocks_lede_split_buttons_style" AS ENUM('gold', 'navy', 'outline-light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_lede_split_callout_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_lede_split_callout_icon" AS ENUM('shield', 'bank', 'check', 'calc', 'clock');
  CREATE TYPE "public"."enum_pages_blocks_lede_split_right" AS ENUM('rules', 'miniStats', 'timeline', 'memberCounts', 'memberDocs', 'none');
  CREATE TYPE "public"."enum_pages_blocks_section_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_section_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_next_links_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_next_links_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_hero_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_hero_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_cards_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_cards_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_cards_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_figures_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_figures_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_faqs_category" AS ENUM('Protection', 'Payout', 'The Fund');
  CREATE TYPE "public"."enum_pages_blocks_faqs_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_faqs_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_news_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_news_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_publications_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_publications_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_people_group" AS ENUM('board', 'management', 'staff');
  CREATE TYPE "public"."enum_pages_blocks_people_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_people_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_gallery_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_gallery_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_video_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_video_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_downloads_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_downloads_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_callout_tone" AS ENUM('info', 'important');
  CREATE TYPE "public"."enum_pages_blocks_callout_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_callout_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_cta_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_cta_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_table_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_table_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_blocks_custom_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum_pages_blocks_custom_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum_pages_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_home_hero_buttons_style" AS ENUM('gold', 'navy', 'outline-light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_home_hero_ledger_mode" AS ENUM('number', 'members');
  CREATE TYPE "public"."enum__pages_v_blocks_home_hero_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_home_hero_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_subnav" AS ENUM('none', 'about', 'protection');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_page_hero_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_band_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_band_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_split_text_buttons_style" AS ENUM('gold', 'navy', 'outline-light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_i_cards_buttons_style" AS ENUM('gold', 'navy', 'outline-light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_numbered_list_variant" AS ENUM('fns', 'chain', 'grid', 'uses');
  CREATE TYPE "public"."enum__pages_v_blocks_stat_grid_buttons_style" AS ENUM('gold', 'navy', 'outline-light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_stat_grid_columns" AS ENUM('6', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_board_group" AS ENUM('board', 'management');
  CREATE TYPE "public"."enum__pages_v_blocks_profiles_group" AS ENUM('board', 'management', 'staff');
  CREATE TYPE "public"."enum__pages_v_blocks_link_cards_items_icon" AS ENUM('none', 'check', 'calc', 'clock', 'bank', 'shield');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_part_category" AS ENUM('Protection', 'Payout', 'The Fund');
  CREATE TYPE "public"."enum__pages_v_blocks_lede_split_buttons_style" AS ENUM('gold', 'navy', 'outline-light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_lede_split_callout_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_lede_split_callout_icon" AS ENUM('shield', 'bank', 'check', 'calc', 'clock');
  CREATE TYPE "public"."enum__pages_v_blocks_lede_split_right" AS ENUM('rules', 'miniStats', 'timeline', 'memberCounts', 'memberDocs', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_section_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_section_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_next_links_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_next_links_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_figures_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_figures_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_faqs_category" AS ENUM('Protection', 'Payout', 'The Fund');
  CREATE TYPE "public"."enum__pages_v_blocks_faqs_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_faqs_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_news_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_news_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_publications_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_publications_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_people_group" AS ENUM('board', 'management', 'staff');
  CREATE TYPE "public"."enum__pages_v_blocks_people_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_people_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_video_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_video_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_downloads_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_downloads_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_callout_tone" AS ENUM('info', 'important');
  CREATE TYPE "public"."enum__pages_v_blocks_callout_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_callout_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_table_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_table_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_custom_section_background" AS ENUM('default', 'white', 'ice', 'cream', 'navy');
  CREATE TYPE "public"."enum__pages_v_blocks_custom_section_spacing" AS ENUM('compact', 'normal', 'roomy');
  CREATE TYPE "public"."enum__pages_v_version_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_kind" AS ENUM('Report', 'Event', 'Results', 'Media', 'Announcement');
  CREATE TYPE "public"."enum_news_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_kind" AS ENUM('Report', 'Event', 'Results', 'Media', 'Announcement');
  CREATE TYPE "public"."enum__news_v_version_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_publications_kind" AS ENUM('Report', 'Law', 'Regulation', 'Directive', 'Reporting');
  CREATE TYPE "public"."enum_publications_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum_publications_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__publications_v_version_kind" AS ENUM('Report', 'Law', 'Regulation', 'Directive', 'Reporting');
  CREATE TYPE "public"."enum__publications_v_version_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum__publications_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('Protection', 'Payout', 'The Fund');
  CREATE TYPE "public"."enum_faqs_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_category" AS ENUM('Protection', 'Payout', 'The Fund');
  CREATE TYPE "public"."enum__faqs_v_version_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum__faqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_members_type" AS ENUM('bank', 'microfinance');
  CREATE TYPE "public"."enum_members_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum_members_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__members_v_version_type" AS ENUM('bank', 'microfinance');
  CREATE TYPE "public"."enum__members_v_version_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum__members_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_key_figures_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum_key_figures_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__key_figures_v_version_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum__key_figures_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_people_group" AS ENUM('board', 'management', 'staff');
  CREATE TYPE "public"."enum_people_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum_people_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__people_v_version_group" AS ENUM('board', 'management', 'staff');
  CREATE TYPE "public"."enum__people_v_version_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum__people_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_tenders_category" AS ENUM('goods', 'services', 'works', 'consultancy');
  CREATE TYPE "public"."enum_tenders_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum_tenders_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tenders_v_version_category" AS ENUM('goods', 'services', 'works', 'consultancy');
  CREATE TYPE "public"."enum__tenders_v_version_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum__tenders_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_vacancies_employment_type" AS ENUM('full', 'contract', 'intern');
  CREATE TYPE "public"."enum_vacancies_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum_vacancies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__vacancies_v_version_employment_type" AS ENUM('full', 'contract', 'intern');
  CREATE TYPE "public"."enum__vacancies_v_version_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum__vacancies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_notices_severity" AS ENUM('info', 'warning', 'urgent');
  CREATE TYPE "public"."enum_notices_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum_notices_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__notices_v_version_severity" AS ENUM('info', 'warning', 'urgent');
  CREATE TYPE "public"."enum__notices_v_version_review_status" AS ENUM('none', 'in_review', 'changes_requested');
  CREATE TYPE "public"."enum__notices_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_messages_status" AS ENUM('new', 'progress', 'answered', 'spam');
  CREATE TYPE "public"."enum_subscribers_status" AS ENUM('pending', 'confirmed', 'unsubscribed');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'publisher', 'editor', 'seo', 'auditor');
  CREATE TYPE "public"."enum_audit_log_action" AS ENUM('create', 'update', 'publish', 'unpublish', 'submit', 'delete', 'login', 'logout', 'security');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_brand_theme_heading_font" AS ENUM('Raleway', 'Nunito Sans');
  CREATE TYPE "public"."enum_brand_theme_body_font" AS ENUM('Nunito Sans', 'Raleway');
  CREATE TABLE "pages_blocks_home_hero_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_home_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum_pages_blocks_home_hero_buttons_style" DEFAULT 'navy'
  );
  
  CREATE TABLE "pages_blocks_home_hero_ledger" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mode" "enum_pages_blocks_home_hero_ledger_mode" DEFAULT 'number',
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"tag" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tagline" varchar,
  	"intro" varchar,
  	"image_id" integer,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_home_hero_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_home_hero_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"tagline" varchar,
  	"lead" varchar,
  	"image_id" integer,
  	"pos" varchar,
  	"crumb_label" varchar,
  	"crumb_url" varchar,
  	"member_counts" boolean DEFAULT false,
  	"subnav" "enum_pages_blocks_page_hero_subnav" DEFAULT 'none',
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_page_hero_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_page_hero_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_band_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"show_contact" boolean DEFAULT false,
  	"button_label" varchar,
  	"button_url" varchar,
  	"curves" boolean DEFAULT true,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_band_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_band_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_split_text_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_split_text_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_split_text_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum_pages_blocks_split_text_buttons_style" DEFAULT 'navy'
  );
  
  CREATE TABLE "pages_blocks_split_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"title" varchar,
  	"em" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_vision_mission_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_vision_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"big" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_vision_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pcards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_pcards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numbered" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_i_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_i_cards_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum_pages_blocks_i_cards_buttons_style" DEFAULT 'navy'
  );
  
  CREATE TABLE "pages_blocks_i_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numbered" boolean DEFAULT false,
  	"dark_middle" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_numbered_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_numbered_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_numbered_list_variant" DEFAULT 'fns',
  	"eyebrow" varchar,
  	"title" varchar,
  	"em" varchar,
  	"lead" varchar,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stat_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"prefix" varchar,
  	"value" varchar,
  	"label" varchar,
  	"text" varchar,
  	"figure" varchar
  );
  
  CREATE TABLE "pages_blocks_stat_grid_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum_pages_blocks_stat_grid_buttons_style" DEFAULT 'navy'
  );
  
  CREATE TABLE "pages_blocks_stat_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_stat_grid_columns" DEFAULT '6',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_org_chart_chain" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_org_chart_branches_teams" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_org_chart_branches" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"directorate" varchar
  );
  
  CREATE TABLE "pages_blocks_org_chart" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"board" varchar,
  	"side" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_board_seats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_board" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group" "enum_pages_blocks_board_group" DEFAULT 'board',
  	"seats_title" varchar,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_profiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group" "enum_pages_blocks_profiles_group" DEFAULT 'management',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_crowd" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"number" numeric,
  	"suffix" varchar,
  	"kicker" varchar,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rules_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric,
  	"currency" varchar DEFAULT 'Birr',
  	"label" varchar,
  	"desc" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_compare_covered" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_compare_main" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_compare_all" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_compare" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"full" boolean DEFAULT false,
  	"covered_title" varchar,
  	"covered_sub" varchar,
  	"interest_title" varchar,
  	"interest_text" varchar,
  	"interest_label" varchar,
  	"interest_url" varchar,
  	"not_title" varchar,
  	"not_sub" varchar,
  	"see_all" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_ticker" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"late_strong" varchar,
  	"late_text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_calc_section_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_calc_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"em" varchar,
  	"lead" varchar,
  	"auto_strong" varchar,
  	"auto_text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"source" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_link_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_link_cards_items_icon" DEFAULT 'none',
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"url" varchar,
  	"dark" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_link_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_type_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_type_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_excl_panel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_excl_panel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_worked_items_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"amount" numeric
  );
  
  CREATE TABLE "pages_blocks_worked_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"protected_amount" numeric,
  	"not_protected" numeric,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_worked" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_part_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_part" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" "enum_pages_blocks_faq_part_category",
  	"count" numeric DEFAULT 4,
  	"more_label" varchar,
  	"more_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_premium_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"big" varchar,
  	"text" varchar,
  	"separate" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_premium_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_member_directory" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lede_split_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum_pages_blocks_lede_split_buttons_style" DEFAULT 'navy'
  );
  
  CREATE TABLE "pages_blocks_lede_split_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_lede_split_mini_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"prefix" varchar,
  	"value" varchar,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_lede_split_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_lede_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"em" varchar,
  	"lead" varchar,
  	"text" varchar,
  	"sticky" boolean DEFAULT false,
  	"callout_side" "enum_pages_blocks_lede_split_callout_side" DEFAULT 'right',
  	"callout_icon" "enum_pages_blocks_lede_split_callout_icon" DEFAULT 'shield',
  	"callout_strong" varchar,
  	"callout_text" varchar,
  	"right" "enum_pages_blocks_lede_split_right" DEFAULT 'rules',
  	"rules_limit" numeric,
  	"rules_currency" varchar DEFAULT 'Birr',
  	"rules_label" varchar,
  	"rules_desc" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"em" varchar,
  	"lead" varchar,
  	"help_kicker" varchar,
  	"help_title" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"more_label" varchar,
  	"more_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"head_eyebrow" varchar,
  	"head_title" varchar,
  	"head_em" varchar,
  	"head_lead" varchar,
  	"head_center" boolean DEFAULT true,
  	"flush" boolean DEFAULT false,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_section_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_section_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_next_links_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"kicker" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_next_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_next_links_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_next_links_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_hero_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_hero_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" jsonb,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_rich_text_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_rich_text_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_pages_blocks_cards_columns" DEFAULT '3',
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_cards_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_cards_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_figures_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_figures_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"category" "enum_pages_blocks_faqs_category",
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_faqs_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_faqs_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_news" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Latest news',
  	"count" numeric DEFAULT 3,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_news_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_news_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kind" varchar,
  	"count" numeric DEFAULT 6,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_publications_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_publications_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"group" "enum_pages_blocks_people_group",
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_people_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_people_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_gallery_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_gallery_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"url" varchar,
  	"caption" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_video_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_video_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_downloads_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "pages_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_downloads_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_downloads_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tone" "enum_pages_blocks_callout_tone" DEFAULT 'info',
  	"title" varchar,
  	"text" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_callout_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_callout_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"label" varchar,
  	"url" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_cta_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_cta_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_table_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_table_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_table_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_custom" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"css" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum_pages_blocks_custom_section_background" DEFAULT 'default',
  	"section_spacing" "enum_pages_blocks_custom_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"path" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"review_status" "enum_pages_review_status" DEFAULT 'none',
  	"review_note" varchar,
  	"last_editor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"key_figures_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum__pages_v_blocks_home_hero_buttons_style" DEFAULT 'navy',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero_ledger" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mode" "enum__pages_v_blocks_home_hero_ledger_mode" DEFAULT 'number',
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"tag" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tagline" varchar,
  	"intro" varchar,
  	"image_id" integer,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_home_hero_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_home_hero_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"tagline" varchar,
  	"lead" varchar,
  	"image_id" integer,
  	"pos" varchar,
  	"crumb_label" varchar,
  	"crumb_url" varchar,
  	"member_counts" boolean DEFAULT false,
  	"subnav" "enum__pages_v_blocks_page_hero_subnav" DEFAULT 'none',
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_page_hero_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_page_hero_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_band_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"show_contact" boolean DEFAULT false,
  	"button_label" varchar,
  	"button_url" varchar,
  	"curves" boolean DEFAULT true,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_band_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_band_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_text_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_text_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_text_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum__pages_v_blocks_split_text_buttons_style" DEFAULT 'navy',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"title" varchar,
  	"em" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_vision_mission_items_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_vision_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"big" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_vision_mission" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pcards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pcards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"numbered" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_i_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_i_cards_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum__pages_v_blocks_i_cards_buttons_style" DEFAULT 'navy',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_i_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"numbered" boolean DEFAULT false,
  	"dark_middle" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_numbered_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_numbered_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_numbered_list_variant" DEFAULT 'fns',
  	"eyebrow" varchar,
  	"title" varchar,
  	"em" varchar,
  	"lead" varchar,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stat_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar,
  	"value" varchar,
  	"label" varchar,
  	"text" varchar,
  	"figure" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stat_grid_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum__pages_v_blocks_stat_grid_buttons_style" DEFAULT 'navy',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stat_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__pages_v_blocks_stat_grid_columns" DEFAULT '6',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_org_chart_chain" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_org_chart_branches_teams" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_org_chart_branches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"directorate" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_org_chart" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"board" varchar,
  	"side" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_board_seats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_board" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"group" "enum__pages_v_blocks_board_group" DEFAULT 'board',
  	"seats_title" varchar,
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_profiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"group" "enum__pages_v_blocks_profiles_group" DEFAULT 'management',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_crowd" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"number" numeric,
  	"suffix" varchar,
  	"kicker" varchar,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rules_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"limit" numeric,
  	"currency" varchar DEFAULT 'Birr',
  	"label" varchar,
  	"desc" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare_covered" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare_main" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare_all" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_compare" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"full" boolean DEFAULT false,
  	"covered_title" varchar,
  	"covered_sub" varchar,
  	"interest_title" varchar,
  	"interest_text" varchar,
  	"interest_label" varchar,
  	"interest_url" varchar,
  	"not_title" varchar,
  	"not_sub" varchar,
  	"see_all" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_ticker" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"late_strong" varchar,
  	"late_text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_calc_section_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_calc_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"em" varchar,
  	"lead" varchar,
  	"auto_strong" varchar,
  	"auto_text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"source" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_link_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_link_cards_items_icon" DEFAULT 'none',
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"url" varchar,
  	"dark" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_link_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_type_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_type_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_excl_panel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_excl_panel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_worked_items_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"amount" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_worked_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"protected_amount" numeric,
  	"not_protected" numeric,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_worked" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_part_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_part" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum__pages_v_blocks_faq_part_category",
  	"count" numeric DEFAULT 4,
  	"more_label" varchar,
  	"more_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_premium_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"big" varchar,
  	"text" varchar,
  	"separate" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_premium_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_member_directory" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lede_split_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum__pages_v_blocks_lede_split_buttons_style" DEFAULT 'navy',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lede_split_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lede_split_mini_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar,
  	"value" varchar,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lede_split_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lede_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"em" varchar,
  	"lead" varchar,
  	"text" varchar,
  	"sticky" boolean DEFAULT false,
  	"callout_side" "enum__pages_v_blocks_lede_split_callout_side" DEFAULT 'right',
  	"callout_icon" "enum__pages_v_blocks_lede_split_callout_icon" DEFAULT 'shield',
  	"callout_strong" varchar,
  	"callout_text" varchar,
  	"right" "enum__pages_v_blocks_lede_split_right" DEFAULT 'rules',
  	"rules_limit" numeric,
  	"rules_currency" varchar DEFAULT 'Birr',
  	"rules_label" varchar,
  	"rules_desc" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"em" varchar,
  	"lead" varchar,
  	"help_kicker" varchar,
  	"help_title" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"more_label" varchar,
  	"more_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"head_eyebrow" varchar,
  	"head_title" varchar,
  	"head_em" varchar,
  	"head_lead" varchar,
  	"head_center" boolean DEFAULT true,
  	"flush" boolean DEFAULT false,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_section_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_section_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_next_links_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"kicker" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_next_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_next_links_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_next_links_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_hero_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_hero_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" jsonb,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_rich_text_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_rich_text_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum__pages_v_blocks_cards_columns" DEFAULT '3',
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_cards_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_cards_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_figures_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_figures_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"category" "enum__pages_v_blocks_faqs_category",
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_faqs_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_faqs_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_news" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Latest news',
  	"count" numeric DEFAULT 3,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_news_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_news_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"kind" varchar,
  	"count" numeric DEFAULT 6,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_publications_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_publications_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_people" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"group" "enum__pages_v_blocks_people_group",
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_people_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_people_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_gallery_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_gallery_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"url" varchar,
  	"caption" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_video_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_video_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_downloads_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_downloads_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_downloads_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tone" "enum__pages_v_blocks_callout_tone" DEFAULT 'info',
  	"title" varchar,
  	"text" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_callout_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_callout_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"label" varchar,
  	"url" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_cta_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_cta_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_table_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_table_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_custom" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"html" varchar,
  	"css" varchar,
  	"section_anchor" varchar,
  	"section_background" "enum__pages_v_blocks_custom_section_background" DEFAULT 'default',
  	"section_spacing" "enum__pages_v_blocks_custom_section_spacing" DEFAULT 'normal',
  	"section_hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_path" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_review_status" "enum__pages_v_version_review_status" DEFAULT 'none',
  	"version_review_note" varchar,
  	"version_last_editor" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"key_figures_id" integer
  );
  
  CREATE TABLE "news_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"kind" "enum_news_kind" DEFAULT 'Announcement',
  	"date" timestamp(3) with time zone,
  	"short" varchar,
  	"summary" varchar,
  	"image_id" integer,
  	"body" jsonb,
  	"pdf_id" integer,
  	"external_pdf" varchar,
  	"source_url" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"review_status" "enum_news_review_status" DEFAULT 'none',
  	"review_note" varchar,
  	"last_editor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_news_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_kind" "enum__news_v_version_kind" DEFAULT 'Announcement',
  	"version_date" timestamp(3) with time zone,
  	"version_short" varchar,
  	"version_summary" varchar,
  	"version_image_id" integer,
  	"version_body" jsonb,
  	"version_pdf_id" integer,
  	"version_external_pdf" varchar,
  	"version_source_url" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_review_status" "enum__news_v_version_review_status" DEFAULT 'none',
  	"version_review_note" varchar,
  	"version_last_editor" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "publications_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "publications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"kind" "enum_publications_kind",
  	"date" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"description" varchar,
  	"file_id" integer,
  	"external_url" varchar,
  	"review_status" "enum_publications_review_status" DEFAULT 'none',
  	"review_note" varchar,
  	"last_editor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_publications_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_publications_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_publications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_kind" "enum__publications_v_version_kind",
  	"version_date" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_description" varchar,
  	"version_file_id" integer,
  	"version_external_url" varchar,
  	"version_review_status" "enum__publications_v_version_review_status" DEFAULT 'none',
  	"version_review_note" varchar,
  	"version_last_editor" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__publications_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"category" "enum_faqs_category",
  	"show_on_home" boolean DEFAULT false,
  	"sort" numeric DEFAULT 100,
  	"review_status" "enum_faqs_review_status" DEFAULT 'none',
  	"review_note" varchar,
  	"last_editor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_faqs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_faqs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_question" varchar,
  	"version_answer" varchar,
  	"version_category" "enum__faqs_v_version_category",
  	"version_show_on_home" boolean DEFAULT false,
  	"version_sort" numeric DEFAULT 100,
  	"version_review_status" "enum__faqs_v_version_review_status" DEFAULT 'none',
  	"version_review_note" varchar,
  	"version_last_editor" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__faqs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"type" "enum_members_type",
  	"phone" varchar,
  	"email" varchar,
  	"website" varchar,
  	"location" varchar,
  	"review_status" "enum_members_review_status" DEFAULT 'none',
  	"review_note" varchar,
  	"last_editor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_members_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_members_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_type" "enum__members_v_version_type",
  	"version_phone" varchar,
  	"version_email" varchar,
  	"version_website" varchar,
  	"version_location" varchar,
  	"version_review_status" "enum__members_v_version_review_status" DEFAULT 'none',
  	"version_review_note" varchar,
  	"version_last_editor" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__members_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "key_figures" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"key" varchar,
  	"value" varchar,
  	"numeric" numeric,
  	"note" varchar,
  	"source" varchar,
  	"as_of" timestamp(3) with time zone,
  	"review_status" "enum_key_figures_review_status" DEFAULT 'none',
  	"review_note" varchar,
  	"last_editor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_key_figures_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_key_figures_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_label" varchar,
  	"version_key" varchar,
  	"version_value" varchar,
  	"version_numeric" numeric,
  	"version_note" varchar,
  	"version_source" varchar,
  	"version_as_of" timestamp(3) with time zone,
  	"version_review_status" "enum__key_figures_v_version_review_status" DEFAULT 'none',
  	"version_review_note" varchar,
  	"version_last_editor" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__key_figures_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"job_title" varchar,
  	"group" "enum_people_group" DEFAULT 'management',
  	"sort" numeric DEFAULT 100,
  	"photo_id" integer,
  	"bio" jsonb,
  	"review_status" "enum_people_review_status" DEFAULT 'none',
  	"review_note" varchar,
  	"last_editor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_people_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_people_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_job_title" varchar,
  	"version_group" "enum__people_v_version_group" DEFAULT 'management',
  	"version_sort" numeric DEFAULT 100,
  	"version_photo_id" integer,
  	"version_bio" jsonb,
  	"version_review_status" "enum__people_v_version_review_status" DEFAULT 'none',
  	"version_review_note" varchar,
  	"version_last_editor" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__people_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "tenders_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "tenders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"reference" varchar,
  	"category" "enum_tenders_category" DEFAULT 'goods',
  	"published_on" timestamp(3) with time zone,
  	"closing_date" timestamp(3) with time zone,
  	"summary" varchar,
  	"details" jsonb,
  	"contact_email" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"review_status" "enum_tenders_review_status" DEFAULT 'none',
  	"review_note" varchar,
  	"last_editor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_tenders_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_tenders_v_version_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tenders_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_reference" varchar,
  	"version_category" "enum__tenders_v_version_category" DEFAULT 'goods',
  	"version_published_on" timestamp(3) with time zone,
  	"version_closing_date" timestamp(3) with time zone,
  	"version_summary" varchar,
  	"version_details" jsonb,
  	"version_contact_email" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_review_status" "enum__tenders_v_version_review_status" DEFAULT 'none',
  	"version_review_note" varchar,
  	"version_last_editor" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__tenders_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "vacancies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"department" varchar,
  	"location" varchar DEFAULT 'Addis Ababa',
  	"employment_type" "enum_vacancies_employment_type" DEFAULT 'full',
  	"closing_date" timestamp(3) with time zone,
  	"summary" varchar,
  	"details" jsonb,
  	"document_id" integer,
  	"apply_email" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"review_status" "enum_vacancies_review_status" DEFAULT 'none',
  	"review_note" varchar,
  	"last_editor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_vacancies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_vacancies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_department" varchar,
  	"version_location" varchar DEFAULT 'Addis Ababa',
  	"version_employment_type" "enum__vacancies_v_version_employment_type" DEFAULT 'full',
  	"version_closing_date" timestamp(3) with time zone,
  	"version_summary" varchar,
  	"version_details" jsonb,
  	"version_document_id" integer,
  	"version_apply_email" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_review_status" "enum__vacancies_v_version_review_status" DEFAULT 'none',
  	"version_review_note" varchar,
  	"version_last_editor" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__vacancies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"venue" varchar,
  	"summary" varchar,
  	"details" jsonb,
  	"image_id" integer,
  	"register_url" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"review_status" "enum_events_review_status" DEFAULT 'none',
  	"review_note" varchar,
  	"last_editor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_venue" varchar,
  	"version_summary" varchar,
  	"version_details" jsonb,
  	"version_image_id" integer,
  	"version_register_url" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_review_status" "enum__events_v_version_review_status" DEFAULT 'none',
  	"version_review_note" varchar,
  	"version_last_editor" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "notices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"message" varchar,
  	"severity" "enum_notices_severity" DEFAULT 'info',
  	"link_label" varchar,
  	"link_url" varchar,
  	"expires_at" timestamp(3) with time zone,
  	"review_status" "enum_notices_review_status" DEFAULT 'none',
  	"review_note" varchar,
  	"last_editor" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_notices_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_notices_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_message" varchar,
  	"version_severity" "enum__notices_v_version_severity" DEFAULT 'info',
  	"version_link_label" varchar,
  	"version_link_url" varchar,
  	"version_expires_at" timestamp(3) with time zone,
  	"version_review_status" "enum__notices_v_version_review_status" DEFAULT 'none',
  	"version_review_note" varchar,
  	"version_last_editor" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__notices_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"topic" varchar,
  	"subject" varchar,
  	"message" varchar NOT NULL,
  	"status" "enum_messages_status" DEFAULT 'new',
  	"assigned_to" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"status" "enum_subscribers_status" DEFAULT 'pending',
  	"token" varchar,
  	"confirmed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "page_views" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"views" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_share_url" varchar,
  	"sizes_share_width" numeric,
  	"sizes_share_height" numeric,
  	"sizes_share_mime_type" varchar,
  	"sizes_share_filesize" numeric,
  	"sizes_share_filename" varchar
  );
  
  CREATE TABLE "seo_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar NOT NULL,
  	"label" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"permanent" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"job_title" varchar,
  	"phone" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"last_login_at" timestamp(3) with time zone,
  	"last_login_ip" varchar,
  	"totp_secret" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "audit_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"action" "enum_audit_log_action" NOT NULL,
  	"actor" varchar,
  	"actor_role" varchar,
  	"resource" varchar,
  	"document_id" varchar,
  	"document_title" varchar,
  	"changes" jsonb,
  	"ip" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "totp_attempts" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attempts" numeric DEFAULT 0 NOT NULL,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"news_id" integer,
  	"publications_id" integer,
  	"faqs_id" integer,
  	"members_id" integer,
  	"key_figures_id" integer,
  	"people_id" integer,
  	"tenders_id" integer,
  	"vacancies_id" integer,
  	"events_id" integer,
  	"notices_id" integer,
  	"messages_id" integer,
  	"subscribers_id" integer,
  	"page_views_id" integer,
  	"media_id" integer,
  	"seo_pages_id" integer,
  	"redirects_id" integer,
  	"users_id" integer,
  	"audit_log_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_address" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"po_box" varchar,
  	"maintenance_enabled" boolean DEFAULT false,
  	"maintenance_message" varchar,
  	"notify_email" varchar,
  	"default_seo_title" varchar,
  	"default_seo_description" varchar,
  	"default_seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_main_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "navigation_main" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "brand_theme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"navy" varchar,
  	"blue" varchar,
  	"gold" varchar,
  	"heading_font" "enum_brand_theme_heading_font",
  	"body_font" "enum_brand_theme_body_font",
  	"logo_id" integer,
  	"logo_white_id" integer,
  	"use_text_logo" boolean DEFAULT false,
  	"wordmark" varchar DEFAULT 'EDIF',
  	"reset_to_defaults" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_home_hero_partners" ADD CONSTRAINT "pages_blocks_home_hero_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero_buttons" ADD CONSTRAINT "pages_blocks_home_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero_ledger" ADD CONSTRAINT "pages_blocks_home_hero_ledger_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero" ADD CONSTRAINT "pages_blocks_home_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_hero" ADD CONSTRAINT "pages_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero" ADD CONSTRAINT "pages_blocks_page_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_hero" ADD CONSTRAINT "pages_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_band_paragraphs" ADD CONSTRAINT "pages_blocks_band_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_band" ADD CONSTRAINT "pages_blocks_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_text_paragraphs" ADD CONSTRAINT "pages_blocks_split_text_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_text_bullets" ADD CONSTRAINT "pages_blocks_split_text_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_text_buttons" ADD CONSTRAINT "pages_blocks_split_text_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_text" ADD CONSTRAINT "pages_blocks_split_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_text" ADD CONSTRAINT "pages_blocks_split_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_vision_mission_items_bullets" ADD CONSTRAINT "pages_blocks_vision_mission_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_vision_mission_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_vision_mission_items" ADD CONSTRAINT "pages_blocks_vision_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_vision_mission"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_vision_mission" ADD CONSTRAINT "pages_blocks_vision_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pcards_items" ADD CONSTRAINT "pages_blocks_pcards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pcards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pcards" ADD CONSTRAINT "pages_blocks_pcards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_i_cards_items" ADD CONSTRAINT "pages_blocks_i_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_i_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_i_cards_buttons" ADD CONSTRAINT "pages_blocks_i_cards_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_i_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_i_cards" ADD CONSTRAINT "pages_blocks_i_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_numbered_list_items" ADD CONSTRAINT "pages_blocks_numbered_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_numbered_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_numbered_list" ADD CONSTRAINT "pages_blocks_numbered_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stat_grid_items" ADD CONSTRAINT "pages_blocks_stat_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stat_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stat_grid_buttons" ADD CONSTRAINT "pages_blocks_stat_grid_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stat_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stat_grid" ADD CONSTRAINT "pages_blocks_stat_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_org_chart_chain" ADD CONSTRAINT "pages_blocks_org_chart_chain_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_org_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_org_chart_branches_teams" ADD CONSTRAINT "pages_blocks_org_chart_branches_teams_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_org_chart_branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_org_chart_branches" ADD CONSTRAINT "pages_blocks_org_chart_branches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_org_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_org_chart" ADD CONSTRAINT "pages_blocks_org_chart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_board_seats" ADD CONSTRAINT "pages_blocks_board_seats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_board"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_board" ADD CONSTRAINT "pages_blocks_board_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_profiles" ADD CONSTRAINT "pages_blocks_profiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_crowd" ADD CONSTRAINT "pages_blocks_crowd_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_crowd" ADD CONSTRAINT "pages_blocks_crowd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rules_rules" ADD CONSTRAINT "pages_blocks_rules_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rules" ADD CONSTRAINT "pages_blocks_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare_covered" ADD CONSTRAINT "pages_blocks_compare_covered_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_compare"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare_main" ADD CONSTRAINT "pages_blocks_compare_main_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_compare"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare_all" ADD CONSTRAINT "pages_blocks_compare_all_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_compare"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_compare" ADD CONSTRAINT "pages_blocks_compare_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ticker" ADD CONSTRAINT "pages_blocks_ticker_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps_steps" ADD CONSTRAINT "pages_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_calc_section_steps" ADD CONSTRAINT "pages_blocks_calc_section_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_calc_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_calc_section" ADD CONSTRAINT "pages_blocks_calc_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_cards_items" ADD CONSTRAINT "pages_blocks_link_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_link_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_cards" ADD CONSTRAINT "pages_blocks_link_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_type_cards_items" ADD CONSTRAINT "pages_blocks_type_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_type_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_type_cards" ADD CONSTRAINT "pages_blocks_type_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_excl_panel_items" ADD CONSTRAINT "pages_blocks_excl_panel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_excl_panel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_excl_panel" ADD CONSTRAINT "pages_blocks_excl_panel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_worked_items_rows" ADD CONSTRAINT "pages_blocks_worked_items_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_worked_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_worked_items" ADD CONSTRAINT "pages_blocks_worked_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_worked"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_worked" ADD CONSTRAINT "pages_blocks_worked_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_part_questions" ADD CONSTRAINT "pages_blocks_faq_part_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_part"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_part" ADD CONSTRAINT "pages_blocks_faq_part_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_premium_cards_items" ADD CONSTRAINT "pages_blocks_premium_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_premium_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_premium_cards" ADD CONSTRAINT "pages_blocks_premium_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_member_directory" ADD CONSTRAINT "pages_blocks_member_directory_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lede_split_buttons" ADD CONSTRAINT "pages_blocks_lede_split_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lede_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lede_split_rules" ADD CONSTRAINT "pages_blocks_lede_split_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lede_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lede_split_mini_stats" ADD CONSTRAINT "pages_blocks_lede_split_mini_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lede_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lede_split_timeline" ADD CONSTRAINT "pages_blocks_lede_split_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lede_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lede_split" ADD CONSTRAINT "pages_blocks_lede_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_split" ADD CONSTRAINT "pages_blocks_faq_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_section" ADD CONSTRAINT "pages_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_next_links_items" ADD CONSTRAINT "pages_blocks_next_links_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_next_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_next_links" ADD CONSTRAINT "pages_blocks_next_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_items" ADD CONSTRAINT "pages_blocks_cards_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_items" ADD CONSTRAINT "pages_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards" ADD CONSTRAINT "pages_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_figures" ADD CONSTRAINT "pages_blocks_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faqs" ADD CONSTRAINT "pages_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_news" ADD CONSTRAINT "pages_blocks_news_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_publications" ADD CONSTRAINT "pages_blocks_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_people" ADD CONSTRAINT "pages_blocks_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads_files" ADD CONSTRAINT "pages_blocks_downloads_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads_files" ADD CONSTRAINT "pages_blocks_downloads_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads" ADD CONSTRAINT "pages_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_callout" ADD CONSTRAINT "pages_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_columns" ADD CONSTRAINT "pages_blocks_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_rows_cells" ADD CONSTRAINT "pages_blocks_table_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table_rows" ADD CONSTRAINT "pages_blocks_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table" ADD CONSTRAINT "pages_blocks_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_custom" ADD CONSTRAINT "pages_blocks_custom_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_key_figures_fk" FOREIGN KEY ("key_figures_id") REFERENCES "public"."key_figures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero_partners" ADD CONSTRAINT "_pages_v_blocks_home_hero_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_home_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero_ledger" ADD CONSTRAINT "_pages_v_blocks_home_hero_ledger_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero" ADD CONSTRAINT "_pages_v_blocks_home_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_hero" ADD CONSTRAINT "_pages_v_blocks_home_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD CONSTRAINT "_pages_v_blocks_page_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_hero" ADD CONSTRAINT "_pages_v_blocks_page_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_band_paragraphs" ADD CONSTRAINT "_pages_v_blocks_band_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_band" ADD CONSTRAINT "_pages_v_blocks_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_text_paragraphs" ADD CONSTRAINT "_pages_v_blocks_split_text_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_text_bullets" ADD CONSTRAINT "_pages_v_blocks_split_text_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_text_buttons" ADD CONSTRAINT "_pages_v_blocks_split_text_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_text" ADD CONSTRAINT "_pages_v_blocks_split_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_text" ADD CONSTRAINT "_pages_v_blocks_split_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_vision_mission_items_bullets" ADD CONSTRAINT "_pages_v_blocks_vision_mission_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_vision_mission_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_vision_mission_items" ADD CONSTRAINT "_pages_v_blocks_vision_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_vision_mission"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_vision_mission" ADD CONSTRAINT "_pages_v_blocks_vision_mission_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pcards_items" ADD CONSTRAINT "_pages_v_blocks_pcards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pcards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pcards" ADD CONSTRAINT "_pages_v_blocks_pcards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_i_cards_items" ADD CONSTRAINT "_pages_v_blocks_i_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_i_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_i_cards_buttons" ADD CONSTRAINT "_pages_v_blocks_i_cards_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_i_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_i_cards" ADD CONSTRAINT "_pages_v_blocks_i_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_numbered_list_items" ADD CONSTRAINT "_pages_v_blocks_numbered_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_numbered_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_numbered_list" ADD CONSTRAINT "_pages_v_blocks_numbered_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stat_grid_items" ADD CONSTRAINT "_pages_v_blocks_stat_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stat_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stat_grid_buttons" ADD CONSTRAINT "_pages_v_blocks_stat_grid_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stat_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stat_grid" ADD CONSTRAINT "_pages_v_blocks_stat_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_org_chart_chain" ADD CONSTRAINT "_pages_v_blocks_org_chart_chain_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_org_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_org_chart_branches_teams" ADD CONSTRAINT "_pages_v_blocks_org_chart_branches_teams_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_org_chart_branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_org_chart_branches" ADD CONSTRAINT "_pages_v_blocks_org_chart_branches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_org_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_org_chart" ADD CONSTRAINT "_pages_v_blocks_org_chart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_board_seats" ADD CONSTRAINT "_pages_v_blocks_board_seats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_board"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_board" ADD CONSTRAINT "_pages_v_blocks_board_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_profiles" ADD CONSTRAINT "_pages_v_blocks_profiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_crowd" ADD CONSTRAINT "_pages_v_blocks_crowd_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_crowd" ADD CONSTRAINT "_pages_v_blocks_crowd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rules_rules" ADD CONSTRAINT "_pages_v_blocks_rules_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rules" ADD CONSTRAINT "_pages_v_blocks_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_covered" ADD CONSTRAINT "_pages_v_blocks_compare_covered_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_compare"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_main" ADD CONSTRAINT "_pages_v_blocks_compare_main_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_compare"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare_all" ADD CONSTRAINT "_pages_v_blocks_compare_all_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_compare"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_compare" ADD CONSTRAINT "_pages_v_blocks_compare_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_ticker" ADD CONSTRAINT "_pages_v_blocks_ticker_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps_steps" ADD CONSTRAINT "_pages_v_blocks_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_calc_section_steps" ADD CONSTRAINT "_pages_v_blocks_calc_section_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_calc_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_calc_section" ADD CONSTRAINT "_pages_v_blocks_calc_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_cards_items" ADD CONSTRAINT "_pages_v_blocks_link_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_link_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_cards" ADD CONSTRAINT "_pages_v_blocks_link_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_type_cards_items" ADD CONSTRAINT "_pages_v_blocks_type_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_type_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_type_cards" ADD CONSTRAINT "_pages_v_blocks_type_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_excl_panel_items" ADD CONSTRAINT "_pages_v_blocks_excl_panel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_excl_panel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_excl_panel" ADD CONSTRAINT "_pages_v_blocks_excl_panel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_worked_items_rows" ADD CONSTRAINT "_pages_v_blocks_worked_items_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_worked_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_worked_items" ADD CONSTRAINT "_pages_v_blocks_worked_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_worked"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_worked" ADD CONSTRAINT "_pages_v_blocks_worked_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_part_questions" ADD CONSTRAINT "_pages_v_blocks_faq_part_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_part"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_part" ADD CONSTRAINT "_pages_v_blocks_faq_part_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_premium_cards_items" ADD CONSTRAINT "_pages_v_blocks_premium_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_premium_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_premium_cards" ADD CONSTRAINT "_pages_v_blocks_premium_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_member_directory" ADD CONSTRAINT "_pages_v_blocks_member_directory_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lede_split_buttons" ADD CONSTRAINT "_pages_v_blocks_lede_split_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lede_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lede_split_rules" ADD CONSTRAINT "_pages_v_blocks_lede_split_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lede_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lede_split_mini_stats" ADD CONSTRAINT "_pages_v_blocks_lede_split_mini_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lede_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lede_split_timeline" ADD CONSTRAINT "_pages_v_blocks_lede_split_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lede_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lede_split" ADD CONSTRAINT "_pages_v_blocks_lede_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_split" ADD CONSTRAINT "_pages_v_blocks_faq_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_section" ADD CONSTRAINT "_pages_v_blocks_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_next_links_items" ADD CONSTRAINT "_pages_v_blocks_next_links_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_next_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_next_links" ADD CONSTRAINT "_pages_v_blocks_next_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_items" ADD CONSTRAINT "_pages_v_blocks_cards_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_items" ADD CONSTRAINT "_pages_v_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards" ADD CONSTRAINT "_pages_v_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_figures" ADD CONSTRAINT "_pages_v_blocks_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faqs" ADD CONSTRAINT "_pages_v_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_news" ADD CONSTRAINT "_pages_v_blocks_news_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_publications" ADD CONSTRAINT "_pages_v_blocks_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_people" ADD CONSTRAINT "_pages_v_blocks_people_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_files" ADD CONSTRAINT "_pages_v_blocks_downloads_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_files" ADD CONSTRAINT "_pages_v_blocks_downloads_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads" ADD CONSTRAINT "_pages_v_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_callout" ADD CONSTRAINT "_pages_v_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_columns" ADD CONSTRAINT "_pages_v_blocks_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_rows_cells" ADD CONSTRAINT "_pages_v_blocks_table_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table_rows" ADD CONSTRAINT "_pages_v_blocks_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_table" ADD CONSTRAINT "_pages_v_blocks_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_custom" ADD CONSTRAINT "_pages_v_blocks_custom_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_key_figures_fk" FOREIGN KEY ("key_figures_id") REFERENCES "public"."key_figures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_gallery" ADD CONSTRAINT "news_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_gallery" ADD CONSTRAINT "news_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_version_gallery" ADD CONSTRAINT "_news_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_version_gallery" ADD CONSTRAINT "_news_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_pdf_id_media_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publications_stats" ADD CONSTRAINT "publications_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications" ADD CONSTRAINT "publications_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v_version_stats" ADD CONSTRAINT "_publications_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_publications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_parent_id_publications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_members_v" ADD CONSTRAINT "_members_v_parent_id_members_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_key_figures_v" ADD CONSTRAINT "_key_figures_v_parent_id_key_figures_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."key_figures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_parent_id_people_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_people_v" ADD CONSTRAINT "_people_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenders_documents" ADD CONSTRAINT "tenders_documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenders_documents" ADD CONSTRAINT "tenders_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenders" ADD CONSTRAINT "tenders_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenders_v_version_documents" ADD CONSTRAINT "_tenders_v_version_documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenders_v_version_documents" ADD CONSTRAINT "_tenders_v_version_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tenders_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tenders_v" ADD CONSTRAINT "_tenders_v_parent_id_tenders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tenders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tenders_v" ADD CONSTRAINT "_tenders_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vacancies" ADD CONSTRAINT "vacancies_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vacancies" ADD CONSTRAINT "vacancies_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vacancies_v" ADD CONSTRAINT "_vacancies_v_parent_id_vacancies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vacancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vacancies_v" ADD CONSTRAINT "_vacancies_v_version_document_id_media_id_fk" FOREIGN KEY ("version_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_vacancies_v" ADD CONSTRAINT "_vacancies_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_notices_v" ADD CONSTRAINT "_notices_v_parent_id_notices_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."notices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_pages" ADD CONSTRAINT "seo_pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_key_figures_fk" FOREIGN KEY ("key_figures_id") REFERENCES "public"."key_figures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenders_fk" FOREIGN KEY ("tenders_id") REFERENCES "public"."tenders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vacancies_fk" FOREIGN KEY ("vacancies_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notices_fk" FOREIGN KEY ("notices_id") REFERENCES "public"."notices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_views_fk" FOREIGN KEY ("page_views_id") REFERENCES "public"."page_views"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_seo_pages_fk" FOREIGN KEY ("seo_pages_id") REFERENCES "public"."seo_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_phones" ADD CONSTRAINT "site_settings_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_address" ADD CONSTRAINT "site_settings_address_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_seo_image_id_media_id_fk" FOREIGN KEY ("default_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_main_children" ADD CONSTRAINT "navigation_main_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_main"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main" ADD CONSTRAINT "navigation_main_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer" ADD CONSTRAINT "navigation_footer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brand_theme" ADD CONSTRAINT "brand_theme_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brand_theme" ADD CONSTRAINT "brand_theme_logo_white_id_media_id_fk" FOREIGN KEY ("logo_white_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_home_hero_partners_order_idx" ON "pages_blocks_home_hero_partners" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_hero_partners_parent_id_idx" ON "pages_blocks_home_hero_partners" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_hero_buttons_order_idx" ON "pages_blocks_home_hero_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_hero_buttons_parent_id_idx" ON "pages_blocks_home_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_hero_ledger_order_idx" ON "pages_blocks_home_hero_ledger" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_hero_ledger_parent_id_idx" ON "pages_blocks_home_hero_ledger" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_hero_order_idx" ON "pages_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_hero_parent_id_idx" ON "pages_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_hero_path_idx" ON "pages_blocks_home_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_home_hero_image_idx" ON "pages_blocks_home_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_page_hero_order_idx" ON "pages_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_hero_parent_id_idx" ON "pages_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_hero_path_idx" ON "pages_blocks_page_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_hero_image_idx" ON "pages_blocks_page_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_band_paragraphs_order_idx" ON "pages_blocks_band_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_band_paragraphs_parent_id_idx" ON "pages_blocks_band_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_band_order_idx" ON "pages_blocks_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_band_parent_id_idx" ON "pages_blocks_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_band_path_idx" ON "pages_blocks_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_text_paragraphs_order_idx" ON "pages_blocks_split_text_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_text_paragraphs_parent_id_idx" ON "pages_blocks_split_text_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_text_bullets_order_idx" ON "pages_blocks_split_text_bullets" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_text_bullets_parent_id_idx" ON "pages_blocks_split_text_bullets" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_text_buttons_order_idx" ON "pages_blocks_split_text_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_text_buttons_parent_id_idx" ON "pages_blocks_split_text_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_text_order_idx" ON "pages_blocks_split_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_text_parent_id_idx" ON "pages_blocks_split_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_text_path_idx" ON "pages_blocks_split_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_text_image_idx" ON "pages_blocks_split_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_vision_mission_items_bullets_order_idx" ON "pages_blocks_vision_mission_items_bullets" USING btree ("_order");
  CREATE INDEX "pages_blocks_vision_mission_items_bullets_parent_id_idx" ON "pages_blocks_vision_mission_items_bullets" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_vision_mission_items_order_idx" ON "pages_blocks_vision_mission_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_vision_mission_items_parent_id_idx" ON "pages_blocks_vision_mission_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_vision_mission_order_idx" ON "pages_blocks_vision_mission" USING btree ("_order");
  CREATE INDEX "pages_blocks_vision_mission_parent_id_idx" ON "pages_blocks_vision_mission" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_vision_mission_path_idx" ON "pages_blocks_vision_mission" USING btree ("_path");
  CREATE INDEX "pages_blocks_pcards_items_order_idx" ON "pages_blocks_pcards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_pcards_items_parent_id_idx" ON "pages_blocks_pcards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pcards_order_idx" ON "pages_blocks_pcards" USING btree ("_order");
  CREATE INDEX "pages_blocks_pcards_parent_id_idx" ON "pages_blocks_pcards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pcards_path_idx" ON "pages_blocks_pcards" USING btree ("_path");
  CREATE INDEX "pages_blocks_i_cards_items_order_idx" ON "pages_blocks_i_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_i_cards_items_parent_id_idx" ON "pages_blocks_i_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_i_cards_buttons_order_idx" ON "pages_blocks_i_cards_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_i_cards_buttons_parent_id_idx" ON "pages_blocks_i_cards_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_i_cards_order_idx" ON "pages_blocks_i_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_i_cards_parent_id_idx" ON "pages_blocks_i_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_i_cards_path_idx" ON "pages_blocks_i_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_numbered_list_items_order_idx" ON "pages_blocks_numbered_list_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_numbered_list_items_parent_id_idx" ON "pages_blocks_numbered_list_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_numbered_list_order_idx" ON "pages_blocks_numbered_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_numbered_list_parent_id_idx" ON "pages_blocks_numbered_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_numbered_list_path_idx" ON "pages_blocks_numbered_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_stat_grid_items_order_idx" ON "pages_blocks_stat_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stat_grid_items_parent_id_idx" ON "pages_blocks_stat_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stat_grid_buttons_order_idx" ON "pages_blocks_stat_grid_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_stat_grid_buttons_parent_id_idx" ON "pages_blocks_stat_grid_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stat_grid_order_idx" ON "pages_blocks_stat_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_stat_grid_parent_id_idx" ON "pages_blocks_stat_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stat_grid_path_idx" ON "pages_blocks_stat_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_org_chart_chain_order_idx" ON "pages_blocks_org_chart_chain" USING btree ("_order");
  CREATE INDEX "pages_blocks_org_chart_chain_parent_id_idx" ON "pages_blocks_org_chart_chain" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_org_chart_branches_teams_order_idx" ON "pages_blocks_org_chart_branches_teams" USING btree ("_order");
  CREATE INDEX "pages_blocks_org_chart_branches_teams_parent_id_idx" ON "pages_blocks_org_chart_branches_teams" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_org_chart_branches_order_idx" ON "pages_blocks_org_chart_branches" USING btree ("_order");
  CREATE INDEX "pages_blocks_org_chart_branches_parent_id_idx" ON "pages_blocks_org_chart_branches" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_org_chart_order_idx" ON "pages_blocks_org_chart" USING btree ("_order");
  CREATE INDEX "pages_blocks_org_chart_parent_id_idx" ON "pages_blocks_org_chart" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_org_chart_path_idx" ON "pages_blocks_org_chart" USING btree ("_path");
  CREATE INDEX "pages_blocks_board_seats_order_idx" ON "pages_blocks_board_seats" USING btree ("_order");
  CREATE INDEX "pages_blocks_board_seats_parent_id_idx" ON "pages_blocks_board_seats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_board_order_idx" ON "pages_blocks_board" USING btree ("_order");
  CREATE INDEX "pages_blocks_board_parent_id_idx" ON "pages_blocks_board" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_board_path_idx" ON "pages_blocks_board" USING btree ("_path");
  CREATE INDEX "pages_blocks_profiles_order_idx" ON "pages_blocks_profiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_profiles_parent_id_idx" ON "pages_blocks_profiles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_profiles_path_idx" ON "pages_blocks_profiles" USING btree ("_path");
  CREATE INDEX "pages_blocks_crowd_order_idx" ON "pages_blocks_crowd" USING btree ("_order");
  CREATE INDEX "pages_blocks_crowd_parent_id_idx" ON "pages_blocks_crowd" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_crowd_path_idx" ON "pages_blocks_crowd" USING btree ("_path");
  CREATE INDEX "pages_blocks_crowd_photo_idx" ON "pages_blocks_crowd" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_rules_rules_order_idx" ON "pages_blocks_rules_rules" USING btree ("_order");
  CREATE INDEX "pages_blocks_rules_rules_parent_id_idx" ON "pages_blocks_rules_rules" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rules_order_idx" ON "pages_blocks_rules" USING btree ("_order");
  CREATE INDEX "pages_blocks_rules_parent_id_idx" ON "pages_blocks_rules" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rules_path_idx" ON "pages_blocks_rules" USING btree ("_path");
  CREATE INDEX "pages_blocks_compare_covered_order_idx" ON "pages_blocks_compare_covered" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_covered_parent_id_idx" ON "pages_blocks_compare_covered" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_main_order_idx" ON "pages_blocks_compare_main" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_main_parent_id_idx" ON "pages_blocks_compare_main" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_all_order_idx" ON "pages_blocks_compare_all" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_all_parent_id_idx" ON "pages_blocks_compare_all" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_order_idx" ON "pages_blocks_compare" USING btree ("_order");
  CREATE INDEX "pages_blocks_compare_parent_id_idx" ON "pages_blocks_compare" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_compare_path_idx" ON "pages_blocks_compare" USING btree ("_path");
  CREATE INDEX "pages_blocks_ticker_order_idx" ON "pages_blocks_ticker" USING btree ("_order");
  CREATE INDEX "pages_blocks_ticker_parent_id_idx" ON "pages_blocks_ticker" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ticker_path_idx" ON "pages_blocks_ticker" USING btree ("_path");
  CREATE INDEX "pages_blocks_steps_steps_order_idx" ON "pages_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_steps_parent_id_idx" ON "pages_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_calc_section_steps_order_idx" ON "pages_blocks_calc_section_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_calc_section_steps_parent_id_idx" ON "pages_blocks_calc_section_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_calc_section_order_idx" ON "pages_blocks_calc_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_calc_section_parent_id_idx" ON "pages_blocks_calc_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_calc_section_path_idx" ON "pages_blocks_calc_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_link_cards_items_order_idx" ON "pages_blocks_link_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_cards_items_parent_id_idx" ON "pages_blocks_link_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_cards_order_idx" ON "pages_blocks_link_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_cards_parent_id_idx" ON "pages_blocks_link_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_cards_path_idx" ON "pages_blocks_link_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_type_cards_items_order_idx" ON "pages_blocks_type_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_type_cards_items_parent_id_idx" ON "pages_blocks_type_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_type_cards_order_idx" ON "pages_blocks_type_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_type_cards_parent_id_idx" ON "pages_blocks_type_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_type_cards_path_idx" ON "pages_blocks_type_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_excl_panel_items_order_idx" ON "pages_blocks_excl_panel_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_excl_panel_items_parent_id_idx" ON "pages_blocks_excl_panel_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_excl_panel_order_idx" ON "pages_blocks_excl_panel" USING btree ("_order");
  CREATE INDEX "pages_blocks_excl_panel_parent_id_idx" ON "pages_blocks_excl_panel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_excl_panel_path_idx" ON "pages_blocks_excl_panel" USING btree ("_path");
  CREATE INDEX "pages_blocks_worked_items_rows_order_idx" ON "pages_blocks_worked_items_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_worked_items_rows_parent_id_idx" ON "pages_blocks_worked_items_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_worked_items_order_idx" ON "pages_blocks_worked_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_worked_items_parent_id_idx" ON "pages_blocks_worked_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_worked_order_idx" ON "pages_blocks_worked" USING btree ("_order");
  CREATE INDEX "pages_blocks_worked_parent_id_idx" ON "pages_blocks_worked" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_worked_path_idx" ON "pages_blocks_worked" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_part_questions_order_idx" ON "pages_blocks_faq_part_questions" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_part_questions_parent_id_idx" ON "pages_blocks_faq_part_questions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_part_order_idx" ON "pages_blocks_faq_part" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_part_parent_id_idx" ON "pages_blocks_faq_part" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_part_path_idx" ON "pages_blocks_faq_part" USING btree ("_path");
  CREATE INDEX "pages_blocks_premium_cards_items_order_idx" ON "pages_blocks_premium_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_premium_cards_items_parent_id_idx" ON "pages_blocks_premium_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_premium_cards_order_idx" ON "pages_blocks_premium_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_premium_cards_parent_id_idx" ON "pages_blocks_premium_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_premium_cards_path_idx" ON "pages_blocks_premium_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_member_directory_order_idx" ON "pages_blocks_member_directory" USING btree ("_order");
  CREATE INDEX "pages_blocks_member_directory_parent_id_idx" ON "pages_blocks_member_directory" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_member_directory_path_idx" ON "pages_blocks_member_directory" USING btree ("_path");
  CREATE INDEX "pages_blocks_lede_split_buttons_order_idx" ON "pages_blocks_lede_split_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_lede_split_buttons_parent_id_idx" ON "pages_blocks_lede_split_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lede_split_rules_order_idx" ON "pages_blocks_lede_split_rules" USING btree ("_order");
  CREATE INDEX "pages_blocks_lede_split_rules_parent_id_idx" ON "pages_blocks_lede_split_rules" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lede_split_mini_stats_order_idx" ON "pages_blocks_lede_split_mini_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_lede_split_mini_stats_parent_id_idx" ON "pages_blocks_lede_split_mini_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lede_split_timeline_order_idx" ON "pages_blocks_lede_split_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_lede_split_timeline_parent_id_idx" ON "pages_blocks_lede_split_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lede_split_order_idx" ON "pages_blocks_lede_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_lede_split_parent_id_idx" ON "pages_blocks_lede_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lede_split_path_idx" ON "pages_blocks_lede_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_split_order_idx" ON "pages_blocks_faq_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_split_parent_id_idx" ON "pages_blocks_faq_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_split_path_idx" ON "pages_blocks_faq_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_section_order_idx" ON "pages_blocks_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_section_parent_id_idx" ON "pages_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_section_path_idx" ON "pages_blocks_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_next_links_items_order_idx" ON "pages_blocks_next_links_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_next_links_items_parent_id_idx" ON "pages_blocks_next_links_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_next_links_order_idx" ON "pages_blocks_next_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_next_links_parent_id_idx" ON "pages_blocks_next_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_next_links_path_idx" ON "pages_blocks_next_links" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_cards_items_order_idx" ON "pages_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_items_parent_id_idx" ON "pages_blocks_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_items_image_idx" ON "pages_blocks_cards_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_cards_order_idx" ON "pages_blocks_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_parent_id_idx" ON "pages_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_path_idx" ON "pages_blocks_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_figures_order_idx" ON "pages_blocks_figures" USING btree ("_order");
  CREATE INDEX "pages_blocks_figures_parent_id_idx" ON "pages_blocks_figures" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_figures_path_idx" ON "pages_blocks_figures" USING btree ("_path");
  CREATE INDEX "pages_blocks_faqs_order_idx" ON "pages_blocks_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faqs_parent_id_idx" ON "pages_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faqs_path_idx" ON "pages_blocks_faqs" USING btree ("_path");
  CREATE INDEX "pages_blocks_news_order_idx" ON "pages_blocks_news" USING btree ("_order");
  CREATE INDEX "pages_blocks_news_parent_id_idx" ON "pages_blocks_news" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_news_path_idx" ON "pages_blocks_news" USING btree ("_path");
  CREATE INDEX "pages_blocks_publications_order_idx" ON "pages_blocks_publications" USING btree ("_order");
  CREATE INDEX "pages_blocks_publications_parent_id_idx" ON "pages_blocks_publications" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_publications_path_idx" ON "pages_blocks_publications" USING btree ("_path");
  CREATE INDEX "pages_blocks_people_order_idx" ON "pages_blocks_people" USING btree ("_order");
  CREATE INDEX "pages_blocks_people_parent_id_idx" ON "pages_blocks_people" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_people_path_idx" ON "pages_blocks_people" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_downloads_files_order_idx" ON "pages_blocks_downloads_files" USING btree ("_order");
  CREATE INDEX "pages_blocks_downloads_files_parent_id_idx" ON "pages_blocks_downloads_files" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_downloads_files_file_idx" ON "pages_blocks_downloads_files" USING btree ("file_id");
  CREATE INDEX "pages_blocks_downloads_order_idx" ON "pages_blocks_downloads" USING btree ("_order");
  CREATE INDEX "pages_blocks_downloads_parent_id_idx" ON "pages_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_downloads_path_idx" ON "pages_blocks_downloads" USING btree ("_path");
  CREATE INDEX "pages_blocks_callout_order_idx" ON "pages_blocks_callout" USING btree ("_order");
  CREATE INDEX "pages_blocks_callout_parent_id_idx" ON "pages_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_callout_path_idx" ON "pages_blocks_callout" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_table_columns_order_idx" ON "pages_blocks_table_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_columns_parent_id_idx" ON "pages_blocks_table_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_rows_cells_order_idx" ON "pages_blocks_table_rows_cells" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_rows_cells_parent_id_idx" ON "pages_blocks_table_rows_cells" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_rows_order_idx" ON "pages_blocks_table_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_rows_parent_id_idx" ON "pages_blocks_table_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_order_idx" ON "pages_blocks_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_parent_id_idx" ON "pages_blocks_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_path_idx" ON "pages_blocks_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_custom_order_idx" ON "pages_blocks_custom" USING btree ("_order");
  CREATE INDEX "pages_blocks_custom_parent_id_idx" ON "pages_blocks_custom" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_custom_path_idx" ON "pages_blocks_custom" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_path_idx" ON "pages" USING btree ("path");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_key_figures_id_idx" ON "pages_rels" USING btree ("key_figures_id");
  CREATE INDEX "_pages_v_blocks_home_hero_partners_order_idx" ON "_pages_v_blocks_home_hero_partners" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_hero_partners_parent_id_idx" ON "_pages_v_blocks_home_hero_partners" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_buttons_order_idx" ON "_pages_v_blocks_home_hero_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_hero_buttons_parent_id_idx" ON "_pages_v_blocks_home_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_ledger_order_idx" ON "_pages_v_blocks_home_hero_ledger" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_hero_ledger_parent_id_idx" ON "_pages_v_blocks_home_hero_ledger" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_order_idx" ON "_pages_v_blocks_home_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_hero_parent_id_idx" ON "_pages_v_blocks_home_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_hero_path_idx" ON "_pages_v_blocks_home_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_home_hero_image_idx" ON "_pages_v_blocks_home_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_page_hero_order_idx" ON "_pages_v_blocks_page_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_hero_parent_id_idx" ON "_pages_v_blocks_page_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_hero_path_idx" ON "_pages_v_blocks_page_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_hero_image_idx" ON "_pages_v_blocks_page_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_band_paragraphs_order_idx" ON "_pages_v_blocks_band_paragraphs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_band_paragraphs_parent_id_idx" ON "_pages_v_blocks_band_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_band_order_idx" ON "_pages_v_blocks_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_band_parent_id_idx" ON "_pages_v_blocks_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_band_path_idx" ON "_pages_v_blocks_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_text_paragraphs_order_idx" ON "_pages_v_blocks_split_text_paragraphs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_text_paragraphs_parent_id_idx" ON "_pages_v_blocks_split_text_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_text_bullets_order_idx" ON "_pages_v_blocks_split_text_bullets" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_text_bullets_parent_id_idx" ON "_pages_v_blocks_split_text_bullets" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_text_buttons_order_idx" ON "_pages_v_blocks_split_text_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_text_buttons_parent_id_idx" ON "_pages_v_blocks_split_text_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_text_order_idx" ON "_pages_v_blocks_split_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_text_parent_id_idx" ON "_pages_v_blocks_split_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_text_path_idx" ON "_pages_v_blocks_split_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_text_image_idx" ON "_pages_v_blocks_split_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_vision_mission_items_bullets_order_idx" ON "_pages_v_blocks_vision_mission_items_bullets" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_vision_mission_items_bullets_parent_id_idx" ON "_pages_v_blocks_vision_mission_items_bullets" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_vision_mission_items_order_idx" ON "_pages_v_blocks_vision_mission_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_vision_mission_items_parent_id_idx" ON "_pages_v_blocks_vision_mission_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_vision_mission_order_idx" ON "_pages_v_blocks_vision_mission" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_vision_mission_parent_id_idx" ON "_pages_v_blocks_vision_mission" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_vision_mission_path_idx" ON "_pages_v_blocks_vision_mission" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pcards_items_order_idx" ON "_pages_v_blocks_pcards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pcards_items_parent_id_idx" ON "_pages_v_blocks_pcards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pcards_order_idx" ON "_pages_v_blocks_pcards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pcards_parent_id_idx" ON "_pages_v_blocks_pcards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pcards_path_idx" ON "_pages_v_blocks_pcards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_i_cards_items_order_idx" ON "_pages_v_blocks_i_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_i_cards_items_parent_id_idx" ON "_pages_v_blocks_i_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_i_cards_buttons_order_idx" ON "_pages_v_blocks_i_cards_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_i_cards_buttons_parent_id_idx" ON "_pages_v_blocks_i_cards_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_i_cards_order_idx" ON "_pages_v_blocks_i_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_i_cards_parent_id_idx" ON "_pages_v_blocks_i_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_i_cards_path_idx" ON "_pages_v_blocks_i_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_numbered_list_items_order_idx" ON "_pages_v_blocks_numbered_list_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_numbered_list_items_parent_id_idx" ON "_pages_v_blocks_numbered_list_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_numbered_list_order_idx" ON "_pages_v_blocks_numbered_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_numbered_list_parent_id_idx" ON "_pages_v_blocks_numbered_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_numbered_list_path_idx" ON "_pages_v_blocks_numbered_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stat_grid_items_order_idx" ON "_pages_v_blocks_stat_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stat_grid_items_parent_id_idx" ON "_pages_v_blocks_stat_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stat_grid_buttons_order_idx" ON "_pages_v_blocks_stat_grid_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stat_grid_buttons_parent_id_idx" ON "_pages_v_blocks_stat_grid_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stat_grid_order_idx" ON "_pages_v_blocks_stat_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stat_grid_parent_id_idx" ON "_pages_v_blocks_stat_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stat_grid_path_idx" ON "_pages_v_blocks_stat_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_org_chart_chain_order_idx" ON "_pages_v_blocks_org_chart_chain" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_org_chart_chain_parent_id_idx" ON "_pages_v_blocks_org_chart_chain" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_org_chart_branches_teams_order_idx" ON "_pages_v_blocks_org_chart_branches_teams" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_org_chart_branches_teams_parent_id_idx" ON "_pages_v_blocks_org_chart_branches_teams" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_org_chart_branches_order_idx" ON "_pages_v_blocks_org_chart_branches" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_org_chart_branches_parent_id_idx" ON "_pages_v_blocks_org_chart_branches" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_org_chart_order_idx" ON "_pages_v_blocks_org_chart" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_org_chart_parent_id_idx" ON "_pages_v_blocks_org_chart" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_org_chart_path_idx" ON "_pages_v_blocks_org_chart" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_board_seats_order_idx" ON "_pages_v_blocks_board_seats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_board_seats_parent_id_idx" ON "_pages_v_blocks_board_seats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_board_order_idx" ON "_pages_v_blocks_board" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_board_parent_id_idx" ON "_pages_v_blocks_board" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_board_path_idx" ON "_pages_v_blocks_board" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_profiles_order_idx" ON "_pages_v_blocks_profiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_profiles_parent_id_idx" ON "_pages_v_blocks_profiles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_profiles_path_idx" ON "_pages_v_blocks_profiles" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_crowd_order_idx" ON "_pages_v_blocks_crowd" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_crowd_parent_id_idx" ON "_pages_v_blocks_crowd" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_crowd_path_idx" ON "_pages_v_blocks_crowd" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_crowd_photo_idx" ON "_pages_v_blocks_crowd" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_rules_rules_order_idx" ON "_pages_v_blocks_rules_rules" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rules_rules_parent_id_idx" ON "_pages_v_blocks_rules_rules" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rules_order_idx" ON "_pages_v_blocks_rules" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rules_parent_id_idx" ON "_pages_v_blocks_rules" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rules_path_idx" ON "_pages_v_blocks_rules" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_compare_covered_order_idx" ON "_pages_v_blocks_compare_covered" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_covered_parent_id_idx" ON "_pages_v_blocks_compare_covered" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_main_order_idx" ON "_pages_v_blocks_compare_main" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_main_parent_id_idx" ON "_pages_v_blocks_compare_main" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_all_order_idx" ON "_pages_v_blocks_compare_all" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_all_parent_id_idx" ON "_pages_v_blocks_compare_all" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_order_idx" ON "_pages_v_blocks_compare" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_compare_parent_id_idx" ON "_pages_v_blocks_compare" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_compare_path_idx" ON "_pages_v_blocks_compare" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_ticker_order_idx" ON "_pages_v_blocks_ticker" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_ticker_parent_id_idx" ON "_pages_v_blocks_ticker" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_ticker_path_idx" ON "_pages_v_blocks_ticker" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_steps_steps_order_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_steps_parent_id_idx" ON "_pages_v_blocks_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_calc_section_steps_order_idx" ON "_pages_v_blocks_calc_section_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_calc_section_steps_parent_id_idx" ON "_pages_v_blocks_calc_section_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_calc_section_order_idx" ON "_pages_v_blocks_calc_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_calc_section_parent_id_idx" ON "_pages_v_blocks_calc_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_calc_section_path_idx" ON "_pages_v_blocks_calc_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_link_cards_items_order_idx" ON "_pages_v_blocks_link_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_cards_items_parent_id_idx" ON "_pages_v_blocks_link_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_cards_order_idx" ON "_pages_v_blocks_link_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_cards_parent_id_idx" ON "_pages_v_blocks_link_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_cards_path_idx" ON "_pages_v_blocks_link_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_type_cards_items_order_idx" ON "_pages_v_blocks_type_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_type_cards_items_parent_id_idx" ON "_pages_v_blocks_type_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_type_cards_order_idx" ON "_pages_v_blocks_type_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_type_cards_parent_id_idx" ON "_pages_v_blocks_type_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_type_cards_path_idx" ON "_pages_v_blocks_type_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_excl_panel_items_order_idx" ON "_pages_v_blocks_excl_panel_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_excl_panel_items_parent_id_idx" ON "_pages_v_blocks_excl_panel_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_excl_panel_order_idx" ON "_pages_v_blocks_excl_panel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_excl_panel_parent_id_idx" ON "_pages_v_blocks_excl_panel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_excl_panel_path_idx" ON "_pages_v_blocks_excl_panel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_worked_items_rows_order_idx" ON "_pages_v_blocks_worked_items_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_worked_items_rows_parent_id_idx" ON "_pages_v_blocks_worked_items_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_worked_items_order_idx" ON "_pages_v_blocks_worked_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_worked_items_parent_id_idx" ON "_pages_v_blocks_worked_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_worked_order_idx" ON "_pages_v_blocks_worked" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_worked_parent_id_idx" ON "_pages_v_blocks_worked" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_worked_path_idx" ON "_pages_v_blocks_worked" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_part_questions_order_idx" ON "_pages_v_blocks_faq_part_questions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_part_questions_parent_id_idx" ON "_pages_v_blocks_faq_part_questions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_part_order_idx" ON "_pages_v_blocks_faq_part" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_part_parent_id_idx" ON "_pages_v_blocks_faq_part" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_part_path_idx" ON "_pages_v_blocks_faq_part" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_premium_cards_items_order_idx" ON "_pages_v_blocks_premium_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_premium_cards_items_parent_id_idx" ON "_pages_v_blocks_premium_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_premium_cards_order_idx" ON "_pages_v_blocks_premium_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_premium_cards_parent_id_idx" ON "_pages_v_blocks_premium_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_premium_cards_path_idx" ON "_pages_v_blocks_premium_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_member_directory_order_idx" ON "_pages_v_blocks_member_directory" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_member_directory_parent_id_idx" ON "_pages_v_blocks_member_directory" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_member_directory_path_idx" ON "_pages_v_blocks_member_directory" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_lede_split_buttons_order_idx" ON "_pages_v_blocks_lede_split_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lede_split_buttons_parent_id_idx" ON "_pages_v_blocks_lede_split_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lede_split_rules_order_idx" ON "_pages_v_blocks_lede_split_rules" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lede_split_rules_parent_id_idx" ON "_pages_v_blocks_lede_split_rules" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lede_split_mini_stats_order_idx" ON "_pages_v_blocks_lede_split_mini_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lede_split_mini_stats_parent_id_idx" ON "_pages_v_blocks_lede_split_mini_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lede_split_timeline_order_idx" ON "_pages_v_blocks_lede_split_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lede_split_timeline_parent_id_idx" ON "_pages_v_blocks_lede_split_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lede_split_order_idx" ON "_pages_v_blocks_lede_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lede_split_parent_id_idx" ON "_pages_v_blocks_lede_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lede_split_path_idx" ON "_pages_v_blocks_lede_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_split_order_idx" ON "_pages_v_blocks_faq_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_split_parent_id_idx" ON "_pages_v_blocks_faq_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_split_path_idx" ON "_pages_v_blocks_faq_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_section_order_idx" ON "_pages_v_blocks_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_section_parent_id_idx" ON "_pages_v_blocks_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_section_path_idx" ON "_pages_v_blocks_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_next_links_items_order_idx" ON "_pages_v_blocks_next_links_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_next_links_items_parent_id_idx" ON "_pages_v_blocks_next_links_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_next_links_order_idx" ON "_pages_v_blocks_next_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_next_links_parent_id_idx" ON "_pages_v_blocks_next_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_next_links_path_idx" ON "_pages_v_blocks_next_links" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cards_items_order_idx" ON "_pages_v_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_items_parent_id_idx" ON "_pages_v_blocks_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_items_image_idx" ON "_pages_v_blocks_cards_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_cards_order_idx" ON "_pages_v_blocks_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_parent_id_idx" ON "_pages_v_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_path_idx" ON "_pages_v_blocks_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_figures_order_idx" ON "_pages_v_blocks_figures" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_figures_parent_id_idx" ON "_pages_v_blocks_figures" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_figures_path_idx" ON "_pages_v_blocks_figures" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faqs_order_idx" ON "_pages_v_blocks_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faqs_parent_id_idx" ON "_pages_v_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faqs_path_idx" ON "_pages_v_blocks_faqs" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_news_order_idx" ON "_pages_v_blocks_news" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_news_parent_id_idx" ON "_pages_v_blocks_news" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_news_path_idx" ON "_pages_v_blocks_news" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_publications_order_idx" ON "_pages_v_blocks_publications" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_publications_parent_id_idx" ON "_pages_v_blocks_publications" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_publications_path_idx" ON "_pages_v_blocks_publications" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_people_order_idx" ON "_pages_v_blocks_people" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_people_parent_id_idx" ON "_pages_v_blocks_people" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_people_path_idx" ON "_pages_v_blocks_people" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_images_order_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_images_parent_id_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_images_image_idx" ON "_pages_v_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_downloads_files_order_idx" ON "_pages_v_blocks_downloads_files" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_downloads_files_parent_id_idx" ON "_pages_v_blocks_downloads_files" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_files_file_idx" ON "_pages_v_blocks_downloads_files" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_downloads_order_idx" ON "_pages_v_blocks_downloads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_downloads_parent_id_idx" ON "_pages_v_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_path_idx" ON "_pages_v_blocks_downloads" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_callout_order_idx" ON "_pages_v_blocks_callout" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_callout_parent_id_idx" ON "_pages_v_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_callout_path_idx" ON "_pages_v_blocks_callout" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_table_columns_order_idx" ON "_pages_v_blocks_table_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_columns_parent_id_idx" ON "_pages_v_blocks_table_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_rows_cells_order_idx" ON "_pages_v_blocks_table_rows_cells" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_rows_cells_parent_id_idx" ON "_pages_v_blocks_table_rows_cells" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_rows_order_idx" ON "_pages_v_blocks_table_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_rows_parent_id_idx" ON "_pages_v_blocks_table_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_order_idx" ON "_pages_v_blocks_table" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_table_parent_id_idx" ON "_pages_v_blocks_table" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_table_path_idx" ON "_pages_v_blocks_table" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_custom_order_idx" ON "_pages_v_blocks_custom" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_custom_parent_id_idx" ON "_pages_v_blocks_custom" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_custom_path_idx" ON "_pages_v_blocks_custom" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_path_idx" ON "_pages_v" USING btree ("version_path");
  CREATE INDEX "_pages_v_version_seo_version_seo_image_idx" ON "_pages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version_deleted_at_idx" ON "_pages_v" USING btree ("version_deleted_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_key_figures_id_idx" ON "_pages_v_rels" USING btree ("key_figures_id");
  CREATE INDEX "news_gallery_order_idx" ON "news_gallery" USING btree ("_order");
  CREATE INDEX "news_gallery_parent_id_idx" ON "news_gallery" USING btree ("_parent_id");
  CREATE INDEX "news_gallery_image_idx" ON "news_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE INDEX "news_pdf_idx" ON "news" USING btree ("pdf_id");
  CREATE INDEX "news_seo_seo_image_idx" ON "news" USING btree ("seo_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news_deleted_at_idx" ON "news" USING btree ("deleted_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "_news_v_version_gallery_order_idx" ON "_news_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_news_v_version_gallery_parent_id_idx" ON "_news_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_news_v_version_gallery_image_idx" ON "_news_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_version_pdf_idx" ON "_news_v" USING btree ("version_pdf_id");
  CREATE INDEX "_news_v_version_seo_version_seo_image_idx" ON "_news_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version_deleted_at_idx" ON "_news_v" USING btree ("version_deleted_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "publications_stats_order_idx" ON "publications_stats" USING btree ("_order");
  CREATE INDEX "publications_stats_parent_id_idx" ON "publications_stats" USING btree ("_parent_id");
  CREATE INDEX "publications_file_idx" ON "publications" USING btree ("file_id");
  CREATE INDEX "publications_updated_at_idx" ON "publications" USING btree ("updated_at");
  CREATE INDEX "publications_created_at_idx" ON "publications" USING btree ("created_at");
  CREATE INDEX "publications_deleted_at_idx" ON "publications" USING btree ("deleted_at");
  CREATE INDEX "publications__status_idx" ON "publications" USING btree ("_status");
  CREATE INDEX "_publications_v_version_stats_order_idx" ON "_publications_v_version_stats" USING btree ("_order");
  CREATE INDEX "_publications_v_version_stats_parent_id_idx" ON "_publications_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX "_publications_v_parent_idx" ON "_publications_v" USING btree ("parent_id");
  CREATE INDEX "_publications_v_version_version_file_idx" ON "_publications_v" USING btree ("version_file_id");
  CREATE INDEX "_publications_v_version_version_updated_at_idx" ON "_publications_v" USING btree ("version_updated_at");
  CREATE INDEX "_publications_v_version_version_created_at_idx" ON "_publications_v" USING btree ("version_created_at");
  CREATE INDEX "_publications_v_version_version_deleted_at_idx" ON "_publications_v" USING btree ("version_deleted_at");
  CREATE INDEX "_publications_v_version_version__status_idx" ON "_publications_v" USING btree ("version__status");
  CREATE INDEX "_publications_v_created_at_idx" ON "_publications_v" USING btree ("created_at");
  CREATE INDEX "_publications_v_updated_at_idx" ON "_publications_v" USING btree ("updated_at");
  CREATE INDEX "_publications_v_latest_idx" ON "_publications_v" USING btree ("latest");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs_deleted_at_idx" ON "faqs" USING btree ("deleted_at");
  CREATE INDEX "faqs__status_idx" ON "faqs" USING btree ("_status");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_version_version_deleted_at_idx" ON "_faqs_v" USING btree ("version_deleted_at");
  CREATE INDEX "_faqs_v_version_version__status_idx" ON "_faqs_v" USING btree ("version__status");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_latest_idx" ON "_faqs_v" USING btree ("latest");
  CREATE INDEX "members_updated_at_idx" ON "members" USING btree ("updated_at");
  CREATE INDEX "members_created_at_idx" ON "members" USING btree ("created_at");
  CREATE INDEX "members_deleted_at_idx" ON "members" USING btree ("deleted_at");
  CREATE INDEX "members__status_idx" ON "members" USING btree ("_status");
  CREATE INDEX "_members_v_parent_idx" ON "_members_v" USING btree ("parent_id");
  CREATE INDEX "_members_v_version_version_updated_at_idx" ON "_members_v" USING btree ("version_updated_at");
  CREATE INDEX "_members_v_version_version_created_at_idx" ON "_members_v" USING btree ("version_created_at");
  CREATE INDEX "_members_v_version_version_deleted_at_idx" ON "_members_v" USING btree ("version_deleted_at");
  CREATE INDEX "_members_v_version_version__status_idx" ON "_members_v" USING btree ("version__status");
  CREATE INDEX "_members_v_created_at_idx" ON "_members_v" USING btree ("created_at");
  CREATE INDEX "_members_v_updated_at_idx" ON "_members_v" USING btree ("updated_at");
  CREATE INDEX "_members_v_latest_idx" ON "_members_v" USING btree ("latest");
  CREATE UNIQUE INDEX "key_figures_key_idx" ON "key_figures" USING btree ("key");
  CREATE INDEX "key_figures_updated_at_idx" ON "key_figures" USING btree ("updated_at");
  CREATE INDEX "key_figures_created_at_idx" ON "key_figures" USING btree ("created_at");
  CREATE INDEX "key_figures_deleted_at_idx" ON "key_figures" USING btree ("deleted_at");
  CREATE INDEX "key_figures__status_idx" ON "key_figures" USING btree ("_status");
  CREATE INDEX "_key_figures_v_parent_idx" ON "_key_figures_v" USING btree ("parent_id");
  CREATE INDEX "_key_figures_v_version_version_key_idx" ON "_key_figures_v" USING btree ("version_key");
  CREATE INDEX "_key_figures_v_version_version_updated_at_idx" ON "_key_figures_v" USING btree ("version_updated_at");
  CREATE INDEX "_key_figures_v_version_version_created_at_idx" ON "_key_figures_v" USING btree ("version_created_at");
  CREATE INDEX "_key_figures_v_version_version_deleted_at_idx" ON "_key_figures_v" USING btree ("version_deleted_at");
  CREATE INDEX "_key_figures_v_version_version__status_idx" ON "_key_figures_v" USING btree ("version__status");
  CREATE INDEX "_key_figures_v_created_at_idx" ON "_key_figures_v" USING btree ("created_at");
  CREATE INDEX "_key_figures_v_updated_at_idx" ON "_key_figures_v" USING btree ("updated_at");
  CREATE INDEX "_key_figures_v_latest_idx" ON "_key_figures_v" USING btree ("latest");
  CREATE INDEX "people_photo_idx" ON "people" USING btree ("photo_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "people_deleted_at_idx" ON "people" USING btree ("deleted_at");
  CREATE INDEX "people__status_idx" ON "people" USING btree ("_status");
  CREATE INDEX "_people_v_parent_idx" ON "_people_v" USING btree ("parent_id");
  CREATE INDEX "_people_v_version_version_photo_idx" ON "_people_v" USING btree ("version_photo_id");
  CREATE INDEX "_people_v_version_version_updated_at_idx" ON "_people_v" USING btree ("version_updated_at");
  CREATE INDEX "_people_v_version_version_created_at_idx" ON "_people_v" USING btree ("version_created_at");
  CREATE INDEX "_people_v_version_version_deleted_at_idx" ON "_people_v" USING btree ("version_deleted_at");
  CREATE INDEX "_people_v_version_version__status_idx" ON "_people_v" USING btree ("version__status");
  CREATE INDEX "_people_v_created_at_idx" ON "_people_v" USING btree ("created_at");
  CREATE INDEX "_people_v_updated_at_idx" ON "_people_v" USING btree ("updated_at");
  CREATE INDEX "_people_v_latest_idx" ON "_people_v" USING btree ("latest");
  CREATE INDEX "tenders_documents_order_idx" ON "tenders_documents" USING btree ("_order");
  CREATE INDEX "tenders_documents_parent_id_idx" ON "tenders_documents" USING btree ("_parent_id");
  CREATE INDEX "tenders_documents_file_idx" ON "tenders_documents" USING btree ("file_id");
  CREATE UNIQUE INDEX "tenders_slug_idx" ON "tenders" USING btree ("slug");
  CREATE INDEX "tenders_seo_seo_image_idx" ON "tenders" USING btree ("seo_image_id");
  CREATE INDEX "tenders_updated_at_idx" ON "tenders" USING btree ("updated_at");
  CREATE INDEX "tenders_created_at_idx" ON "tenders" USING btree ("created_at");
  CREATE INDEX "tenders_deleted_at_idx" ON "tenders" USING btree ("deleted_at");
  CREATE INDEX "tenders__status_idx" ON "tenders" USING btree ("_status");
  CREATE INDEX "_tenders_v_version_documents_order_idx" ON "_tenders_v_version_documents" USING btree ("_order");
  CREATE INDEX "_tenders_v_version_documents_parent_id_idx" ON "_tenders_v_version_documents" USING btree ("_parent_id");
  CREATE INDEX "_tenders_v_version_documents_file_idx" ON "_tenders_v_version_documents" USING btree ("file_id");
  CREATE INDEX "_tenders_v_parent_idx" ON "_tenders_v" USING btree ("parent_id");
  CREATE INDEX "_tenders_v_version_version_slug_idx" ON "_tenders_v" USING btree ("version_slug");
  CREATE INDEX "_tenders_v_version_seo_version_seo_image_idx" ON "_tenders_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_tenders_v_version_version_updated_at_idx" ON "_tenders_v" USING btree ("version_updated_at");
  CREATE INDEX "_tenders_v_version_version_created_at_idx" ON "_tenders_v" USING btree ("version_created_at");
  CREATE INDEX "_tenders_v_version_version_deleted_at_idx" ON "_tenders_v" USING btree ("version_deleted_at");
  CREATE INDEX "_tenders_v_version_version__status_idx" ON "_tenders_v" USING btree ("version__status");
  CREATE INDEX "_tenders_v_created_at_idx" ON "_tenders_v" USING btree ("created_at");
  CREATE INDEX "_tenders_v_updated_at_idx" ON "_tenders_v" USING btree ("updated_at");
  CREATE INDEX "_tenders_v_latest_idx" ON "_tenders_v" USING btree ("latest");
  CREATE UNIQUE INDEX "vacancies_slug_idx" ON "vacancies" USING btree ("slug");
  CREATE INDEX "vacancies_document_idx" ON "vacancies" USING btree ("document_id");
  CREATE INDEX "vacancies_seo_seo_image_idx" ON "vacancies" USING btree ("seo_image_id");
  CREATE INDEX "vacancies_updated_at_idx" ON "vacancies" USING btree ("updated_at");
  CREATE INDEX "vacancies_created_at_idx" ON "vacancies" USING btree ("created_at");
  CREATE INDEX "vacancies_deleted_at_idx" ON "vacancies" USING btree ("deleted_at");
  CREATE INDEX "vacancies__status_idx" ON "vacancies" USING btree ("_status");
  CREATE INDEX "_vacancies_v_parent_idx" ON "_vacancies_v" USING btree ("parent_id");
  CREATE INDEX "_vacancies_v_version_version_slug_idx" ON "_vacancies_v" USING btree ("version_slug");
  CREATE INDEX "_vacancies_v_version_version_document_idx" ON "_vacancies_v" USING btree ("version_document_id");
  CREATE INDEX "_vacancies_v_version_seo_version_seo_image_idx" ON "_vacancies_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_vacancies_v_version_version_updated_at_idx" ON "_vacancies_v" USING btree ("version_updated_at");
  CREATE INDEX "_vacancies_v_version_version_created_at_idx" ON "_vacancies_v" USING btree ("version_created_at");
  CREATE INDEX "_vacancies_v_version_version_deleted_at_idx" ON "_vacancies_v" USING btree ("version_deleted_at");
  CREATE INDEX "_vacancies_v_version_version__status_idx" ON "_vacancies_v" USING btree ("version__status");
  CREATE INDEX "_vacancies_v_created_at_idx" ON "_vacancies_v" USING btree ("created_at");
  CREATE INDEX "_vacancies_v_updated_at_idx" ON "_vacancies_v" USING btree ("updated_at");
  CREATE INDEX "_vacancies_v_latest_idx" ON "_vacancies_v" USING btree ("latest");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_seo_seo_image_idx" ON "events" USING btree ("seo_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events_deleted_at_idx" ON "events" USING btree ("deleted_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_seo_version_seo_image_idx" ON "_events_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version_deleted_at_idx" ON "_events_v" USING btree ("version_deleted_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "notices_updated_at_idx" ON "notices" USING btree ("updated_at");
  CREATE INDEX "notices_created_at_idx" ON "notices" USING btree ("created_at");
  CREATE INDEX "notices_deleted_at_idx" ON "notices" USING btree ("deleted_at");
  CREATE INDEX "notices__status_idx" ON "notices" USING btree ("_status");
  CREATE INDEX "_notices_v_parent_idx" ON "_notices_v" USING btree ("parent_id");
  CREATE INDEX "_notices_v_version_version_updated_at_idx" ON "_notices_v" USING btree ("version_updated_at");
  CREATE INDEX "_notices_v_version_version_created_at_idx" ON "_notices_v" USING btree ("version_created_at");
  CREATE INDEX "_notices_v_version_version_deleted_at_idx" ON "_notices_v" USING btree ("version_deleted_at");
  CREATE INDEX "_notices_v_version_version__status_idx" ON "_notices_v" USING btree ("version__status");
  CREATE INDEX "_notices_v_created_at_idx" ON "_notices_v" USING btree ("created_at");
  CREATE INDEX "_notices_v_updated_at_idx" ON "_notices_v" USING btree ("updated_at");
  CREATE INDEX "_notices_v_latest_idx" ON "_notices_v" USING btree ("latest");
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE INDEX "messages_deleted_at_idx" ON "messages" USING btree ("deleted_at");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_token_idx" ON "subscribers" USING btree ("token");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "page_views_day_idx" ON "page_views" USING btree ("day");
  CREATE INDEX "page_views_path_idx" ON "page_views" USING btree ("path");
  CREATE INDEX "page_views_updated_at_idx" ON "page_views" USING btree ("updated_at");
  CREATE INDEX "page_views_created_at_idx" ON "page_views" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE INDEX "media_deleted_at_idx" ON "media" USING btree ("deleted_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_share_sizes_share_filename_idx" ON "media" USING btree ("sizes_share_filename");
  CREATE UNIQUE INDEX "seo_pages_path_idx" ON "seo_pages" USING btree ("path");
  CREATE INDEX "seo_pages_seo_seo_image_idx" ON "seo_pages" USING btree ("seo_image_id");
  CREATE INDEX "seo_pages_updated_at_idx" ON "seo_pages" USING btree ("updated_at");
  CREATE INDEX "seo_pages_created_at_idx" ON "seo_pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");
  CREATE INDEX "audit_log_actor_idx" ON "audit_log" USING btree ("actor");
  CREATE INDEX "audit_log_resource_idx" ON "audit_log" USING btree ("resource");
  CREATE INDEX "audit_log_updated_at_idx" ON "audit_log" USING btree ("updated_at");
  CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_publications_id_idx" ON "payload_locked_documents_rels" USING btree ("publications_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_members_id_idx" ON "payload_locked_documents_rels" USING btree ("members_id");
  CREATE INDEX "payload_locked_documents_rels_key_figures_id_idx" ON "payload_locked_documents_rels" USING btree ("key_figures_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_tenders_id_idx" ON "payload_locked_documents_rels" USING btree ("tenders_id");
  CREATE INDEX "payload_locked_documents_rels_vacancies_id_idx" ON "payload_locked_documents_rels" USING btree ("vacancies_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_notices_id_idx" ON "payload_locked_documents_rels" USING btree ("notices_id");
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_page_views_id_idx" ON "payload_locked_documents_rels" USING btree ("page_views_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_seo_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("seo_pages_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_phones_order_idx" ON "site_settings_phones" USING btree ("_order");
  CREATE INDEX "site_settings_phones_parent_id_idx" ON "site_settings_phones" USING btree ("_parent_id");
  CREATE INDEX "site_settings_address_order_idx" ON "site_settings_address" USING btree ("_order");
  CREATE INDEX "site_settings_address_parent_id_idx" ON "site_settings_address" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_seo_default_seo_image_idx" ON "site_settings" USING btree ("default_seo_image_id");
  CREATE INDEX "navigation_main_children_order_idx" ON "navigation_main_children" USING btree ("_order");
  CREATE INDEX "navigation_main_children_parent_id_idx" ON "navigation_main_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_main_order_idx" ON "navigation_main" USING btree ("_order");
  CREATE INDEX "navigation_main_parent_id_idx" ON "navigation_main" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_links_order_idx" ON "navigation_footer_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_links_parent_id_idx" ON "navigation_footer_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_order_idx" ON "navigation_footer" USING btree ("_order");
  CREATE INDEX "navigation_footer_parent_id_idx" ON "navigation_footer" USING btree ("_parent_id");
  CREATE INDEX "brand_theme_logo_idx" ON "brand_theme" USING btree ("logo_id");
  CREATE INDEX "brand_theme_logo_white_idx" ON "brand_theme" USING btree ("logo_white_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_home_hero_partners" CASCADE;
  DROP TABLE "pages_blocks_home_hero_buttons" CASCADE;
  DROP TABLE "pages_blocks_home_hero_ledger" CASCADE;
  DROP TABLE "pages_blocks_home_hero" CASCADE;
  DROP TABLE "pages_blocks_page_hero" CASCADE;
  DROP TABLE "pages_blocks_band_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_band" CASCADE;
  DROP TABLE "pages_blocks_split_text_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_split_text_bullets" CASCADE;
  DROP TABLE "pages_blocks_split_text_buttons" CASCADE;
  DROP TABLE "pages_blocks_split_text" CASCADE;
  DROP TABLE "pages_blocks_vision_mission_items_bullets" CASCADE;
  DROP TABLE "pages_blocks_vision_mission_items" CASCADE;
  DROP TABLE "pages_blocks_vision_mission" CASCADE;
  DROP TABLE "pages_blocks_pcards_items" CASCADE;
  DROP TABLE "pages_blocks_pcards" CASCADE;
  DROP TABLE "pages_blocks_i_cards_items" CASCADE;
  DROP TABLE "pages_blocks_i_cards_buttons" CASCADE;
  DROP TABLE "pages_blocks_i_cards" CASCADE;
  DROP TABLE "pages_blocks_numbered_list_items" CASCADE;
  DROP TABLE "pages_blocks_numbered_list" CASCADE;
  DROP TABLE "pages_blocks_stat_grid_items" CASCADE;
  DROP TABLE "pages_blocks_stat_grid_buttons" CASCADE;
  DROP TABLE "pages_blocks_stat_grid" CASCADE;
  DROP TABLE "pages_blocks_org_chart_chain" CASCADE;
  DROP TABLE "pages_blocks_org_chart_branches_teams" CASCADE;
  DROP TABLE "pages_blocks_org_chart_branches" CASCADE;
  DROP TABLE "pages_blocks_org_chart" CASCADE;
  DROP TABLE "pages_blocks_board_seats" CASCADE;
  DROP TABLE "pages_blocks_board" CASCADE;
  DROP TABLE "pages_blocks_profiles" CASCADE;
  DROP TABLE "pages_blocks_crowd" CASCADE;
  DROP TABLE "pages_blocks_rules_rules" CASCADE;
  DROP TABLE "pages_blocks_rules" CASCADE;
  DROP TABLE "pages_blocks_compare_covered" CASCADE;
  DROP TABLE "pages_blocks_compare_main" CASCADE;
  DROP TABLE "pages_blocks_compare_all" CASCADE;
  DROP TABLE "pages_blocks_compare" CASCADE;
  DROP TABLE "pages_blocks_ticker" CASCADE;
  DROP TABLE "pages_blocks_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_steps" CASCADE;
  DROP TABLE "pages_blocks_calc_section_steps" CASCADE;
  DROP TABLE "pages_blocks_calc_section" CASCADE;
  DROP TABLE "pages_blocks_link_cards_items" CASCADE;
  DROP TABLE "pages_blocks_link_cards" CASCADE;
  DROP TABLE "pages_blocks_type_cards_items" CASCADE;
  DROP TABLE "pages_blocks_type_cards" CASCADE;
  DROP TABLE "pages_blocks_excl_panel_items" CASCADE;
  DROP TABLE "pages_blocks_excl_panel" CASCADE;
  DROP TABLE "pages_blocks_worked_items_rows" CASCADE;
  DROP TABLE "pages_blocks_worked_items" CASCADE;
  DROP TABLE "pages_blocks_worked" CASCADE;
  DROP TABLE "pages_blocks_faq_part_questions" CASCADE;
  DROP TABLE "pages_blocks_faq_part" CASCADE;
  DROP TABLE "pages_blocks_premium_cards_items" CASCADE;
  DROP TABLE "pages_blocks_premium_cards" CASCADE;
  DROP TABLE "pages_blocks_member_directory" CASCADE;
  DROP TABLE "pages_blocks_lede_split_buttons" CASCADE;
  DROP TABLE "pages_blocks_lede_split_rules" CASCADE;
  DROP TABLE "pages_blocks_lede_split_mini_stats" CASCADE;
  DROP TABLE "pages_blocks_lede_split_timeline" CASCADE;
  DROP TABLE "pages_blocks_lede_split" CASCADE;
  DROP TABLE "pages_blocks_faq_split" CASCADE;
  DROP TABLE "pages_blocks_section" CASCADE;
  DROP TABLE "pages_blocks_next_links_items" CASCADE;
  DROP TABLE "pages_blocks_next_links" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_cards_items" CASCADE;
  DROP TABLE "pages_blocks_cards" CASCADE;
  DROP TABLE "pages_blocks_figures" CASCADE;
  DROP TABLE "pages_blocks_faqs" CASCADE;
  DROP TABLE "pages_blocks_news" CASCADE;
  DROP TABLE "pages_blocks_publications" CASCADE;
  DROP TABLE "pages_blocks_people" CASCADE;
  DROP TABLE "pages_blocks_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_downloads_files" CASCADE;
  DROP TABLE "pages_blocks_downloads" CASCADE;
  DROP TABLE "pages_blocks_callout" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_table_columns" CASCADE;
  DROP TABLE "pages_blocks_table_rows_cells" CASCADE;
  DROP TABLE "pages_blocks_table_rows" CASCADE;
  DROP TABLE "pages_blocks_table" CASCADE;
  DROP TABLE "pages_blocks_custom" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero_partners" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero_ledger" CASCADE;
  DROP TABLE "_pages_v_blocks_home_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_page_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_band_paragraphs" CASCADE;
  DROP TABLE "_pages_v_blocks_band" CASCADE;
  DROP TABLE "_pages_v_blocks_split_text_paragraphs" CASCADE;
  DROP TABLE "_pages_v_blocks_split_text_bullets" CASCADE;
  DROP TABLE "_pages_v_blocks_split_text_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_split_text" CASCADE;
  DROP TABLE "_pages_v_blocks_vision_mission_items_bullets" CASCADE;
  DROP TABLE "_pages_v_blocks_vision_mission_items" CASCADE;
  DROP TABLE "_pages_v_blocks_vision_mission" CASCADE;
  DROP TABLE "_pages_v_blocks_pcards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_pcards" CASCADE;
  DROP TABLE "_pages_v_blocks_i_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_i_cards_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_i_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_numbered_list_items" CASCADE;
  DROP TABLE "_pages_v_blocks_numbered_list" CASCADE;
  DROP TABLE "_pages_v_blocks_stat_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stat_grid_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_stat_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_org_chart_chain" CASCADE;
  DROP TABLE "_pages_v_blocks_org_chart_branches_teams" CASCADE;
  DROP TABLE "_pages_v_blocks_org_chart_branches" CASCADE;
  DROP TABLE "_pages_v_blocks_org_chart" CASCADE;
  DROP TABLE "_pages_v_blocks_board_seats" CASCADE;
  DROP TABLE "_pages_v_blocks_board" CASCADE;
  DROP TABLE "_pages_v_blocks_profiles" CASCADE;
  DROP TABLE "_pages_v_blocks_crowd" CASCADE;
  DROP TABLE "_pages_v_blocks_rules_rules" CASCADE;
  DROP TABLE "_pages_v_blocks_rules" CASCADE;
  DROP TABLE "_pages_v_blocks_compare_covered" CASCADE;
  DROP TABLE "_pages_v_blocks_compare_main" CASCADE;
  DROP TABLE "_pages_v_blocks_compare_all" CASCADE;
  DROP TABLE "_pages_v_blocks_compare" CASCADE;
  DROP TABLE "_pages_v_blocks_ticker" CASCADE;
  DROP TABLE "_pages_v_blocks_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_calc_section_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_calc_section" CASCADE;
  DROP TABLE "_pages_v_blocks_link_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_link_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_type_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_type_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_excl_panel_items" CASCADE;
  DROP TABLE "_pages_v_blocks_excl_panel" CASCADE;
  DROP TABLE "_pages_v_blocks_worked_items_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_worked_items" CASCADE;
  DROP TABLE "_pages_v_blocks_worked" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_part_questions" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_part" CASCADE;
  DROP TABLE "_pages_v_blocks_premium_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_premium_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_member_directory" CASCADE;
  DROP TABLE "_pages_v_blocks_lede_split_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_lede_split_rules" CASCADE;
  DROP TABLE "_pages_v_blocks_lede_split_mini_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_lede_split_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_lede_split" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_split" CASCADE;
  DROP TABLE "_pages_v_blocks_section" CASCADE;
  DROP TABLE "_pages_v_blocks_next_links_items" CASCADE;
  DROP TABLE "_pages_v_blocks_next_links" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_figures" CASCADE;
  DROP TABLE "_pages_v_blocks_faqs" CASCADE;
  DROP TABLE "_pages_v_blocks_news" CASCADE;
  DROP TABLE "_pages_v_blocks_publications" CASCADE;
  DROP TABLE "_pages_v_blocks_people" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads_files" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads" CASCADE;
  DROP TABLE "_pages_v_blocks_callout" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_table_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_table_rows_cells" CASCADE;
  DROP TABLE "_pages_v_blocks_table_rows" CASCADE;
  DROP TABLE "_pages_v_blocks_table" CASCADE;
  DROP TABLE "_pages_v_blocks_custom" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "news_gallery" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v_version_gallery" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "publications_stats" CASCADE;
  DROP TABLE "publications" CASCADE;
  DROP TABLE "_publications_v_version_stats" CASCADE;
  DROP TABLE "_publications_v" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  DROP TABLE "members" CASCADE;
  DROP TABLE "_members_v" CASCADE;
  DROP TABLE "key_figures" CASCADE;
  DROP TABLE "_key_figures_v" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "_people_v" CASCADE;
  DROP TABLE "tenders_documents" CASCADE;
  DROP TABLE "tenders" CASCADE;
  DROP TABLE "_tenders_v_version_documents" CASCADE;
  DROP TABLE "_tenders_v" CASCADE;
  DROP TABLE "vacancies" CASCADE;
  DROP TABLE "_vacancies_v" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "notices" CASCADE;
  DROP TABLE "_notices_v" CASCADE;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "page_views" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "seo_pages" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "audit_log" CASCADE;
  DROP TABLE "totp_attempts" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_phones" CASCADE;
  DROP TABLE "site_settings_address" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_main_children" CASCADE;
  DROP TABLE "navigation_main" CASCADE;
  DROP TABLE "navigation_footer_links" CASCADE;
  DROP TABLE "navigation_footer" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "brand_theme" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_home_hero_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_home_hero_ledger_mode";
  DROP TYPE "public"."enum_pages_blocks_home_hero_section_background";
  DROP TYPE "public"."enum_pages_blocks_home_hero_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_page_hero_subnav";
  DROP TYPE "public"."enum_pages_blocks_page_hero_section_background";
  DROP TYPE "public"."enum_pages_blocks_page_hero_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_band_section_background";
  DROP TYPE "public"."enum_pages_blocks_band_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_split_text_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_i_cards_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_numbered_list_variant";
  DROP TYPE "public"."enum_pages_blocks_stat_grid_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_stat_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_board_group";
  DROP TYPE "public"."enum_pages_blocks_profiles_group";
  DROP TYPE "public"."enum_pages_blocks_link_cards_items_icon";
  DROP TYPE "public"."enum_pages_blocks_faq_part_category";
  DROP TYPE "public"."enum_pages_blocks_lede_split_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_lede_split_callout_side";
  DROP TYPE "public"."enum_pages_blocks_lede_split_callout_icon";
  DROP TYPE "public"."enum_pages_blocks_lede_split_right";
  DROP TYPE "public"."enum_pages_blocks_section_section_background";
  DROP TYPE "public"."enum_pages_blocks_section_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_next_links_section_background";
  DROP TYPE "public"."enum_pages_blocks_next_links_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_hero_section_background";
  DROP TYPE "public"."enum_pages_blocks_hero_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_rich_text_section_background";
  DROP TYPE "public"."enum_pages_blocks_rich_text_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_cards_columns";
  DROP TYPE "public"."enum_pages_blocks_cards_section_background";
  DROP TYPE "public"."enum_pages_blocks_cards_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_figures_section_background";
  DROP TYPE "public"."enum_pages_blocks_figures_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_faqs_category";
  DROP TYPE "public"."enum_pages_blocks_faqs_section_background";
  DROP TYPE "public"."enum_pages_blocks_faqs_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_news_section_background";
  DROP TYPE "public"."enum_pages_blocks_news_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_publications_section_background";
  DROP TYPE "public"."enum_pages_blocks_publications_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_people_group";
  DROP TYPE "public"."enum_pages_blocks_people_section_background";
  DROP TYPE "public"."enum_pages_blocks_people_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_gallery_section_background";
  DROP TYPE "public"."enum_pages_blocks_gallery_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_video_section_background";
  DROP TYPE "public"."enum_pages_blocks_video_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_downloads_section_background";
  DROP TYPE "public"."enum_pages_blocks_downloads_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_callout_tone";
  DROP TYPE "public"."enum_pages_blocks_callout_section_background";
  DROP TYPE "public"."enum_pages_blocks_callout_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_cta_section_background";
  DROP TYPE "public"."enum_pages_blocks_cta_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_table_section_background";
  DROP TYPE "public"."enum_pages_blocks_table_section_spacing";
  DROP TYPE "public"."enum_pages_blocks_custom_section_background";
  DROP TYPE "public"."enum_pages_blocks_custom_section_spacing";
  DROP TYPE "public"."enum_pages_review_status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_home_hero_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_home_hero_ledger_mode";
  DROP TYPE "public"."enum__pages_v_blocks_home_hero_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_home_hero_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_subnav";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_page_hero_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_band_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_band_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_split_text_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_i_cards_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_numbered_list_variant";
  DROP TYPE "public"."enum__pages_v_blocks_stat_grid_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_stat_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_board_group";
  DROP TYPE "public"."enum__pages_v_blocks_profiles_group";
  DROP TYPE "public"."enum__pages_v_blocks_link_cards_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_faq_part_category";
  DROP TYPE "public"."enum__pages_v_blocks_lede_split_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_lede_split_callout_side";
  DROP TYPE "public"."enum__pages_v_blocks_lede_split_callout_icon";
  DROP TYPE "public"."enum__pages_v_blocks_lede_split_right";
  DROP TYPE "public"."enum__pages_v_blocks_section_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_section_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_next_links_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_next_links_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_hero_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_hero_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_cards_columns";
  DROP TYPE "public"."enum__pages_v_blocks_cards_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_cards_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_figures_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_figures_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_faqs_category";
  DROP TYPE "public"."enum__pages_v_blocks_faqs_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_faqs_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_news_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_news_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_publications_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_publications_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_people_group";
  DROP TYPE "public"."enum__pages_v_blocks_people_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_people_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_video_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_video_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_downloads_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_downloads_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_callout_tone";
  DROP TYPE "public"."enum__pages_v_blocks_callout_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_callout_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_cta_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_cta_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_table_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_table_section_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_custom_section_background";
  DROP TYPE "public"."enum__pages_v_blocks_custom_section_spacing";
  DROP TYPE "public"."enum__pages_v_version_review_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_news_kind";
  DROP TYPE "public"."enum_news_review_status";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_kind";
  DROP TYPE "public"."enum__news_v_version_review_status";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_publications_kind";
  DROP TYPE "public"."enum_publications_review_status";
  DROP TYPE "public"."enum_publications_status";
  DROP TYPE "public"."enum__publications_v_version_kind";
  DROP TYPE "public"."enum__publications_v_version_review_status";
  DROP TYPE "public"."enum__publications_v_version_status";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_faqs_review_status";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum__faqs_v_version_category";
  DROP TYPE "public"."enum__faqs_v_version_review_status";
  DROP TYPE "public"."enum__faqs_v_version_status";
  DROP TYPE "public"."enum_members_type";
  DROP TYPE "public"."enum_members_review_status";
  DROP TYPE "public"."enum_members_status";
  DROP TYPE "public"."enum__members_v_version_type";
  DROP TYPE "public"."enum__members_v_version_review_status";
  DROP TYPE "public"."enum__members_v_version_status";
  DROP TYPE "public"."enum_key_figures_review_status";
  DROP TYPE "public"."enum_key_figures_status";
  DROP TYPE "public"."enum__key_figures_v_version_review_status";
  DROP TYPE "public"."enum__key_figures_v_version_status";
  DROP TYPE "public"."enum_people_group";
  DROP TYPE "public"."enum_people_review_status";
  DROP TYPE "public"."enum_people_status";
  DROP TYPE "public"."enum__people_v_version_group";
  DROP TYPE "public"."enum__people_v_version_review_status";
  DROP TYPE "public"."enum__people_v_version_status";
  DROP TYPE "public"."enum_tenders_category";
  DROP TYPE "public"."enum_tenders_review_status";
  DROP TYPE "public"."enum_tenders_status";
  DROP TYPE "public"."enum__tenders_v_version_category";
  DROP TYPE "public"."enum__tenders_v_version_review_status";
  DROP TYPE "public"."enum__tenders_v_version_status";
  DROP TYPE "public"."enum_vacancies_employment_type";
  DROP TYPE "public"."enum_vacancies_review_status";
  DROP TYPE "public"."enum_vacancies_status";
  DROP TYPE "public"."enum__vacancies_v_version_employment_type";
  DROP TYPE "public"."enum__vacancies_v_version_review_status";
  DROP TYPE "public"."enum__vacancies_v_version_status";
  DROP TYPE "public"."enum_events_review_status";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_review_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_notices_severity";
  DROP TYPE "public"."enum_notices_review_status";
  DROP TYPE "public"."enum_notices_status";
  DROP TYPE "public"."enum__notices_v_version_severity";
  DROP TYPE "public"."enum__notices_v_version_review_status";
  DROP TYPE "public"."enum__notices_v_version_status";
  DROP TYPE "public"."enum_messages_status";
  DROP TYPE "public"."enum_subscribers_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_audit_log_action";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_brand_theme_heading_font";
  DROP TYPE "public"."enum_brand_theme_body_font";`)
}
