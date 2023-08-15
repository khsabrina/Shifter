import auth from "../Components/auth/auth";

// const URL = "https://django-server-production-293f.up.railway.app/shifter/";
const URL = "http://127.0.0.1:8000/api/"

const methodGetWithData = (data: any) => {
  return {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  };
};

// Helper POST Method
const methodPost = (data: any) => {
  return {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`
    },
  };
};

const methodDelete = () => {
  return {
    method: "DELETE",
    // body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`
    },
  };
};

const methodPostToLogin = (data: any) => {
  return {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
    },
  };
};

// Helper PATCH Method
const methodPatch = (data: any) => {
  return {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`
    },
  };
};

interface LoginForm {
  username: string;
  password: string;
}

// interface Team {
//   company_id: string | null;
//   name: string;
//   manager: string | null;
// }


const userLogin = async (user: LoginForm) => {
  const response = await fetch(`${URL}token-auth/`, methodPostToLogin(user));
  const data = await response.json();
  if (response.status === 200) {
    auth.login(data);
    return true;
  }
  return false;
};

const getUser = async () => {
  const response = await fetch(`${URL}0/employee/`, methodGetWithData({ "key": "value" }));
  const data = await response.json();
  if (response.status === 200) {
    auth.setUser(data);
  }
};
const getTeam = async (TeamId: String) => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/team/?`, methodGetWithData({ "team_ids": [TeamId] }));
  const data = await response.json();
  if (response.status === 200) {
    return data
  }
};


const getAllUserTeam = async () => {
  let team_ids: string[] = []
  let local_team_ids = localStorage.getItem("teamIds");
  if (local_team_ids) {
    team_ids = local_team_ids.split(',');
  }
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/team/?`, methodGetWithData({ "team_ids": team_ids }));
  const data = await response.json();
  if (response.status === 200) {
    return data
  }
};

// const getAllUserTeam = async () => {
//   const response = await fetch(`${URL}${localStorage.getItem("companyId")}/team/?`, methodGetWithData({ "team_id": localStorage.getItem("teamIds")?.split(",") }));
//   const data = await response.json();
//   if (response.status === 200) {
//     return data
//   }
// };

const getAllCompanyTeam = async () => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/team/?all=1`, methodGetWithData({}));
  const data = await response.json();
  if (response.status === 200) {
    return data
  }
};

const getRole = async (RoleId: String) => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/role/?`, methodGetWithData({ RoleId }));
  const data = await response.json();
  if (response.status === 200) {
    return data
  }
};

const getAllRoles = async () => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/role/?all=true`, methodGetWithData({}));
  const data = await response.json();
  if (response.status === 200) {
    return data
  }
};
const TeamInfo = async (admin) => {
  let team_ids: string[] = []

  let local_team_ids = localStorage.getItem("teamIds");
  if (local_team_ids != "null") {
    team_ids = (local_team_ids as string).split(',');
  }
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/teamemp/?`, methodGetWithData({ "team_ids": team_ids }));
  const data = await response.json();
  if (response.status === 200) {
    return data
  }
  return null;
};

const CreateTeam = async (team: {}) => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/team/`, methodPost(team));
  const data = await response.json();
  if (response.status === 201) {
    return data
    // auth.setUser(data);
  }
  return null
};

const CreateUser = async (user: {}) => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/employee/`, methodPost(user));
  const data = await response.json();
  if (response.status === 201) {
    return data;
    // auth.setUser(data);
  }
};

const EditUser = async (selectedId: string, user: {}) => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/employee/${selectedId}/`, methodPatch(user));
  const data = await response.json();
  if (response.status === 201) {
    // auth.setUser(data);

  }
  return data
};
const DeleteUser = async (selectedId: string) => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/employee/${selectedId}`, methodDelete());
  const data = await response.json();
  if (response.status === 201) {
    // auth.setUser(data);
  }
};

const CreateRole = async (role: {}) => {
  const response = await fetch(`${URL}0/role/`, methodPost(role));
  const data = await response.json();
  if (response.status === 201) {
    return data
    // auth.setUser(data);
  }
};

const GetTeamList = async () => {
  let team_ids: string[] = []
  let local_team_ids = localStorage.getItem("teamIds");
  if (local_team_ids) {
    team_ids = local_team_ids.split(',');
  }
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/team/`, methodGetWithData({ "team_ids": team_ids }));
  if (response.status === 200) {
    const data = await response.json();
    return data;
  }
  return [];
}

const GetRoles = async () => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/role/`, methodGetWithData({}));
  if (response.status === 200) {
    const data = await response.json();
    return data;
  }
  return [];
}


const GetTeamAssignments = async (data: {}, team_id: String) => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/assignments/?team_id=${team_id}`;
  const response = await fetch(`${myUrl}`, methodGetWithData(data));
  if (response.status === 201) {
    const data = await response.json();
    if (data !== "No team_id for ShiftsGet :(") {
      return data
    }
  }
  return [];
}

const updateAssignments = async (data: {}) => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/assignments/`;
  const response = await fetch(`${myUrl}`, methodPatch(data));
  if (response.status === 201) {
    const data = await response.json();
    return data;
  }
  return [];
}

const GetTeamShifts = async (team_id: string, dates: {}) => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/shifts/?team_id=${team_id}`;
  const response = await fetch(`${myUrl}`, methodGetWithData(dates));
  if (response.status === 201) {
    const data = await response.json();
    return data;
  }
  return [];
}

const CreateTeamShifts = async (team_id: string, shifts: {}) => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/shifts/`;
  const response = await fetch(`${myUrl}`, methodPost(shifts));
  if (response.status === 201) {
    const data = await response.json();
    return data;
  }
  return {};
}


const GetTeamTemplate = async (team_id: string) => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/shift-templates/?team_id=${team_id}`;
  const response = await fetch(`${myUrl}`, methodGetWithData({}));
  if (response.status === 201) {
    const data = await response.json();
    return data;
  }
  return []
};

const GetAssignments = async (date: Date) => {
  let team_ids: string[] = []
  let all_data: string[] = []
  let local_team_ids = localStorage.getItem("teamIds");
  if (local_team_ids) {
    team_ids = local_team_ids.split(',');
  }
  for (let i = 0; i < team_ids.length; i++) {
    let myUrl = `${URL}${localStorage.getItem("companyId")}/assignments/?team_id=${team_ids[i]}`;
    const response = await fetch(`${myUrl}`, methodGetWithData({}));
    if (response.status === 200) {
      const data = await response.json();
      all_data.push(data);
    }
  }
  return all_data;
}


const updateTemplate = async (data: {}) => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/shift-templates/`;
  const response = await fetch(`${myUrl}`, methodPatch(data));
  if (response.status === 201) {
    const data = await response.json();
    return data;
  }
  return {}
};

const deleteTemplate = async (templateId: String) => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/shift-templates/?TemplateID=${templateId}`;
  const response = await fetch(`${myUrl}`, methodDelete());
  if (response.status === 201) {
    return true;
  }
  return false;
};

const CreateTemplate = async (template: {}) => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/shift-templates/`;
  const response = await fetch(`${myUrl}`, methodPost(template));
  if (response.status === 201) {
    const data = await response.json();
    return data;
  }
  return {};
};

const getWeekklyPref = async () => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/weeklypref/?team_id=${localStorage.getItem("teamId")}&employee_id=${localStorage.getItem("username")}`;
  const response = await fetch(`${myUrl}`, methodGetWithData({}));
  if (response.status === 201) {
    const data = await response.json();
    return data;
  }
  return {};
}

const updateWeekklyPref = async (data: {}) => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/weeklypref/?team_id=${localStorage.getItem("teamId")}&employee_id=${localStorage.getItem("username")}`;
  const response = await fetch(`${myUrl}`, methodPatch(data));
  if (response.status === 201) {
    const data = await response.json();
    return data;
  }
  return {};
}

const activate = async (data: {}) => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/algorithm/`;
  const response = await fetch(`${myUrl}`, methodGetWithData(data));
  if (response.status === 201) {
    const data = await response.json();
    return data;
  }
  return {};
}

export {
  userLogin,
  TeamInfo,
  GetTeamAssignments,
  getUser,
  CreateTeam,
  getTeam,
  getRole,
  getAllUserTeam,
  CreateRole,
  getAllRoles,
  CreateUser,
  GetAssignments,
  GetTeamTemplate,
  GetTeamList,
  GetTeamShifts,
  CreateTeamShifts,
  GetRoles,
  EditUser,
  DeleteUser,
  updateTemplate,
  deleteTemplate,
  CreateTemplate,
  getAllCompanyTeam,
  updateAssignments,
  getWeekklyPref,
  updateWeekklyPref,
  activate
  // userSignup,
  // fetchOrganizations,
  // fetchUsers,
  // fetchEmployees,
  // fetchWorkWeek,
  // createEmployee,
  // createSchedule,
  // updateSchedule,
};
