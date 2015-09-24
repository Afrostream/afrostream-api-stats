-- db structure
CREATE DATABASE cdnselector;

-- custom types
CREATE TYPE event_types AS ENUM
   ('bandwidthIncrease',
    'bandwidthDecrease',
    'error',
    'buffering',
    'start',
    'stop');
-- ALTER TYPE event_types OWNER TO postgres;
CREATE TYPE uri_scheme AS ENUM
   ('http',
    'https');
-- ALTER TYPE uri_scheme OWNER TO postgres;

-- table
CREATE TABLE event
(
  user_id integer NOT NULL,
  ip cidr NOT NULL,
  protocol uri_scheme NOT NULL DEFAULT 'https'::uri_scheme,
  fqdn character varying(255) NOT NULL,
  relative_url character varying(255) NOT NULL,
  type event_types NOT NULL,
  id bigserial NOT NULL,
  country character(2) NOT NULL,
  asn smallint NOT NULL,
  date timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
-- ALTER TABLE event OWNER TO postgres;
CREATE TABLE event_bandwidth
(
  event_id bigint NOT NULL,
  video_bitrate integer NOT NULL,
  audio_bitrate integer NOT NULL
)
WITH (
  OIDS=FALSE
);
-- ALTER TABLE event_bandwidth OWNER TO postgres;
CREATE TABLE event_error
(
  event_id bigint NOT NULL,
  number smallint NOT NULL,
  message character varying(2048) NOT NULL
)
WITH (
  OIDS=FALSE
);
-- ALTER TABLE event_error OWNER TO postgres;

CREATE TABLE event_start
(
  event_id bigint NOT NULL,
  os character varying(256) NOT NULL DEFAULT ''::character varying,
  os_version character varying(64) NOT NULL DEFAULT ''::character varying,
  web_browser character varying(256) NOT NULL DEFAULT ''::character varying,
  web_browser_version character varying(64) NOT NULL DEFAULT ''::character varying,
  user_agent character varying(128) NOT NULL DEFAULT ''::character varying,
  resolution_size character varying(32) NOT NULL DEFAULT ''::character varying,
  flash_version character varying(32) NOT NULL DEFAULT ''::character varying,
  html5_video boolean NOT NULL DEFAULT false
)
WITH (
  OIDS=FALSE
);
-- ALTER TABLE event_start OWNER TO postgres;
CREATE TABLE event_stop
(
  event_id bigint NOT NULL,
  timeout boolean NOT NULL DEFAULT false,
  frames_dropped integer NOT NULL DEFAULT 0
)
WITH (
  OIDS=FALSE
);
-- ALTER TABLE event_stop OWNER TO postgres;