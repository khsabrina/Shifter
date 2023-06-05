class Auth {
  constructor() {

  }

  login(data: any) {
    localStorage.setItem("token", data.token);
  }

  setUser(data: any) {
    console.log(data);
    localStorage.setItem("firstName", data.first_name);
    localStorage.setItem("lastName", data.last_name);
    localStorage.setItem("userId", data.id);
    // localStorage.setItem("jobDescription", data.jobDescription);
    // localStorage.setItem("imageSrc", data.imageSrc);
    localStorage.setItem("companyId", data.company_id);
    localStorage.setItem("teamId", data.team_id);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userId");
    localStorage.removeItem("jobDescription");
    localStorage.removeItem("imageSrc");
  }

  isAuthenticated() {
    return localStorage.getItem("token") !== null
  }
}

export default new Auth();
