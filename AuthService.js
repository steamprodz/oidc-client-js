import { UserManager } from '.';

export class AuthService {
    constructor(settings) {
        this.settings = settings;
        this.userManager = new UserManager(settings);
    }

    async requestOrRenewToken(state) {
        return this.userManager.signinClientCredentials({state});
    }

    async getUser() {
        return this.userManager.getUser().then((user) => {
            if (!user) {
              return Promise.reject('User is not authenticated');
            } else {
              return Promise.resolve(user);
            }
        });
    }
}

export class IdentityAuthService {
    static get settings() {
        return this._settings;
    }

    static set settings(settings) {
        this._settings = settings;
    }

    static get instance() {
        if (!this.authService) {
            this.authService = new AuthService(this.settings);
        }

        return this.authService;
    }
}
