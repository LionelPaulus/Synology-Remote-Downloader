# Synology Remote Downloader
Remotely start download tasks from the web to your Synology NAS.   
Give access to your family or friends while keeping control (which download destinations, which URL's,...).  
🔒 Secured by Google Sign in authentification.  

![App screenshot](https://monosnap.com/file/M7D2OkFuizXuf0sD2nkQDcaVIBjYq7.png)
## Use case
* **Collaborative media library:** let family or friends adding Movies or TV Shows to your Synology easily with this web app. If you use direct download hosts like Uptobox or Mega, thanks to Synology Download Station Hosts you can let your NAS debrid the download link using your Premium account (for 1fichier.com, Uptobox and Uplea you need to install a custom Download Station host that you can [find here](https://github.com/warkx/Synology-DownloadStation-Hosts)). Then use a Media Server like [PLEX](https://www.plex.tv) or [Kodi](https://kodi.tv) to make it available for all and on any device.
* Another use case? Tell me!

## Getting Started
### Initialize the project
1. Clone the repo
1. Install NPM dependencies `npm install`
1. Rename the `.env.example` file to `.env` and fill it

### Get your Google Sign in credentials
1. [Create a new Google APIs project](https://console.developers.google.com/projectcreate)
1. Enable the [Google+ API](https://console.developers.google.com/apis/api/plus.googleapis.com/overview)
1. In the [Credentials](https://console.developers.google.com/apis/credentials) part, create a new **OAuth client ID**, select **Web application** and add your website URLs (maybe localhost and prod) in the **Authorised redirect URIs** fields
1. Copy-paste the **Client ID**	and **Client secret** obtained to your `.env` file
1. Fill the required fields in the **OAuth consent screen** tab

### Run! 🚀
```ssh
node app.js
```

## Link with Plex or KODI
If your Synology is linked to a Media Server like Plex or KODI and if you set the download destinations in your `.env` file accordingly to the one used by your Media Server, then downloads will be automatically added to your Media Server library. As if by magic!

## Contributions welcomed!
Don't hesitate if you have any questions or a desire to contribute :)

## MIT License

Copyright (c) 2017 Lionel Paulus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.