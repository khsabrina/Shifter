class Auth {
  constructor() {

  }

  login(data: any) {
    localStorage.setItem("token", data.token);
  }

  setUser(data: any) {
    console.log(data);
    localStorage.setItem("firstName", data.first_name);
    localStorage.setItem("username", data.username);
    localStorage.setItem("lastName", data.last_name);
    localStorage.setItem("userId", data.id);
    localStorage.setItem("isAdmin", data.is_admin);
    // localStorage.setItem("jobDescription", data.jobDescription);
    // localStorage.setItem("imageSrc", data.imageSrc);
    localStorage.setItem("companyId", data.company_id);
    localStorage.setItem("teamId", data.team_id);
    if (data.team_ids == null) {
      localStorage.setItem("teamIds", data.team_id);
    } else {
      localStorage.setItem("teamIds", data.team_ids);
    }
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
