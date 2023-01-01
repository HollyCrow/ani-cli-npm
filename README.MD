# ANI-CLI-NPM

### An Anime client, writen in nodeJS, to access any* anime without the need for ad filled websites! Just install, search for the anime of your choice, and watch in the video player of your choice.
### Typescript rewrite of the [ani-cli](https://github.com/pystardust/ani-cli) package for linux.

# Warning: due to shutdowns of Animixplay, this tool, along with ani-cli, is broken at present. I am currently working on a fix, but for now this will not work.

![image](https://user-images.githubusercontent.com/74017165/205444723-20520eb1-55dd-4103-811b-07e2cf6c466d.png)


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
#### - Run 
```
npx ani-cli-npm@latest
```

### Linux:
#### - Install [nodejs](https://nodejs.org/en/download/) with your distrabutions package manager.
#### - Run the following command:
```
npx ani-cli-npm@latest
```

### Build from git:
```
git clone https://github.com/Bumpkin-Pi/ani-cli-npm.git
cd ani-cli-npm
npm i
npm run build
npm run start
```


## Usage:
![image](https://user-images.githubusercontent.com/74017165/204142452-485e31b5-68dc-4eea-9924-bfb040429b02.png)



#### Input the page you wish to got to then press the enter key to select

### Search: Input the name of the anime you want to watch, the select an anime from the search results. Then select the episode you wish to watch (If there is only one episode, said ep will be played automaticly)

### Download  - Download either a single episode, or a range of episodes from an anime of your choice. Download folder can be changed in options.

##### The download feature is not currently implemented, if you wish to download, open in browser and download there.

#### Show Link - Will display the link to the video file. This can be opened in a video player or browser.

### Options:

#### For configuring several of options about how the program works.

#### Player           - Change which player is used to open the anime (default browser).

#### Proxy            - Proxy used for searching. This is not currently implemented and will not work.

#### User agent       - The user agent used to make requests to websites.

#### Download folder  - The folder in which to download episodes.

![image](https://user-images.githubusercontent.com/74017165/205444327-d67c5099-beaf-4895-9c74-c24b79a95e07.png)



<a href="https://www.buymeacoffee.com/bumpkinpi" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
