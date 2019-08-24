const regedit = require('regedit');

export default class SteamSettingsManager {

    static getSettings() {

        const regPath = 'HKCU\\SOFTWARE\\Valve\\Steam';

        regedit.list(regPath, (err: any, result: any) => {
            if (err) {
                // TODO: Не установлен стим.
                console.log(err);
                return;
            }

            let steamSettings = result[regPath].values;
            
            return {
                steamPath: steamSettings.SteamPath.value,
                autoLoginUser: steamSettings.AutoLoginUser.value,
            }
            
        });
    }

}