import Layout from "../../LayoutArea/Layout/Layout";
import UserPic from "./UserCircle/NoPhotoUser.png"
import { TeamInfo, getUser, CreateTeam, getTeam, getRole, getAllUserTeam, CreateRole, getAllRoles, CreateUser, DeleteUser, EditUser, getAllCompanyTeam } from "../../../actions/apiActions"
import "./Team.css"
import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import {
  Typography, Autocomplete, MenuItem, Checkbox, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, FormControlLabel
  , IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button, FormControl, InputLabel, Select, Grid, Menu, SelectChangeEvent, MenuItemProps, InputAdornment, FormHelperText,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Email, Rowing, Rule, Visibility, VisibilityOff } from '@mui/icons-material';
import UserCircle from "./UserCircle/UserCircle";
import { alignProperty } from "@mui/material/styles/cssUtils";
import SearchBar from './SearchBar/SearchBar'
import { range } from "lodash";
import auth from "../../auth/auth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ChromePicker } from 'react-color';
import { toast } from "react-toastify";




interface Row {
  id: string;
  imageSrc: string;
  firstName: string;
  lastName: string;
  jobDescription: string;
  team: string;
  email: string;
  teamID: string;
  jobDescriptionID: string;
  isAdmin: string;

}

interface NewUser {
  id: number;
  imageSrc: string;
  name: string;
  jobDescription: string;
  isManagar: boolean;
  Team: string;
  email: string;
  password: string;
}
const teamNames = ["Team A", "Team B", "Team C"];
const data = [
  { name: "Alice", team: "Team A" },
  { name: "Bob", team: "Team B" },
  { name: "Charlie", team: "Team C" },
  { name: "David", team: "Team A" },
  { name: "Eve", team: "Team B" },
  { name: "Frank", team: "Team C" },
];

interface Team {
  id: string;
  name: string;
  company_id: string;
  manager: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  company_id: string;
}


let Team = () => {

  const [userList, setuserList] = useState<Row[]>([]);
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [RoleList, setRoleList] = useState<Role[]>([]);

  const [rows, setRows] = useState<Row[]>(userList);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [team, setTeam] = useState('');
  const [teamID, setTeamID] = useState('');
  const [jobDescriptionID, setJobDescriptionID] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageSrc, setimageSrc] = useState<string>('');
  const [isManager, setIsManager] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string>('');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [firstNameSearch, setFirstNameSearch] = useState('');
  const [lastNameSearch, setLastNameSearch] = useState('');
  const [jobDescriptionSearch, setJobDescriptionSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [showSearch, setshowSearch] = useState([firstNameSearch, lastNameSearch, jobDescriptionSearch, teamSearch]);
  const [anchorAdd, setAnchorAdd] = useState(null); // State for anchor element of the menu
  const [NewTeamOpen, setNewTeamOpen] = useState(false);
  const [NewJobDescriptionOpen, setNewJobDescriptionOpen] = useState(false);

  const [AddNewTeamName, SetAddNewTeamName] = useState("");
  const [AddNewJobDescriptionName, SetAddNewJobDescriptionName] = useState("");

  const [NewTeamSelectedEmployees, SetNewTeamSelectedEmployees] = useState<string>("");

  const [firstNameChange, setFirstNameChange] = useState('');
  const [lastNameChange, setLastNameChange] = useState('');
  const [jobDescriptionChange, setJobDescriptionChange] = useState<string>('');
  const [teamChange, setTeamChange] = useState<string>('');
  const [emailChange, setEmailChange] = useState<string>('');
  const [passwordChange, setPasswordChange] = useState('');
  const [passwordChange2, setPasswordChange2] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000'); // Default color is black

  const colorPickerRef = useRef(null);





  useEffect(() => {
  }, [rows]);

  useEffect(() => {
  }, [userList]);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        let result, teamListResult, roleListResult;
        if (localStorage.getItem("teamIds") != "null") {
          [result, teamListResult, roleListResult] = await Promise.all([
            TeamInfo(localStorage.getItem("teamIds")),
            getAllUserTeam(),
            getAllRoles(),
          ]);


        } else {
          //comany manager
          [teamListResult, roleListResult] = await Promise.all([
            getAllCompanyTeam(),
            getAllRoles(),
          ]);

          const teamIds = await Promise.all(await teamListResult.map((item) => item.id));
          result = await Promise.all(await TeamInfo([]));

        }


        // let teamIds = await Promise.all(teamListResult.map((item) => item.id));
        // result = await Promise.all(TeamInfo(teamIds));
        const itemsTeam = await Promise.all(
          teamListResult.map(async (item) => {
            return {
              id: item.id,
              name: item.name,
              company_id: item.company_id,
              manager: item.manager,
            };
          })
        );
        const itemsRole = await Promise.all(
          roleListResult.map(async (item) => {
            return {
              id: item.id,
              name: item.name,
              description: item.company_id,
              company_id: item.manager,
            };
          })
        );

        if (isMounted) {
          setTeamList(itemsTeam);
          setRoleList(itemsRole);

          // Use Promise.all to ensure teamList and RoleList are populated
          const items = await Promise.all(
            result.map(async (item) => {
              // Access team name and role name from the populated teamList and RoleList arrays
              const teamName = itemsTeam.find((team) => team.id === item.team_id)?.name || "";
              const roleName = itemsRole.find((role) => role.id === item.role_id)?.name || "Manager";

              return {
                id: item.id,
                firstName: item.first_name,
                lastName: item.last_name,
                team: teamName,
                teamID: item.team_id,
                jobDescriptionID: item.role_id,
                jobDescription: roleName,
                imageSrc: UserPic,
                email: item.username,
                isAdmin: item.is_admin.toString(),
              };
            })
          );

          setuserList(items);
          setRows(items);
        }
      } catch (error) {
        // Handle error if any
      }
    }

    fetchData(); // Fetch data when the component mounts

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
  }, [rows]);

  // useEffect(() => {
  //   let isMounted = true;

  //   async function fetchData() {
  //     try {
  //       const [result, teamListResult, roleListResult] = await Promise.all([
  //         TeamInfo(),
  //         getAllUserTeam(),
  //         getAllRoles(),
  //       ]);

  //       const Tlist = teamListResult.reduce((acc, team) => {
  //         if (team.name !== "") {
  //           acc[team.id] = team;
  //         }
  //         return acc;
  //       }, []);

  //       const Rlist = roleListResult.reduce((acc, role) => {
  //         if (role.name !== "") {
  //           acc[role.id] = role;
  //         }
  //         return acc;
  //       }, []);

  //       if (isMounted) {
  //         setTeamList(Tlist);
  //         setRoleList(Rlist)
  //         const items = await Promise.all(
  //           result.map(async (item) => {
  //             return {
  //               id: item.id,
  //               firstName: item.first_name,
  //               lastName: item.last_name,
  //               team: Tlist[item.team_id].name,
  //               teamID: item.team_id,
  //               jobDescriptionID : item.role_id,
  //               jobDescription: Rlist[item.role_id].name,
  //               imageSrc: UserPic,
  //               email : item.username,
  //             };
  //           })
  //         );

  //         setuserList(items);
  //         setRows(items);
  //       }
  //     } catch (error) {
  //       // Handle error if any
  //     }
  //   }

  //   fetchData(); // Fetch data when the component mounts

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);


  useEffect(() => {
    const filteredRows = FilterBy(userList, teamSearch, jobDescriptionSearch, firstNameSearch, lastNameSearch);
    setRows(filteredRows);
  }, [userList, teamSearch, jobDescriptionSearch, firstNameSearch, lastNameSearch]);
  const handleSwitchChange = () => {
    setIsManager(!isManager);
    // onRoleChange(event.target.checked);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleSaveColor = () => {
    setShowColorPicker(false);
    // Add any additional logic here to apply the selected color to the switch or save it elsewhere.
  };

  const handleEmployeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    SetNewTeamSelectedEmployees(value);

    if (checked) {
      SetNewTeamSelectedEmployees(value);
    } else {
      // SetNewTeamSelectedEmployees((prevSelectedEmployees) =>
      //   prevSelectedEmployees.filter((employee) => employee !== value)
      // );
    }
  };
  const handleNewJobDescriptionOpen = () => {
    setNewJobDescriptionOpen(true);
    handleMenuAddClose();

  };

  const handleNewTeamOpen = () => {
    setNewTeamOpen(true);
    handleMenuAddClose();

  };
  const onTeamCreate = async (data: {}) => {
    if (auth.isAuthenticated() === true) {
      return await CreateTeam(data);
    }
  };
  const onUserEdit = async (id: string, data: {}) => {
    if (auth.isAuthenticated() === true) {
      await EditUser(id, data);
    }
  };
  const onUserCreate = async (data: {}) => {
    if (auth.isAuthenticated() === true) {
      return await CreateUser(data);
    }
  };

  const onUserDelete = async (id: string) => {
    if (auth.isAuthenticated() === true) {
      return await DeleteUser(id);
    }
  };

  const onJobDescriptionCreate = async (data: {}) => {
    if (auth.isAuthenticated() === true) {
      return await CreateRole(data);
    }
  };

  const handleNewTeamClose = () => {
    setNewTeamOpen(false);
    SetAddNewTeamName('')

  };

  const handleNewJobDescriptionClose = () => {
    SetAddNewJobDescriptionName('')
    setNewJobDescriptionOpen(false);
  };
  const handleCreateNewTeamClose = async () => {
    let data = {};
    let data2 = {};

    data = await onTeamCreate({ "company_id": localStorage.getItem("companyId"), "name": AddNewTeamName, "manager": NewTeamSelectedEmployees });
    
    if (data == null){
      toast.error("Team faild to created", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    }else{
      // data2 = await EditUser(localStorage.getItem("userId") as string,{"team_id": data['id']});
      // const new_team = {id: data['id'],name: data['name'],manager: data['manager'] ,company_id: data['company_id']};
      // teamList[data['id']] = new_team
      toast.success("Team created successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
      setTeamList((prevTeams) => [
        ...prevTeams,
        { id: data['id'], name: data['name'], manager: data['manager'], company_id: data['company_id'] },
      ]);


      handleNewTeamClose();

      
    }
  };

  const handleCreateNewJobDescriptionClose = async () => {
    let data = {};
    data = await onJobDescriptionCreate({ "company_id": localStorage.getItem("companyId"), "name": AddNewJobDescriptionName });

    setRoleList((prevRoles) => [
      ...prevRoles,
      { id: data['id'], name: data['name'], description: data['description'], company_id: data['company_id'] },
    ]);
    handleNewJobDescriptionClose()
  };

  const handleMenuAddOpen = (event) => {
    setAnchorAdd(event.currentTarget);
  };

  const handleMenuAddClose = () => {
    setAnchorAdd(null);
  };


  const handleAddNewEmployee = () => {
    setDialogMode('add');
    setFirstNameChange('');
    setLastNameChange('');
    setJobDescriptionChange('');
    setEmailChange('')
    setPasswordChange('')
    setPasswordChange2('')
    setTeamChange('')
    setJobDescriptionChange('')
    setimageSrc(UserPic)
    setDialogOpen(true);
    handleMenuAddClose();
    setError('');
  };

  const handleEditRow = (row: typeof userList[0]) => {
    setDialogMode('edit');
    setFirstName(row.firstName);
    setLastName(row.lastName);
    setJobDescriptionChange(row.jobDescriptionID);//need to fix it to be the JobDescription of the user
    setTeamChange(row.teamID);///need to fix it to be the team of the user
    setFirstNameChange(row.firstName);
    setLastNameChange(row.lastName);
    setTeamID(row.teamID);
    setIsManager(JSON.parse(row.isAdmin));
    setJobDescriptionID(row.jobDescriptionID);
    // setJobDescriptionChange('');//need to fix it to be the JobDescription of the user
    // setTeamChange('');///need to fix it to be the team of the user
    // setPasswordChange('');
    setEmailChange(row.email)

    setSelectedRowId(row.id);
    setimageSrc(row.imageSrc);
    setDialogOpen(true);
  };

  const handleDeleteRow = (id: string) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    const deleteRow: Row[] = userList.filter((team) => team.id !== id);
    setuserList(deleteRow);
    onUserDelete(id);


  };
  const handlePasswordChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordChange2(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordChange(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailChange(event.target.value as string);
  };

  const handleJobDescriptionChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    setJobDescriptionChange(event.target.value as string);
  };

  // const handleTeamChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
  //   const selectedValue = event.target.value as string;
  //   setTeamChange(selectedValue);

  //   // Find the selected team by its ID
  //   const selectedTeam = teamList.find((team) => team.team_id.toString() === selectedValue);

  //   if (selectedTeam) {
  //     // Store the selected team's ID
  //     setTeam(selectedTeam.name);
  //   }
  // };

  const handleTeamChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    setTeamChange(event.target.value as string);
  };


  // const handleTeamChange = (event: SelectChangeEvent<{ value: string }>) => {
  //   const selectedValue = event.target.value as string;
  //   const selectedTeam = teamList.find(
  //     (team) => team.team_id.toString() === selectedValue
  //   );
  //   setTeamChange(selectedValue);

  //   if (selectedTeam) {
  //     setTeam(selectedTeam.name);
  //   }
  // };


  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstNameChange(event.target.value);
  };
  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastNameChange(event.target.value);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgSrc = reader.result?.toString() || '';
        setimageSrc(imgSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  // const onNewUserCreate = async (data: NewUser) => {
  //   if (auth.isAuthenticated() === true) {
  //     await CreateTeam(data);
  //   }
  // };
  const handleSaveRow = () => {
    if (isManager) {
      if (firstNameChange === '' || lastNameChange === '' || emailChange === '') {
        alert('Please fill in all required fields.');
        return;
      }
    } else {
      if (firstNameChange === '' || lastNameChange === '' || emailChange === '' || teamChange === '' || jobDescriptionChange === '') {
        alert('Please fill in all required fields.');
        return;
      }
    }
    if (dialogMode === 'add') {
      if (passwordChange === passwordChange2) {
        const uppercaseRegex = /[A-Z]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        const numberRegex = /\d/;
        if (!uppercaseRegex.test(passwordChange)) {
          setError('The password must be 8 or more characters with at least 1 special character, 1 uppercase letter and 1 number.');
        } else if (!specialCharRegex.test(passwordChange)) {
          setError('The password must be 8 or more characters with at least 1 special character, 1 uppercase letter and 1 number.');
        } else if (!numberRegex.test(passwordChange)) {
          setError('The password must be 8 or more characters with at least 1 special character, 1 uppercase letter and 1 number.');
        } else {
          setError('');
          AddUserDialog();
        }
      } else {
        setError('The password confirmation does not match');
      }
    } else {
      EditUserDialog();
    }

  }
  const EditUserDialog = async () => {
    if (isManager) {
      await onUserEdit(selectedRowId, {
        "company_id": localStorage.getItem("companyId"), "username": emailChange, "first_name": firstNameChange,
        "last_name": lastNameChange, "role_id": jobDescriptionChange, "color": selectedColor
      });
    }
    else {
      await onUserEdit(selectedRowId, {
        "company_id": localStorage.getItem("companyId"), "username": emailChange, "first_name": firstNameChange,
        "last_name": lastNameChange, "team_id": teamChange, "role_id": jobDescriptionChange, "is_admin": "false", "color": selectedColor
      });
    }

  //   toast.error("invalid username or password", {
  //     position: "top-center",
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  // });
    const updatedRows = rows.map((row) => {
      if (row.id === selectedRowId) {
        // If the row id matches the selectedRowId, update the row with new values
        const teamName = teamList.find((team) => team.id === teamChange)?.name || "";
        const roleName = RoleList.find((role) => role.id === jobDescriptionChange)?.name || "Manager";
        return {
          ...row,
          firstName: firstNameChange,
          lastName: lastNameChange,
          jobDescription: roleName,
          jobDescriptionID: jobDescriptionChange,
          team: teamName,
          teamID: teamChange,
          email: emailChange,
        };
      }
      // If the row id doesn't match, return the original row unchanged
      return row;
    });

    // setRows((prevRows) => [
    //   ...prevRows,
    //   {id: selectedRowId,imageSrc,firstName: firstNameChange ,lastName: lastNameChange,jobDescription: RoleList[jobDescriptionChange].name,jobDescriptionID: jobDescriptionChange,team: teamList[teamChange].name,teamID: teamChange,email: emailChange},
    // ]);
    setRows(updatedRows);

    setDialogOpen(false);
  };

  // const handleCreateNewTeamClose = async () => {
  //   let data  = {};
  //   data = await onTeamCreate({"company_id": localStorage.getItem("companyId"), "name": AddNewTeamName, "manager": localStorage.getItem("userId")});
  //   // const new_team = {id: data['id'],name: data['name'],manager: data['manager'] ,company_id: data['company_id']};
  //   // teamList[data['id']] = new_team
  //   setTeamList((prevTeams) => [
  //     ...prevTeams,
  //     {id: data['id'],name: data['name'],manager: data['manager'] ,company_id: data['company_id']},
  //   ]);
  //   handleNewTeamClose();
  // };
  const AddUserDialog = async () => {
    let data = {}
    if (isManager) {
      data = await onUserCreate({
        "company_id": localStorage.getItem("companyId"), "username": emailChange, "first_name": firstNameChange,
        "last_name": lastNameChange, "password": passwordChange, "is_admin": "true"
      });
    }
    else {
      data = await onUserCreate({
        "company_id": localStorage.getItem("companyId"), "username": emailChange, "first_name": firstNameChange,
        "last_name": lastNameChange, "password": passwordChange, "team_id": teamChange, "role_id": jobDescriptionChange, "is_admin": "false", "color": selectedColor
      });
    }

    const teamName = teamList.find((team) => team.id === teamChange)?.name || "";
    const roleName = RoleList.find((role) => role.id === jobDescriptionChange)?.name || "Manager";
    setRows((prevRows) => [
      ...prevRows,
      { id: data['id'], imageSrc, firstName: firstNameChange, lastName: lastNameChange, jobDescription: roleName, jobDescriptionID: jobDescriptionChange, team: teamName, teamID: teamChange, email: emailChange, isAdmin: isManager.toString() },
    ]);

    setuserList((prevUsers) => [      
      ...prevUsers,
      { id: data['id'], imageSrc, firstName: firstNameChange, lastName: lastNameChange, jobDescription: roleName, jobDescriptionID: jobDescriptionChange, team: teamName, teamID: teamChange, email: emailChange, isAdmin: isManager.toString() },
    ]);

    setDialogOpen(false);
  };


  const FilterBy = (rows: Row[], teamSearch: string, jobDescriptionSearch: string, firstNameSearch: string, lastNameSearch: string) => {
    return rows.filter((row) => {
      const matchFirstName = firstNameSearch === '' || firstNameSearch === row.firstName;
      const matchLastName = lastNameSearch === '' || lastNameSearch === row.lastName;
      const matchTeam = teamSearch === '' || teamSearch === row.team;
      const matchJobDescription = jobDescriptionSearch === '' || jobDescriptionSearch === row.jobDescription;
      return matchFirstName && matchLastName && matchTeam && matchJobDescription;
    });
  };
  const handleSearch = () => {
    const filteredRows = FilterBy(rows, teamSearch, jobDescriptionSearch, firstNameSearch, lastNameSearch);
    setRows(filteredRows);
  };

  const HandleAddNewTeamName = (event: React.ChangeEvent<HTMLInputElement>) => {
    SetAddNewTeamName(event.target.value)
  }

  const HandleAddNewJobDescriptionName = (event: React.ChangeEvent<HTMLInputElement>) => {
    SetAddNewJobDescriptionName(event.target.value)
  }


  const ChangeSearch = (valueSearch: string, subjectSearch: number) => {
    if (subjectSearch === 0) { setFirstNameSearch(valueSearch) }
    if (subjectSearch === 1) { setLastNameSearch(valueSearch) }
    if (subjectSearch === 2) { setJobDescriptionSearch(valueSearch) }
    if (subjectSearch === 3) { setTeamSearch(valueSearch) }
    setshowSearch((prev) => prev.map((search, i) => (i === subjectSearch ? valueSearch ?? '' : search)))
    const filteredRows = FilterBy(userList, teamSearch, jobDescriptionSearch, firstNameSearch, lastNameSearch);
    // setRows(filteredRows);
    // // handleSearch()
  }
  const makeArray = (subjectSearch: number) => {
    if (subjectSearch === 0) { return Array.from(new Set(rows.map((row) => row.firstName))).map((firstName) => firstName) }
    if (subjectSearch === 1) { return Array.from(new Set(rows.map((row) => row.lastName))).map((lastName) => lastName) }
    if (subjectSearch === 2) { return Array.from(new Set(rows.map((row) => row.jobDescription))).map((jobDescription) => jobDescription) }
    if (subjectSearch === 3) { return Array.from(new Set(rows.map((row) => row.team))).map((team) => team) }
    return Array.from(new Set(rows.map((row) => row.team))).map((team) => team)
  }

  const makeLabel = (subjectSearch: number) => {
    if (subjectSearch === 0) { return "First Name" }
    if (subjectSearch === 1) { return "LastName" }
    if (subjectSearch === 2) { return "Role" }
    if (subjectSearch === 3) { return "Team" }
    return "bla"
  }

  return (
    <>
      <div className="custom-line">

        <Box sx={{ backgroundColor: '#FFFFFF', p: 1, borderRadius: 4, width: '88%', display: 'flex', alignItems: 'center' }}>
          {/* the filter */}
          <Grid container alignItems="center">
            <Box sx={{ alignItems: 'self-end', border: '1px solid black', borderRadius: 4, p: 1, display: 'grid', gridAutoFlow: 'column', minWidth: 'max-content', flex: 1 }}>
              <Typography variant="button" color={"primary"} mr={1} sx={{ alignSelf: 'center' }}> Search By: </Typography>
              {range(4).map((index) => (
                <Autocomplete sx={{ mr: 1, minWidth: 'max-content', fontSize: 12 }} style={{ fontSize: 12 }}
                  id={"country-select-demo" + index}
                  value={showSearch[index]}
                  inputValue={showSearch[index]}
                  onInputChange={(event, newInputValue) => {
                    ChangeSearch(newInputValue, index);
                  }}
                  onChange={(event: any, value: string | null) => {
                    if (value) {
                      ChangeSearch(value, index);
                    } else { ChangeSearch("", index); }
                  }}
                  options={makeArray(index)}
                  autoHighlight
                  getOptionLabel={(option: string) => option}
                  renderOption={
                    (props, option) => (
                      <Box style={{ fontSize: 12 }} component="li" {...props}>
                        {option}
                      </Box>
                    )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={makeLabel(index)}
                      size="small"
                      sx={{ py: 0, fontSize: 12, mr: 1, minWidth: 'max-content' }}
                      InputLabelProps={{ style: { fontSize: 12 } }}
                      inputProps={{
                        style: { fontSize: 12 },
                        ...params.inputProps,
                        // autoComplete: 'new-password', // disable autocomplete and autofill
                      }}

                    />
                  )}
                />))}

            </Box>
          </Grid>

          {/* the add part */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
            {/* <Button onClick={handleAddRow} color="primary">Add</Button> */}
            <Button onClick={handleMenuAddOpen} color="primary">Add</Button>

            {/* <Button variant="outlined" size="small" onClick={handleMenuAddOpen}>
          +
        </Button> */}
            <Menu anchorEl={anchorAdd} open={Boolean(anchorAdd)} onClose={handleMenuAddClose}>
              {(localStorage.getItem("teamIds") == "null") && (<MenuItem onClick={() => handleNewTeamOpen()}>New Team</MenuItem>)}
              {(localStorage.getItem("teamIds") == "null") && (<MenuItem onClick={() => handleNewJobDescriptionOpen()}>New Role</MenuItem>)}
              <MenuItem onClick={() => handleAddNewEmployee()}>New Employee</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* the table */}
        <Box borderRadius={8} overflow="hidden" width="90%" position="relative" height="450px">
          <TableContainer component={Paper} style={{ maxHeight: 450, overflow: 'auto', minHeight: 450, width: '100%' }}>
            <Table width="100%">
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: 'center' }}></TableCell>
                  <TableCell style={{ textAlign: 'center' }}>First Name</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Last Name</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Role</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>Team</TableCell>
                  <TableCell style={{ textAlign: 'center' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ display: 'flex', justifyContent: 'center' }}>
                      <UserCircle imageSrc={row.imageSrc} />
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.firstName}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.lastName}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.jobDescription}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.team}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <IconButton onClick={() => handleEditRow(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteRow(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>

      {/* add team dialog */}
      {<Dialog open={NewTeamOpen} onClose={handleNewTeamClose}>
        <DialogTitle>Create Team</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" id="Team Name" label="Team Name" value={AddNewTeamName}
            fullWidth onChange={HandleAddNewTeamName}
          />
          <br />
          <br />
          <div>
            {userList.length > 0 ? (
              <>
                <p>Choose employees to add to the team:</p>
                {Array.from(
                  new Set(userList.map((row) => [row.id, `${row.firstName} ${row.lastName}`, row.isAdmin]))
                ).map((team) => (
                  (team[2] != "false") && (team[0] != localStorage.getItem("userId")) && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={team[0]}
                          checked={NewTeamSelectedEmployees.includes(team[0])}
                          onChange={handleEmployeeChange}
                        />
                      }
                      label={team[1]}
                      key={team[0]}
                    />
                  )
                ))}
              </>
            ) : (<p>No employees available.</p>)}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateNewTeamClose} color="primary">
            Create
          </Button>
          <Button onClick={handleNewTeamClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>}

      {/* add Job dialog */}
      {<Dialog open={NewJobDescriptionOpen} onClose={handleNewJobDescriptionClose}>
        <DialogTitle>Create Job</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" id="JobDescription Name" label="JobDescription Name" value={AddNewJobDescriptionName}
            fullWidth onChange={HandleAddNewJobDescriptionName}
          />
          <br />
          <br />
          <div>
            {userList.length > 0 ? (
              <>
                <p>Choose employees to add to the team:</p>
                {Array.from(
                  new Set(userList.map((row) => `${row.firstName} ${row.lastName}`))
                ).map((team) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={team}
                        checked={NewTeamSelectedEmployees === (team)}
                        onChange={handleEmployeeChange}
                      />
                    }
                    label={team}
                    key={team}
                  />
                ))}
              </>
            ) : (<p>No employees available.</p>)}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateNewJobDescriptionClose} color="primary">
            Create
          </Button>
          <Button onClick={handleNewJobDescriptionClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>}

      {/* add employee dialog */}
      {<Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogMode === 'add' ? 'Add Employee' : `${firstNameChange} ${lastNameChange}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMode === 'add' ? 'Enter the details for the new employee below' : `${firstName} ${lastName}`}</DialogContentText>
          <TextField
            required
            autoFocus margin="dense" id="First Name" label="First Name" value={firstNameChange}
            fullWidth onChange={handleFirstNameChange}
          />
          <TextField
            required
            autoFocus margin="dense" id="Last Name" label="Last Name" value={lastNameChange}
            fullWidth onChange={handleLastNameChange}
          />
          <TextField margin="dense"
            required
            id="Mail Adrress" label="Mail Address" value={emailChange}
            fullWidth onChange={handleEmailChange}
          />
          {dialogMode === 'add' && <div>
            <TextField
              required
              margin="dense"
              id="Password"
              label="Password"
              type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password' type
              value={passwordChange}
              onChange={handlePasswordChange}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      // onClick={handlePassVisibilty}
                      aria-label="toggle password"
                      edge="end"
                      onClick={handleTogglePasswordVisibility}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {error && <FormHelperText error>{error}</FormHelperText>}
          </div>}
          {dialogMode === 'add' && <div>
            <TextField
              required
              margin="dense"
              id="Password"
              label="Password"
              type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password' type
              value={passwordChange2}
              onChange={handlePasswordChange2}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      // onClick={handlePassVisibilty}
                      aria-label="toggle password"
                      edge="end"
                      onClick={handleTogglePasswordVisibility}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>}
          {!isManager && (<FormControl fullWidth margin="dense">
            <InputLabel id="team-select-label">Team</InputLabel>
            <Select
              labelId="team-select-label"
              id="team-select"
              value={teamChange}
              defaultValue={teamChange == '' ? teamChange : teamList[teamChange]}
              onChange={handleTeamChange}
              label="Team"
            >
              {teamList.map((team) => (
                <MenuItem value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>)}
          {!isManager && (<FormControl fullWidth margin="dense">
            <InputLabel id="jobdescription-select-label">Role</InputLabel>
            <Select
              labelId="jobdescription-select-label"
              id="jobdescription-select"
              value={jobDescriptionChange}
              defaultValue={jobDescriptionChange == '' ? jobDescriptionChange : RoleList[jobDescriptionChange]}
              onChange={handleJobDescriptionChange}
              label="jobdescription"
            >
              {RoleList.map((Role) => (
                <MenuItem value={Role.id}>
                  {Role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>)}
          <div className="custom-row">
            <div className="switch-container" onClick={handleSwitchChange}>
              <div className={`switch ${isManager ? 'manager' : 'employee'}`}>
                <span>{isManager ? 'Manager' : 'Employee'}</span>
              </div>
            </div>
            {!isManager && (<button onClick={toggleColorPicker}>Pick a Color</button>)}
            {showColorPicker && (
              <div className="color-picker-container">
                <div className="color-picker-backdrop" onClick={toggleColorPicker} />
                <div className="color-picker-modal">
                  <ChromePicker color={selectedColor} onChange={handleColorChange} />
                  <button onClick={handleSaveColor}>Save</button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveRow} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>}
    </>
  );



};



function MainTeam(): JSX.Element {
  return (
    <Layout PageName="Team" component={Team} />
  );
}

export default MainTeam;


