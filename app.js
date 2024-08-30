import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import { getVideoInfo, downloadVideo } from './src/controllers/YouTubeController.js';

const app = express();

app.use(express.static("public"));
app.use('/bootstrap', express.static(path.join('node_modules', 'bootstrap', 'dist')));
app.use('/icons', express.static(path.join('node_modules/bootstrap-icons/font')));

app.set("view engine", "ejs");
app.set("views", path.join("src", "views"));

app.use(expressLayouts);
app.set("layout", "index");

app.get('/', (req, res) => {
    res.render('index', { title: 'Home', video: null, error: null });
});


app.get('/video-info', getVideoInfo);
app.get('/download', downloadVideo);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
