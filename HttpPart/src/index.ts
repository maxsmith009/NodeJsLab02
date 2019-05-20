const http = require('http');
const routing = require('./routes/routing');

const requestHandler = (req: { on: (arg0: string, arg1: (data: string) => void) => { on: (arg0: string, arg1: () => void) => void; }; }, res: { setHeader: (arg0: string, arg1: string) => void; }) => {

    let jsonData = {};

    res.setHeader('Content-Type', 'application/json');
    req
        .on('data', data => {
            jsonData = JSON.parse(data);
        })
        .on('end', () => {
            routing.dispatch(req, res, jsonData);
        });

};

const server = http.createServer(requestHandler);

server.listen(3000, (err: Error) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log('server started at 3000')
});
