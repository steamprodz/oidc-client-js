import { UserManager } from '.';

export class AuthService {
    constructor(settings, extraHeaders) {
        this.settings = settings;
        this.extraHeaders = extraHeaders;
        this.userManager = new UserManager(settings);
    }

    async requestOrRenewToken(state) {
        return this.userManager.signinClientCredentials({state}, this.extraHeaders);
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

    static get extraHeaders() {
        return this._extraHeaders;
    }

    static set extraHeaders(extraHeaders) {
        this._extraHeaders = extraHeaders;
    }

    static get instance() {
        if (!this.authService) {
            this.authService = new AuthService(this._settings, this._extraHeaders);
        }

        return this.authService;
    }
}
