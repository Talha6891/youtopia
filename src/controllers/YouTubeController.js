import  ytdl  from "@distube/ytdl-core"; 


export const getVideoInfo = async (req, res) => {
    const videoURL = req.query.url;
    try {
        if (ytdl.validateURL(videoURL)) {
            const info = await ytdl.getInfo(videoURL);
            const formats = ytdl.filterFormats(info.formats, 'audioandvideo');
            const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

            res.render('index', {
                title: 'Home',
                video: {
                    url: videoURL,
                    title: info.videoDetails.title,
                    thumbnail: info.videoDetails.thumbnails[0].url,
                    formats,
                    audioFormats,
                },
                error: null,
            });
        } else {
            res.render('index', { title: 'Home', video: null, error: 'Invalid URL' });
        }
    } catch (error) {
        console.error(error);
        res.render('index', { title: 'Home', video: null, error: 'Failed to retrieve video information' });
    }
};


export const downloadVideo = async (req, res) => {
    const { url, format, audioFormat } = req.query;
    const itag = format || audioFormat;

    try {
        if (!ytdl.validateURL(url)) {
            return res.status(400).send('Invalid URL');
        }

        const info = await ytdl.getInfo(url);

        // Find the format based on itag
        const formatInfo = info.formats.find(f => f.itag === parseInt(itag));

        if (!formatInfo) {
            return res.status(400).send('Invalid format selected');
        }

        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.${formatInfo.container}"`);
        ytdl(url, { format: formatInfo }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to download video');
    }
};

