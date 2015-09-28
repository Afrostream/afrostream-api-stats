# afrostream-api-stats
nodejs api for the stats

# Install

```
npm install
npm test
```

# API

## /api/v1/events

REST

```

```

## /api/v1/send

NON REST (bulk send)




# Testing

## all

```
npm test
```

## single test

```
node_modules/.bin/mocha test/integration/api/alive.js
```

## CURL

```
curl -v --data '{"type":"bandwidthIncrease","user_id":4242,"fqdn":"foo.com","relative_url":"/foo/bar","video_bitrate":4242,"audio_bitrate":4243}' -H "Content-Type: application/json" http://localhost:3003/api/v1/events/
```
