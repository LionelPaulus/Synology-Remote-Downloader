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

        // If you need to validate the download link, you can use a regex like this:
        //var linkValidation = /^(http|https)?:\/\/uptobox.com\/[a-zA-Z0-9]{12}/.test(link.value);

        if ((movie.checked) || (tvshow.checked)) {
            loading(startDonwnloadCard, true);

            if (movie.checked) {
                var destination = 'movie';
            } else {
                var destination = 'tv show';
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
                    var snackbar = {message: 'The download task has been added!'};
                    snackbarContainer.MaterialSnackbar.showSnackbar(snackbar);
                } else {
                    loading(startDonwnloadCard, false);
                    var snackbar = {message: 'Sorry, it didn\'t work :( Please try again or contact my master.'};
                    snackbarContainer.MaterialSnackbar.showSnackbar(snackbar);
                }
            };
            xhr.send(JSON.stringify(data));
        }
    });

    function listCurrentDownloads(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'api/listCurrentDownloads', true);
        xhr.timeout = 7000;
        xhr.onload = function () {
            // Catch error
            try {
                var currentDownloads = JSON.parse(this.responseText);
            } catch (e) {
                NASProblem();
                return;
            }

            // Add and update downloads
            for (var i = 0; i < currentDownloads.length; i++) {
                var downloadCard = document.querySelector('#' + currentDownloads[i].id);
                if (downloadCard) {
                    downloadCard.querySelector('.progressbar').style.width = currentDownloads[i].percentage + '%';
                    var downloadCardTitle = downloadCard.querySelector('p');
                    if (downloadCardTitle.innerText != currentDownloads[i].title) {
                        downloadCardTitle.innerText = currentDownloads[i].title;
                    }
                } else {
                    downloadsContainer.innerHTML += '<div id="' + currentDownloads[i].id + '" class="download downloadCard mdl-card mdl-shadow--2dp"><div class="mdl-progress mdl-js-progress"></div><div class="mdl-card__title"><p>' + currentDownloads[i].title +'</p></div></div>';
                    window.componentHandler.upgradeDom();
                    document.querySelector('#' + currentDownloads[i].id + ' .progressbar').style.width = currentDownloads[i].percentage + '%';
                }
            }

            // Remove finished downloads
            var currentDownloadsCards = downloadsContainer.querySelectorAll('.downloadCard');
            for (var i = 0; i < currentDownloadsCards.length; i++) {
                var stillDownloading = false;
                for (var j = 0; j < currentDownloads.length; j++) {
                    if (currentDownloadsCards[i].id == currentDownloads[j].id) {
                        stillDownloading = true;
                    }
                }
                if (!stillDownloading) {
                    currentDownloadsCards[i].remove();
                }
            }

            // Make another AJAX call after 5 seconds
            setTimeout(function(){
                listCurrentDownloads();
            }, 5000);
        };
        xhr.ontimeout = function(e) {
            NASProblem();
            console.log('Error: ' + e);
        };
        xhr.send();
    }

    function NASProblem() {
        var dialog = document.querySelector('#nas-problem');
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();
    }
}
