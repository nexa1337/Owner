const https = require('https');

https.get("https://script.google.com/macros/s/AKfycbxbQKmoUUH4KzLmkAYZMGpoORPDTFYTzqCpnScEFIw5ngQ1cgzvFWU5fq0OXe2M5Ref/exec", (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(Object.keys(JSON.parse(data)));
  });
});
