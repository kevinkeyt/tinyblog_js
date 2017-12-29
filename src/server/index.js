const express = require('express');
const path = require('path');
const cryptoService = require('./services/crypto.service');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const userRoutes = require('./routes/user.routes');


const root = './';
const port = process.env.PORT || '3000';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));
//app.use(express.static(path.join(root, 'dist')));
app.use('/api/comments', commentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
// app.get('*', (req, res) => {
//     res.sendFile('dist/index.html', {root: root});
// });

app.listen(port, () => console.log(`API running on localhost:${port}`));


// var token = {
//     "id": "5a40682d5c60515ac827fbaf",
//     "firstName": "Kevin",
//     "lastName": "Keyt",
//     "email": "kevinkeyt@gmail.com",
//     "expiresOn": "2017-12-29T14:32:59.472Z",
//     "token": "8552e5c59f4e9bbe4ae58c010dc7c5e45fa7f16b4460ed099dc82483b398c1068533a9039248ea5d177c083bdc29cdcfa326d81c389460125814c4ad4c80f1e3"
// };
// console.log(JSON.stringify(token));