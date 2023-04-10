class Auth {
  constructor() {

  }

  login(data: any) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("firstName", data.name);
    localStorage.setItem("lastName", data.lastName);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("jobDescription", data.jobDescription);
    localStorage.setItem("imageSrc", data.imageSrc);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userId");
  }

  isAuthenticated() {
    return localStorage.getItem("token") !== null
  }
}

export default new Auth();
