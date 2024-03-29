# afrostream-api-stats
nodejs api for the stats

# Install

```
npm install
npm test
```

# API

## POST /api/v1/events

### evenement bandwidthIncrease

```
{
  "user_id" : number (integer positive),
  "type" : 'bandwidthIncrease',
  "fqdn" : string (max 255),
  "video_bitrate" : number (integer),
  "audio_bitrate" : number (integer)
}
```

### evenement bandwidthDecrease

```
{
  "user_id" : number (integer positive),
  "type" : 'bandwidthDecrease',
  "fqdn" : string (max 255),
  "video_bitrate" : number (integer),
  "audio_bitrate" : number (integer)
}
```

### evenement buffering

```
{
  "user_id" : number (integer positive),
  "type" : 'buffering',
  "fqdn" : string (max 255)
}
```

### evenement error

```
{
  "user_id" : number (integer positive),
  "type" : 'error',
  "fqdn" : string (max 255),
  "number": number (small integer),
  "message": string (max 255)
}
```

### evenement start

```
{
  "user_id" : number (integer positive),
  "type" : 'start',
  "fqdn" : string (max 255),
  "os": string (max 255),
  "os_version": string (max 64),
  "web_browser": string (max 255),
  "web_browser_version": string (max 64),
  "resolution_size": string (max 32),
  "flash_version": string (max 32),
  "html5_video": boolean,
  "relative_url": string (max 255),
}
```

### evenement stop

```
{
  "user_id" : number (integer positive),
  "type" : 'stop',
  "fqdn" : string (max 255),
  "timeout": boolean,
  "frames_dropped": number (integer)
}
```

### event ping

```
{
  "user_id" : number (integer positive),
  "type" : 'ping',
  "fqdn" : string (max 255)
}
```

## POST /api/v1/send

bulk send (non rest)

```
{
  "events": [
    @see event list
  ]
}
```

example

```
{
  "events": [
    {
      "user_id" : number (integer positive),
      "type" : 'start',
      "fqdn" : string (max 255),
      "os": string (max 255),
      "os_version": string (max 64),
      "web_browser": string (max 255),
      "web_browser_version": string (max 64),
      "resolution_size": string (max 32),
      "flash_version": string (max 32),
      "html5_video": boolean,
      "relative_url": string (max 255),
    },
    {
      "user_id" : number (integer positive),
      "type" : 'bandwidthIncrease',
      "fqdn" : string (max 255),
      "video_bitrate" : number (integer),
      "audio_bitrate" : number (integer)
    },
    {
      "user_id" : number (integer positive),
      "type" : 'buffering',
      "fqdn" : string (max 255)
    }
  ]
}
```

# Testing

Warning: current integration tests are using the local development database.

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
curl -v --data '{"type":"ping","user_id":4242,"fqdn":"foo.com"}' -H "Content-Type: application/json" http://localhost:3003/api/v1/events/
curl -v --data '{"type":"bandwidthIncrease","user_id":4242,"fqdn":"foo.com","relative_url":"/foo/bar","video_bitrate":4242,"audio_bitrate":4243}' -H "Content-Type: application/json" http://localhost:3003/api/v1/events/
curl -v --data '{"type":"start","user_id":4242,"fqdn":"foo.com","relative_url":"/foo/bar","video_bitrate":4242,"audio_bitrate":4243,"os":"ubunion":"14.04","web_browser":"curl","web_browser_version":"1","resolution_size":"640x480","flash_version":"7","html5_video":true}' -H "Content-Type: application/json" http://localhost:3003/api/v1/events/
```
