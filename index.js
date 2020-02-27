const Server = require('./server');
const db = require('./persistence/db');

const port = 1234

db.connect(db.url, (err) => {
    if (err) {
        console.error(err)
    } else {
        const server = new Server(db.get().db("pryv"));
        server.app.listen(port, () => console.log(`App started on port ${port}`))
    }
})