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

interface Team {
  company_id: string | null;
  name: string;
  manager: string | null;
}


const userLogin = async (user: LoginForm) => {
  const response = await fetch(`${URL}token-auth/`, methodPostToLogin(user));
  const data = await response.json();
  if (response.status === 200) {
    auth.login(data);
    return "work"
  }
  return "incorrect username or password"
};

const getUser = async () => {
  const response = await fetch(`${URL}0/employee/`, methodGetWithData({ "key": "value" }));
  const data = await response.json();
  if (response.status === 200) {
    auth.setUser(data);
  }
};
const getTeam = async (TeamId : String) => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/team/?`, methodGetWithData({ "team_ids": [TeamId] }));
  const data = await response.json();
  if (response.status === 200) {
    return data
  }
};


const getAllUserTeam = async () => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/team/?`, methodGetWithData({ "team_ids": localStorage.getItem("teamIds")?.split(",") }));
  const data = await response.json();
  if (response.status === 200) {
    return data
  }
};

const getRole = async (RoleId : String) => {
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/role/?`, methodGetWithData({RoleId}));
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
const TeamInfo = async () => {
  console.log(localStorage.getItem("companyId"));
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/teamemp/?`, methodGetWithData({ "team_ids": localStorage.getItem("teamIds")?.split(",")}));
  const data = await response.json();
  console.log(data)
  if (response.status === 200) {
    return data

  }
};

const CreateTeam = async (team: {}) => {
  console.log(team)
  const response = await fetch(`${URL}0/team/`, methodPost(team));
  const data = await response.json();
  if (response.status === 201) {
    console.log(data)
    // auth.setUser(data);
  }
};

const CreateUser = async (user: {}) => {
  // console.log(team)
  const response = await fetch(`${URL}${localStorage.getItem("companyId")}/employee/`, methodPost(user));
  const data = await response.json();
  if (response.status === 201) {
    console.log(data)
    // auth.setUser(data);
  }
};

const CreateRole = async (role: {}) => {
  console.log(role)
  const response = await fetch(`${URL}0/role/`, methodPost(role));
  const data = await response.json();
  if (response.status === 201) {
    console.log(data)
    // auth.setUser(data);
  }
};

const GetTeamList = async () => {
  const response = await fetch(`${URL}team/`, methodGetWithData({}));
}


const GetTeamShifts = async (date: Date) => {
  let myUrl = `${URL}${localStorage.getItem("companyId")}/shifts/?team_id=${localStorage.getItem("teamId")}`;
  if (date) {
    console.log("eheee")
    console.log(date);
    myUrl += `&date=${date}`;
  }
  const response = await fetch(`${myUrl}`, methodGetWithData({}));
  const data = await response.json();
  if (response.status === 200) {
    return data;
  }
  return data.message
};


// const userLogin = async (user: LoginForm) => {
//   console.log(user);
//   const response = await fetch(`${URL}/user/`, methodPost(user));
//   const data = await response.json();
//   if (data.hasOwnProperty("key")) {
//     console.log("success");
//   } else {
//     alert(data.error);
//   }
// };

// User Log In
// const userLogin = async (dispatch: any, user, history) => {
//   const response = await fetch(`${URL}/login`, methodPost(user));
//   const data = await response.json();
//   if (data.hasOwnProperty("auth_key")) {
//     localStorage.setItem("token", data.auth_key);
//     dispatch({ type: "SET_CURRENT_USER", user: data.user });
//     auth.login(() => {
//       history.push("/dashboard");
//     });
//   } else {
//     alert(data.error);
//   }
// };

// User Sign Up
// const userSignup = async (dispatch, user, history) => {
//   const response = await fetch(`${URL}/signup`, methodPost(user));
//   const data = await response.json();
//   if (data.hasOwnProperty("auth_key")) {
//     localStorage.setItem("token", data.auth_key);
//     dispatch({ type: "SET_CURRENT_USER", user: data.user });
//     auth.login(() => {
//       history.push("/dashboard");
//     });
//     // history.push("/dashboard");
//   } else {
//     alert(data.error);
//   }
// };

// const fetchOrganizations = async (dispatch) => {
//   const response = await fetch(`${URL}/organizations`);
//   const data = await response.json();
//   dispatch({ type: "SET_ORGANIZATIONS", organizations: data });
//   return data;
// };

// Fetch All Users
// const fetchUsers = async (dispatch) => {
//   const response = await fetch(`${URL}/users`);
//   const data = await response.json();
//   return dispatch({ type: "SET_USERS", users: data });
// };

// Fetch users from a particular organization
// const fetchEmployees = async (dispatch, id) => {
//   const response = await fetch(`${URL}/organizations/${id}`);
//   const data = await response.json();
//   const organization = {
//     name: data.name,
//     id: data.id,
//   };
//   dispatch({ type: "SET_USERS", users: data.users });
//   dispatch({ type: "SET_ORGANIZATION", organization: organization });
// };

// Create an Employee
// const createEmployee = async (dispatch, data) => {
//   // First Create The user
//   const user = await fetch(URL + "/users", methodPost(data.user)).then((res) =>
//     res.json()
//   );
//   // Then Create The Employee
//   const employee = { user_id: user.id, organization_id: data.org_id };
//   const e = await fetch(URL + "/employees", methodPost(employee)).then((res) =>
//     res.json()
//   );
//   // Then Create The Week Schedule for the Employee
//   const schedule = { employee_id: e.id, work_week_id: data.ww_id };
//   await fetch(URL + "/create_schedules", methodPost(schedule)).then((res) =>
//     res.json()
//   );
//   dispatch({ type: "UPDATE_USERS", user: user });
// };

// Fetches the Working Schedule for a particular Week
// const fetchWorkWeek = async (dispatch, obj) => {
//   const response = await fetch(URL + "/week_request", methodPost(obj));
//   const data = await response.json();
//   data.week_schedule
//     ? dispatch({ type: "SET_SCHEDULES", schedules: data.week_schedule }) &&
//       dispatch({ type: "SET_WORK_WEEK_ID", work_week_id: data.id })
//     : console.log("Unable to fetch Week Schedule");
// };

// Create a Schedule
// const createSchedule = async (date, schedule) => {
//   schedule = {
//     user_id: 3,
//     calendar_date_id: date.id,
//     is_available: true,
//     start_time: "TESTING",
//     end_time: "POST",
//   };
//   console.log(schedule);
//   const response = await fetch(`${URL}/schedules`, methodPost(schedule));
//   const data = await response.json();
// };

// Updates a Schedule
// const updateSchedule = async (schedule) => {
//   console.log(`${URL}/schedules/${schedule.id}`);
//   const response = await fetch(
//     `${URL}/schedules/${schedule.id}`,
//     methodPatch(schedule)
//   );
//   const data = await response.json();
// };


export {
  userLogin,
  TeamInfo,
  GetTeamShifts,
  getUser,
  CreateTeam,
  getTeam,
  getRole,
  getAllUserTeam,
  CreateRole,
  getAllRoles,
  CreateUser
  
  // userSignup,
  // fetchOrganizations,
  // fetchUsers,
  // fetchEmployees,
  // fetchWorkWeek,
  // createEmployee,
  // createSchedule,
  // updateSchedule,
};
