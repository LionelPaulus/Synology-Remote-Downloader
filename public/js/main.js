var startDonwnloadCard = document.querySelector('.download');
var startDownloadButton = document.querySelector('#startDownloadButton');
var startDownloadForm = document.querySelector('#startDownloadForm');
var snackbarContainer = document.querySelector('#snackbarContainer');
var downloadsContainer = document.querySelector('.downloadsContainer');

function loading(card, boolean) {
    if (boolean) {
        card.querySelector('.loading').style.opacity = '1';
        card.querySelector('.mdl-card__supporting-text').style.opacity = '0.5';
    } else {
        card.querySelector('.loading').style.opacity = '0';
        card.querySelector('.mdl-card__supporting-text').style.opacity = '1';
    }
}

if (startDownloadButton) {
    listCurrentDownloads();

    startDownloadButton.addEventListener('click', function(){
        var link = startDownloadForm.querySelector('#link');
        var movie = startDownloadForm.querySelector('.movie');
        var tvshow = startDownloadForm.querySelector('.tvshow');

        var linkValidation = /^(http|https)?:\/\/uptobox.com\/[a-zA-Z0-9]{12}/.test(link.value);
        if ((linkValidation) && (movie.checked) || (tvshow.checked)) {
            loading(startDonwnloadCard, true);

            if (movie.checked) {
                var destination = 'SynologyPaulus/Films';
            } else {
                var destination = 'SynologyPaulus/Séries TV';
            }

            var data = {
                link: link.value,
                destination: destination
            };

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'api/startDownload', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (this.responseText == '1') {
                    loading(startDonwnloadCard, false);
                    link.value = "";
                    var data = {message: 'The download task has been added!'};
                    snackbarContainer.MaterialSnackbar.showSnackbar(data);
                } else {
                    loading(startDonwnloadCard, false);
                    var data = {message: 'Sorry, it didn\'t work :( Please try again or contact my master, Lionel.'};
                    snackbarContainer.MaterialSnackbar.showSnackbar(data);
                }
            };
            xhr.send(JSON.stringify(data));
        }
    });

    function listCurrentDownloads(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'api/listCurrentDownloads', true);
        xhr.onload = function () {
            var currentDownloads = JSON.parse(this.responseText);
            for (var i = 0; i < currentDownloads.length; i++) {
                var downloadCard = document.querySelector('#' + currentDownloads[i].id);
                if (downloadCard) {
                    downloadCard.querySelector('.mdl-progress').MaterialProgress.setProgress(currentDownloads[i].percentage);
                    let downloadCardTitle = downloadCard.querySelector('p').innerHTML;
                    if (downloadCardTitle != currentDownloads[i].title) {
                        downloadCardTitle = currentDownloads[i].title;
                    }
                } else {
                    downloadsContainer.innerHTML += '<div id="' + currentDownloads[i].id + '" class="download downloadCard mdl-card mdl-shadow--2dp"><div class="mdl-progress mdl-js-progress"></div><div class="mdl-card__title"><p>' + currentDownloads[i].title +'</p></div></div>';
                    window.componentHandler.upgradeDom();
                    document.querySelector('#' + currentDownloads[i].id + ' .mdl-progress').MaterialProgress.setProgress(currentDownloads[i].percentage);
                }
            }
        };
        xhr.send();
    }

    window.setInterval(listCurrentDownloads, 5000);
}
