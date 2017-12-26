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
