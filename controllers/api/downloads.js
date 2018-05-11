const Syno = require('syno');
const syno = new Syno({
    protocol: process.env.SYNO_PROTOCOL,
    host: process.env.SYNO_HOST,
    port: process.env.SYNO_PORT,
    account: process.env.SYNO_ACCOUNT,
    passwd: process.env.SYNO_PASSWORD
});

/**
 * POST /api/startDownload
 */
exports.start = (req, res) => {
    req.assert('link', 'Link cannot be blank').notEmpty();
    req.assert('destination', 'Destination cannot be blank').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.send(errors);
    }

    if (req.body.destination === 'movie') {
        var destination = process.env.MOVIES_FOLDER;
    } else {
        var destination = process.env.TV_SHOWS_FOLDER;
    }

    syno.dl.createTask({'uri': req.body.link, 'destination': destination}, function(createError, createResponse) {
        if (createError) {
            res.send('Error: ' + createError);
            return;
        }
        res.send('1');
    });
};

/**
 * GET /api/listCurrentDownloads
 */
exports.list = (req, res) => {
    let currentDownloads = [];
    syno.dl.listTasks({additional: "detail,transfer"}, function(listError, listResponse) {
        if (listError) {
            res.send('Error: ' + listError);
            return;
        }

        for (let i = 0; i < listResponse.tasks.length; i++) {
            if ((listResponse.tasks[i].additional.detail.completed_time == 0) && ((listResponse.tasks[i].status == 'downloading') || (listResponse.tasks[i].status == 'waiting'))) {
                let percentage = 100 * listResponse.tasks[i].additional.transfer.size_downloaded / listResponse.tasks[i].size;
                if (isNaN(percentage)) {
                    percentage = 0;
                }
                listResponse.tasks[i].percentage = percentage;
                currentDownloads.push(listResponse.tasks[i]);
            }
        }
        res.send(currentDownloads);
    });
}
