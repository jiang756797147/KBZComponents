
export default class DialogUtils {

    dialogInstance = null;
    constructor() {}

    static getInstance() {

        if (!this.dialogInstance) {
            this.dialogInstance = new DialogUtils();
        }

        return this.dialogInstance;
    }

    setApp(app) {
        this.app = app
    }

    setNavigation(navigation) {
        this.navigation = navigation;
    }

    getNavigation() {
        return this.navigation;
    }

    setLoginAgainDialog(loginDialog) {
        this.loginDialog = loginDialog;
    }

    showLoginDialog() {
        this.loginDialog.show();
    }

    hideLoginDialog() {
        this.loginDialog.dismiss();
    }

    setProgress(progress) {
        this.progress = progress;
    }

    showProgress() {
        this.progress.showProgress();
    }

    hideProgress() {
        this.progress.hideProgress();
    }
}
