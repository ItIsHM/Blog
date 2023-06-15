const express = require('express');
const fs = require('fs');
const marked = require('marked');
const path = require('path');

const app = express();
const port = 3000;
const postsDirectory = path.join(process.cwd(), 'posts');

app.use(express.static('public'));

app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.set('views', './views'); // Set the views directory

app.get('/', (req, res) => {
  fs.readdir('posts', (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const posts = files.filter(file => file.endsWith('.mdx'));
      res.render('index', { posts }); // Render the 'index.ejs' view and pass the posts data
    }
  });
});

app.get('/posts/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = 'posts/' + filename;
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      console.error(err);
      res.status(404).send('Post not found.');
    } else {
      const adScripts = [
        '<script>/* Ad script 1 */</script>',
        '<script>/* Ad script 2 */</script>',
        '<script>/* Ad script 3 */</script>'
      ];
      const html = marked(content);
      const finalHtml = html.replace('<!-- AD_SCRIPTS -->', adScripts.join(''));
      res.send(finalHtml);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
