import regedit from 'regedit';

export default class SteamSettingsManager {

    static constructor() {
        const vbsDirectory = path.join(path.dirname(electron.remote.app.getPath('exe')), './resources/my-location');
        regedit.setExternalVBSLocation(vbsDirectory);
    }

    static getSettings() {
        const regPath = 'HKCU\\SOFTWARE\\Valve\\Steam';

        regedit.list(regPath, (err, result) => {
            if (err) {
                // TODO: Не установлен стим.
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