# simple-upload web component for RemixLabs

## Register

```
TAG:
simple-upload

MODTYPE:
url

DATA:
https://gerdstolpmann.github.io/simpleupload/index.js

INS:
[ { "name": "url", "type": "url" },
  { "name": "token", "type": "string" },
  { "name": "multiple", "type": "bool" },
  { "name": "accept", "type": "string" },
  { "name": "invoke", "type": "event" }
]

EVENTS:
[ { "name": "uploadStarted", "payload": [ {} ] },
  { "name": "uploadOK", "payload": "data" },
  { "name": "uploadError", "payload": {} }
]

CHILDREN: no children

```
