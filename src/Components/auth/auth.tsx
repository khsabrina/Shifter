class Auth {
  authenticated = false;
  token = "";
  constructor() {
    this.authenticated = false;
  }

  login(token: string) {
    this.authenticated = true;
    this.token = token
  }

  logout() {
    this.authenticated = false;
    this.token = "";
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
