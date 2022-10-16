# ANI-CLI-NPM

### An Anime client, writen in nodeJS, to access any* anime without the need for ad filled websites! Just install, search for the anime of your choice, and watch in the video player of your choice.
### NodeJS rewrite of the [ani-cli](https://github.com/pystardust/ani-cli) package for linux.


## Instalation:
### Windows:
#### - Download and install [nodejs](https://nodejs.org/en/download/)
#### - Open a terminal or powershell and run the following command to run the program:
```
npx ani-cli-npm@latest
```
#### - It is recomended to install VLC media player, but optionaly you can change your video player to Browser in config

### Android
#### - Install the android terminal of your choice. e.g. [Termux](https://play.google.com/store/apps/details?id=com.termux)
#### - Install [nodejs](https://nodejs.org/). In termux this is done with the following command:
```
pkg install nodejs
```
#### - Run npx ani-cli-npm@latest
##### Note: At preset (1.0.6), you will need to change the player to browser, and will have to do any downloads through your browser of choice.

### Linux:
#### - Install [nodejs](https://nodejs.org/en/download/ with your distrabutions package manager.
#### - Run the following command:
```
npx ani-cli-npm@latest
```
##### Note: If you are using linux, I would advise just using the origonal [ani-cli](https://github.com/pystardust/ani-cli), the main perpous of this package is to allow easier use on windows and android.


## Usage:
<img width="147" alt="image" src="https://user-images.githubusercontent.com/74017165/195988816-5088cbff-348e-4852-a1a0-ef343785d488.png">

#### Input the page you wish to got to then press the enter key to select

### Search:

#### Input the name of the anime you want to watch, the select an anime from the search results. Then select the episode you wish to watch (If there is only one episode, said ep will be played automaticly)

#### Play      - Plays the episode you have chosen in the player you have selected in config (VLC by default)

#### Download  - Will download the episode. (This requires you to have chosed a download directory in config). 

##### The download feature is not currently implemented, if you wish to download, open in browser and download there.

#### Show Link - Will display the link to the video file. This can be opened in a video player or browser.

### Config:

#### For configuring several of options about how the program works.

#### Player     - Change which player is used to open the anime.

#### Prozy      - Proxy used for searching. This is not currently implemented and will not work.

#### User agent - The user agent used to make requests to websites.


## Current limitations:

### At present this program only has Xstreamcdn videos implemented, as such, there is a high liklyhood that many animes will not be available. This will soon be amended but for now you will need to stick to the animes that are available under Xstreamcdn.

### This project is still very much under development, as such, there are quite a few bugs.
