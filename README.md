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

## Description

The web component places an invisible upload element onto the
page. "Invisible" means that it is rendered with `display:none`
and can be put anywhere on the page. Note that, although it is
invisible, it has to be put onto the page in order to be functional.

The component remains inactive until invoked. You invoke it by
triggering the `invoke` binding. This causes that the file upload
dialog appears, and you can select files.

Once you press "OK", the uploaded file(s) are sent to the specified
`url` as regular form data upload (like a normal `input type=file` HTML
element would do it). If the `token` parameter is specified it is put
into the `Authorization` header as bearer token.

With `multiple` you can choose whether you want to allow that several
files can be selected.

The `accept` parameter lists the MIME types of the files that can be
selected in the dialog.

There are three outgoing events: When the upload starts,
the `uploadStarted` event is triggered. The payload is a list
of objects
```
{ key: <string>,
  name: <string>,
  size: <number>,
  fileType: <string>
}
```

When the upload finishes successfully, the `uploadOK` event is triggered.
The payload comes from the file server. If it is data that can be parsed
as JSON, the payload is returned as such. Otherwise, if the data is
simple text, the payload is a single object `{ "body": <text> }`.

When the upload runs into an error, the `uploadError` event is triggered.
The payload is an object `{ "status": <number>, "text": <string> }`.
The `status` is the HTTP status code, or 999 if not applicable.
The `text` is the corresponding textual description, or the error
message.


## Using simple-upload with the AMP proxy

The AMP proxy function allows it to send requests to AMP which then
redirects to the real file server. That way credentials can be hidden.

In order to activate the proxy, add this record to the db:

```
{ _rmx_type: "proxy",
  remote: "myFunnyProxyID",
  url: "https://myfileserver.com/",
  basicAuth: { username: "...", password: "..." },
  proxyType: "uploadViaPUT"
}
```

Notes:
 - The URL of the file server *must* be a secure one (https).
 - A `proxyType` of `uplaodViaPUT` means that the file is sent to the
   file server with a `PUT` request.
 - The `proxyType` can also be set to `uploadViaPUTEnableGET` and in this case
   the proxy also responds to GET requests for the already uploaded files.
 - The URL of the PUT requests is calculated by taking the URL of the
   file server, and by appending further path components. First,
   any path from the proxy request is added. Then, the file name of the
   uploaded file is added.

After that, configure the simple-upload component like this:

 - `url`: set this to `env.backendBaseURL + "/" + env.app + "/proxy/myFunnyProxyID/"`
 - `token`: set this to a valid AMP token, e.g. `env.token() |> string.ofToken`

As a variation, you can also append a random string to the `url`, e.g.
```
let r = random.cryptoRandomString(random.hexDigits, 16);
let url = env.backendBaseURL + "/" + env.app + "/proxy/myFunnyProxyID/" + r + "-"
```
This way, each upload uses different names on the file server.

When you get the `uploadOK` event, the payload will be a list of objects
```
{ filename: <string>,
  contentType: <string>,
  part: <number>,
  path: <string>,
  url: <string>
}
```
