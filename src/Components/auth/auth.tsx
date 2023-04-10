class Auth {
  authenticated = false;
  token = "";
  name = ""
  lastName = ""
  userId = ""
  jobDescription=""
  imageSrc=""
  constructor() {
    this.authenticated = false;
  }

  login(data: any) {
    this.authenticated = true;
    this.token = data.token;
    this.name = data.name;
    this.lastName = data.lastName;
    this.userId = data.userId;
    this.jobDescription = data.jobDescription;
    this.imageSrc = data.imageSrc;
  }

  logout() {
    this.authenticated = false;
    this.token = "";
    this.name = "";
    this.lastName = "";
    this.userId = "";
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
