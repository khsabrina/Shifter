import Layout from "../../LayoutArea/Layout/Layout";
import UserPic from "./UserCircle/NoPhotoUser.png"
import {TeamInfo, getUser, CreateTeam, getTeam, getRole, getAllUserTeam, CreateRole, getAllRoles, CreateUser} from "../../../actions/apiActions"
import "./Team.css"
import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import {Typography,Autocomplete,MenuItem,Checkbox,Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Switch, FormControlLabel
,IconButton,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,TextField, Button, FormControl, InputLabel, Select, Grid, Menu, SelectChangeEvent, MenuItemProps,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Email, Rowing, Rule } from '@mui/icons-material';
import UserCircle from "./UserCircle/UserCircle";
import { alignProperty } from "@mui/material/styles/cssUtils";
import SearchBar from './SearchBar/SearchBar'
import { range } from "lodash";
import auth from "../../auth/auth";



interface Row {
  id: number;
  imageSrc: string;
  firstName: string;
  lastName: string;
  jobDescription: string;
  team: string;
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
  id: string
  company_id: string;
  name: string;
  manager : string;
}

interface Role {
  id: string
  name: string;
  description : string;
  company_id: string;
}


const Team = () => {

  const [userList, setuserList] = useState<Row[]>([]);
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [RoleList, setRoleList] = useState<Role[]>([]);

  const [rows, setRows] = useState<Row[]>(userList);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [team, setTeam] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageSrc, setimageSrc] = useState<string>('');
  const [isManager, setIsManager] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [firstNameSearch, setFirstNameSearch] = useState('');
  const [lastNameSearch, setLastNameSearch] = useState('');
  const [jobDescriptionSearch, setJobDescriptionSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [showSearch, setshowSearch] = useState([firstNameSearch,lastNameSearch,jobDescriptionSearch,teamSearch]);
  const [anchorAdd, setAnchorAdd] = useState(null); // State for anchor element of the menu
  const [NewTeamOpen, setNewTeamOpen] = useState(false);
  const [NewJobDescriptionOpen, setNewJobDescriptionOpen] = useState(false);

  const [AddNewTeamName, SetAddNewTeamName] = useState("");
  const [AddNewJobDescriptionName, SetAddNewJobDescriptionName] = useState("");

  const [NewTeamSelectedEmployees, SetNewTeamSelectedEmployees] = useState<string[]>([]);

  const [firstNameChange, setFirstNameChange] = useState('');
  const [lastNameChange, setLastNameChange] = useState('');
  const [jobDescriptionChange, setJobDescriptionChange] = useState<string>('');
  const [teamChange, setTeamChange] = useState<string>('');
  const [emailChange, setEmailChange] = useState<string>('');
  const [passwordChange, setPasswordChange] = useState('');

  

  useEffect(() => {
    console.log(rows);
  }, [rows]);
  
  useEffect(() => {
    let isMounted = true;
  
    async function fetchData() {
      try {
        const [result, teamListResult, roleListResult] = await Promise.all([
          TeamInfo(),
          getAllUserTeam(),
          getAllRoles(),
        ]);
  
        const Tlist = teamListResult.reduce((acc, team) => {
          if (team.name !== "") {
            acc[team.id] = team;
          }
          return acc;
        }, []);
  
        const Rlist = roleListResult.reduce((acc, role) => {
          if (role.name !== "") {
            acc[role.id] = role;
          }
          return acc;
        }, []);
  
        if (isMounted) {
          setTeamList(Tlist);
          setRoleList(Rlist)
          const items = await Promise.all(
            result.map(async (item) => {
              return {
                id: item.id,
                firstName: item.first_name,
                lastName: item.last_name,
                team: Tlist[item.team_id].name,
                jobDescription: Rlist[item.role_id].name,
                imageSrc: UserPic,
              };
            })
          );
  
          setuserList(items);
          console.log("here4444444");
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
    const filteredRows = FilterBy(userList, teamSearch, jobDescriptionSearch, firstNameSearch, lastNameSearch);
    setRows(filteredRows);
  }, [userList, teamSearch, jobDescriptionSearch, firstNameSearch, lastNameSearch]);
    const handleSwitchChange = () => {
      setIsManager(!isManager);
    // onRoleChange(event.target.checked);
  };


  const handleEmployeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      SetNewTeamSelectedEmployees((prevSelectedEmployees) => [
        ...prevSelectedEmployees,
        value
      ]);
    } else {
      SetNewTeamSelectedEmployees((prevSelectedEmployees) =>
        prevSelectedEmployees.filter((employee) => employee !== value)
      );
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
        await CreateTeam(data);
      }
  };

  const onUserCreate = async (data: {}) => {
    if (auth.isAuthenticated() === true) {
      await CreateUser(data);
    }
};

  const onJobDescriptionCreate = async (data: {}) => {
    if (auth.isAuthenticated() === true) {
      await CreateRole(data);
    }
};

  const handleNewTeamClose = () => {
    setNewTeamOpen(false);
  };

  const handleNewJobDescriptionClose = () => {
    setNewJobDescriptionOpen(false);
  };
  const handleCreateNewTeamClose = () => {
    onTeamCreate({"company_id": localStorage.getItem("companyId"), "name": AddNewTeamName, "manager": localStorage.getItem("userId")});
    handleNewTeamClose()
  };

  const handleCreateNewJobDescriptionClose = () => {
    onJobDescriptionCreate({"company_id": localStorage.getItem("companyId"), "name": AddNewJobDescriptionName});
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
    setFirstName('');
    setLastName('');
    setJobDescription('');
    setimageSrc(UserPic)
    setDialogOpen(true);
    handleMenuAddClose();
  };

  const handleEditRow = (row: typeof userList[0]) => {
    setDialogMode('edit');
    setFirstName(row.firstName);
    setLastName(row.lastName);
    setJobDescription(row.jobDescription);
    setSelectedRowId(row.id);
    setimageSrc(row.imageSrc);
    setDialogOpen(true);
  };

  const handleDeleteRow = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    const deleteRow: Row[] = userList.filter((team) => team.id !== id);
    setuserList(deleteRow);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordChange(event.target.value);
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
        console.log(imgSrc)
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
    if (dialogMode === 'add') {
      // const handleCreateNewTeamClose = () => {
      //   const newUser : NewUser = {company_id: localStorage.getItem("companyId"), name: AddNewTeamName, manager: localStorage.getItem("userId")}
      //   onNewUserCreate(newUser);
      //   handleNewTeamClose()
      // };
      if (isManager){
        onUserCreate({"company_id": localStorage.getItem("companyId"), "username": emailChange, "first_name": firstNameChange, 
        "last_name": lastNameChange, "password" : passwordChange, "team_id":teamChange,"role_id":jobDescriptionChange});
      }
      else {
        onUserCreate({"company_id": localStorage.getItem("companyId"), "username": emailChange, "first_name": firstNameChange, 
        "last_name": lastNameChange, "password" : passwordChange, "team_id":teamChange,"role_id":jobDescriptionChange ,"is_admin" : "false"});
      }
      setRows((prevRows) => [
        ...prevRows,
        {id: Date.now(),imageSrc,firstName,lastName,jobDescription,team},
      ]);
      setuserList((prevuserList) => [
        ...prevuserList,
        {id: Date.now(),imageSrc,firstName,lastName,jobDescription,team},
      ]);
      
    } 
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
    const filteredRows = FilterBy(userList, teamSearch, jobDescriptionSearch,firstNameSearch,lastNameSearch);
    setRows(filteredRows);
  };

  const HandleAddNewTeamName = (event: React.ChangeEvent<HTMLInputElement>) => {
    SetAddNewTeamName(event.target.value)
  }

  const HandleAddNewJobDescriptionName = (event: React.ChangeEvent<HTMLInputElement>) => {
    SetAddNewJobDescriptionName(event.target.value)
  }


  const ChangeSearch = (valueSearch: string ,subjectSearch: number ) =>{
    if (subjectSearch === 0) {setFirstNameSearch(valueSearch)}
    if (subjectSearch === 1) {setLastNameSearch(valueSearch)}
    if (subjectSearch === 2) {setJobDescriptionSearch(valueSearch)}
    if (subjectSearch === 3) {setTeamSearch(valueSearch)}
    setshowSearch((prev) => prev.map((search, i) => (i === subjectSearch ? valueSearch ?? '' : search)))
    const filteredRows = FilterBy(userList, teamSearch, jobDescriptionSearch,firstNameSearch,lastNameSearch);
    // setRows(filteredRows);
    // // handleSearch()
  }
  const makeArray =(subjectSearch: number)=>{
    if (subjectSearch === 0) {return Array.from(new Set(rows.map((row) => row.firstName))).map((firstName) => firstName)}
    if (subjectSearch === 1) {return Array.from(new Set(rows.map((row) => row.lastName))).map((lastName) => lastName)}
    if (subjectSearch === 2) {return Array.from(new Set(rows.map((row) => row.jobDescription))).map((jobDescription) => jobDescription)}
    if (subjectSearch === 3) {return Array.from(new Set(rows.map((row) => row.team))).map((team) => team)}
    return Array.from(new Set(rows.map((row) => row.team))).map((team) => team)}

  const makeLabel =(subjectSearch: number)=>{
    if (subjectSearch === 0) {return "First Name"}
    if (subjectSearch === 1) {return "LastName"}
    if (subjectSearch === 2) {return "Job Description"}
    if (subjectSearch === 3) {return "Team"}
    return "bla"}

  return (
    <>
    <div className="custom-line">
    
    <Box sx={{ backgroundColor: '#FFFFFF', p: 1, borderRadius: 4, width: '88%', display: 'flex', alignItems: 'center' }}>
    {/* the filter */}
    <Grid container alignItems="center">
      <Box sx={{alignItems: 'self-end', border: '1px solid black', borderRadius: 4, p: 1, display: 'grid' , gridAutoFlow: 'column',minWidth: 'max-content', flex: 1 }}>
        <Typography variant="button" color={"primary"} mr= {1} sx ={{alignSelf: 'center'}}> Search By: </Typography>       
          {range(4).map((index) => (
          <Autocomplete sx={{ mr: 1, minWidth: 'max-content', fontSize:12 }} style= {{ fontSize: 12 }}
          id={"country-select-demo" + index}
          value={showSearch[index]}
          inputValue={showSearch[index]}
          onInputChange={(event, newInputValue) => {
            ChangeSearch(newInputValue, index);
          }}
          onChange={(event: any,value: string | null) => {  if (value) {ChangeSearch(value, index);
          } else {ChangeSearch("", index);}}}
          options = {makeArray(index)}
          autoHighlight
          getOptionLabel={(option: string) => option}
          renderOption={
            (props, option) => (
            <Box style= {{ fontSize: 12 }} component="li" {...props}>
              {option}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={makeLabel(index)}
              size="small"
              sx={{ py: 0, fontSize: 12, mr: 1 ,minWidth: 'max-content'}}
              InputLabelProps={{ style: { fontSize: 12 } }}      
              inputProps={ {  style: { fontSize: 12 } ,
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
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
          <MenuItem onClick={() => handleNewTeamOpen()}>New Team</MenuItem>
          <MenuItem onClick={() => handleNewJobDescriptionOpen()}>New Job Description</MenuItem>
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
              <TableCell style={{ textAlign: 'center' }}>Job Description</TableCell>
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
                new Set(userList.map((row) => `${row.firstName} ${row.lastName}`))
              ).map((team) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      value={team}
                      checked={NewTeamSelectedEmployees.includes(team)}
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
                      checked={NewTeamSelectedEmployees.includes(team)}
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
      <DialogTitle>{dialogMode === 'add' ? 'Add Employee' : `${firstName} ${lastName}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMode === 'add' ? 'Enter the details for the new employee below' :`${firstName} ${lastName}` }</DialogContentText>
          <TextField
            autoFocus margin="dense" id="First Name" label="First Name" value={firstNameChange}
            fullWidth onChange={handleFirstNameChange}
          />
          <TextField
            autoFocus margin="dense" id="Last Name" label="Last Name" value={lastNameChange}
            fullWidth onChange={handleLastNameChange}
          />
          <TextField margin="dense" 
            id="Mail Adrress" label="Mail Address" value={emailChange} 
            fullWidth onChange={handleEmailChange}
            />
          <TextField margin="dense" 
            id="Password" label="Password" value={passwordChange} 
            fullWidth onChange={handlePasswordChange}
            />
      <FormControl fullWidth margin="dense">
        <InputLabel id="team-select-label">Team</InputLabel>
        <Select
          labelId="team-select-label"
          id="team-select"
          value={teamChange}
          onChange={handleTeamChange}
          label="Team"
        >
          {teamList.map((team) => (
            <MenuItem value={team.id}>
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="dense">
        <InputLabel id="jobdescription-select-label">Job Description</InputLabel>
        <Select
          labelId="jobdescription-select-label"
          id="jobdescription-select"
          value={jobDescriptionChange}
          onChange={handleJobDescriptionChange}
          label="Team"
        >
        {RoleList.map((Role) => (
          <MenuItem key={Role.id} value={Role.id}>
            {Role.name}
          </MenuItem>
        ))}
        </Select>
      </FormControl>
        <div className="custom-row">
          <div className="switch-container" onClick={handleSwitchChange}>
            <div className={`switch ${isManager ? 'manager' : 'employee'}`}>
              <span>{isManager ? 'Manager' : 'Employee'}</span>
            </div>
          </div>
          {/* <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={handleTeamChange}
          label="Age"
          onChange={handleTeamChange}
        >
          {Array.from(new Set(userList.map((row) => row.team))).map((team ,index) => (
              <MenuItem value={team}>{team}</MenuItem>
          ))}
        </Select>
      </FormControl> */}
          <input type="file" accept="image/*" onChange={handleFileSelect} />
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
    <Layout PageName="Team" component={Team}/>  
  );
}

export default MainTeam;


