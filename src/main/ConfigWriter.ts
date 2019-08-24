import fs from 'fs';

export default class ConfigWriter {
    path: string;
    text = 'say "[Spotify] Now Playing: {trackName}"';

    constructor(configPath: string) {
        this.path = configPath;

        const exists = fs.existsSync(this.path);
        if (!exists) {
            fs.closeSync(
                fs.openSync(this.path, 'a')
            );
        }
    }

    async rewriteBinding(trackName: string) {
        let configContent = this.text.replace('{trackName}', trackName);

        await this.rewriteFile(configContent);
    }

    async rewriteFile(str: string) {
        await fs.writeFile(this.path, str, function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 
    }


}