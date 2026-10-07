'use strict' ;
const http = require('node:http');
//const fs = require('node:fs');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(
      `[${now}] Requested by ${req.socket.remoteAddress}`
    );
    res.writeHead(200, {
      'Content-type': 'text/html; charset=utf-8'
    });
    //res.write(req.headers['user-agent']);
    switch (req.method) {
      case 'GET' :
        //res.write(`GET ${req.url}\n`);
        //const rs = fs.createReadStream('./form.html');
        //rs.pipe(res);
        if (req.url === '/'){
           res.write(pug.renderFile('./top.pug'));
            //'<!DOCTYPE html><html lang="ja"><body>' +
            //'<h1>アンケートフォーム</h1>' +
            //'<a href="/enquetes">アンケート一覧</a>' +
            //'</body></html>'
          
        } else if (req.url === '/enquetes'){
            res.write('<!DOCTYPE html><html lang="ja"><body>' +
            '<h1>アンケート一覧</h1>' +
            '<li><a href="/enquetes/yaki-tofu">焼肉・湯豆腐</a></li>' +
            '<li><a href="/enquetes/rice-bread">ごはん・ぱん</a></li>' +
            '</body></html>'
            );
        } else if(req.url === '/enquetes/yaki-tofu'){
          res.write(
          pug.renderFile('./form.pug',{
            path: req.url,
            firstItem: '焼肉',
            secondItem: '湯豆腐'
            })
            );
          } else if (req.url === '/enquetes/rice-bread') {
            res.write(
              pug.renderFile('./form.pug',
                { path: req.url,
                  firstItem: 'ごはん',
                  secondItem: 'パン'
                }
              )
            );
          }
        res.end(); //通信しっぱなしを防ぐため
        break;
      case 'POST' :
        //res.write(`POST ${req.url}\n`);
        let rawData = '';
        req
          .on('data', chunk => {
            rawData += chunk;
          })
          .on('end', () => {
            //console.info(`[${now}] Data posted: ${rawData}`);
            //const decoded = decodeURIComponent(rawData);
            const answer = new URLSearchParams(rawData);
            const body = `${answer.get('name')}san voted for ${answer.get('favorite')}`;
            console.info(`[${now}]  ${body}`);
            res.write(
            `<!DOCTYPE html>
              <html lang="ja">
                <body>
                  <h1>${body}is posted</h1>
                </body>
              </html>`
            );
            res.end();
          });
          
          
          break;
        case 'DELETE' :
          break;
        default:
          break;
    }
    //dores.end();
  })
  .on('error', e =>{
    console.error(`[${new Date()}] Server Error `, e)
  })
  .on('clientError', e => {
    console.error(`[${new Date()}] Client Error`, e)  
  });
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});