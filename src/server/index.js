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


var token = {
    "id": "5a40682d5c60515ac827fbaf",
    "firstName": "Kevin",
    "lastName": "Keyt",
    "email": "kevinkeyt@gmail.com",
    "expiresOn": "2017-12-29T03:26:00.769Z",
    "token": "169fa42767051555f83a61953037d725d70a4dc4b5661d3a905a6e84d6294196557e0875c4226b4d1bf0be48b2643b16d223c6f49e1aeb662808a39d6130dcba"
};
console.log(JSON.stringify(token));