import Layout from "../../LayoutArea/Layout/Layout";
import UserPic from "./UserCircle/NoPhotoUser.png"
import {TeamInfo} from "../../../actions/apiActions"
import "./Team.css"
import React, { ChangeEvent, useEffect, useState } from 'react';
import {MenuItem,Checkbox,Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Switch, FormControlLabel
,IconButton,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,TextField, Button, FormControl, InputLabel, Select,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Email } from '@mui/icons-material';
import UserCircle from "./UserCircle/UserCircle";
import { alignProperty } from "@mui/material/styles/cssUtils";
import SearchBar from './SearchBar/SearchBar'


interface Row {
  id: number;
  imageSrc: string;
  name: string;
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


const Team = () => {

  const [teamlist, setTeamlist] = useState<Row[]>([]);
  const [rows, setRows] = useState(teamlist);
  const [name, setName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [team, setTeam] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageSrc, setimageSrc] = useState<string>('');
  const [isManager, setIsManager] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [filterJobDescription, setFilterJobDescription] = useState<string>('All');
  const [searchText, setSearchText] = useState<string>('');
  const [showSearchBar, setSearchBar] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [jobDescriptionSearch, setJobDescriptionSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [nameList, setNameList] = useState([]);
  const [jobDescriptionList, setJobDescriptionList] = useState([]);
  const [teamsList, setTeamList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await TeamInfo();
      const items = result.employee.map((item, index) => {
        return {
          ...item,
          id: index + 1,
          imageSrc: UserPic,
          name: item.name + " " + item.lastName,
        };
      });
      const names = result.employee.map((item, index) => {
        return {
          id: index + 1,
          name: item.name + " " + item.name,
        };
      });
      const teams = result.employee.map((item, index) => {
        return {
          id: index + 1,
          team: item.team,
        };
      });
      const jobDescriptions = result.employee.map((item, index) => {
        return {
          id: index + 1,
          jobDescription: item.jobDescription,
        };
      });
      setTeamlist(items);
      setRows(items);
      setNameList(names);
      setTeamList(teams);
      setJobDescription(jobDescriptions)
    }
    fetchData()
  }, []);

  useEffect(() => {
    const filteredRows = teamlist.filter((row) =>
      (filterJobDescription === 'All' || row.jobDescription === filterJobDescription) &&
      (searchText === '' || row.name.toLowerCase().includes(searchText.toLowerCase()))
    );
    setRows(filteredRows);
    setSelectedRows([]);
  }, [teamlist, filterJobDescription, searchText]);

  const handleSwitchChange = () => {
    setIsManager(!isManager);
    // onRoleChange(event.target.checked);
  };

  const handleShowBar = () => {
    setSearchBar(true);
  };

  const handleAddRow = () => {
    setDialogMode('add');
    setName('');
    setJobDescription('');
    setimageSrc(UserPic)
    setDialogOpen(true);
  };

  const handleEditRow = (row: typeof teamlist[0]) => {
    setDialogMode('edit');
    setName(row.name);
    setJobDescription(row.jobDescription);
    setSelectedRowId(row.id);
    setimageSrc(row.imageSrc);
    setDialogOpen(true);
  };

  const handleDeleteRow = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleJobDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJobDescription(event.target.value);
  };

  
  const handleTeamChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTeam(event.target.value);
  };
  
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
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

  const handleSaveRow = () => {
    if (dialogMode === 'add') {
      setRows((prevRows) => [
        ...prevRows,
        {id: Date.now(),imageSrc,name,jobDescription,team},
      ]);
    } 
    setDialogOpen(false);
  };


  const FilterBy = (rows: Row[], teamSearch: string, jobDescriptionSearch: string, nameSearch: string) => {
    return rows.filter((row) => {
      if (teamSearch === "" && nameSearch === "" && row.jobDescription === jobDescriptionSearch) {
        return true;
      }
      if (jobDescriptionSearch === "" && row.team === teamSearch) {
        return true;
      }
      if (jobDescriptionSearch === row.jobDescription && row.team === teamSearch) {
        return true;
      }
      if (jobDescriptionSearch === "" && teamSearch === "") {
        return true;
      }
      return false;
    });
  };
  const handleSearch = () => {
    const filteredRows = FilterBy(teamlist, teamSearch, jobDescriptionSearch,nameSearch);
    setRows(filteredRows);
  };

  return (
    <>
    <div className="custom-line">
    <Box sx={{ backgroundColor: '#FFFFFF', p: 0 , maxWidth: 'fit-content'}}>
      <TextField
          label="Name Search"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          variant="outlined"
          InputLabelProps={{ style: { fontSize: 12 } }}
          inputProps={{ style: { fontSize: 12 } }}          
          sx={{ py: 0, fontSize: 12 }} size="small"
        />
        <FormControl variant="outlined" sx={{ mr: 2 ,minWidth: 120, py: 0}}  size="small">
          <InputLabel id="team-select-label" sx={{ fontSize: 12 }}>Team</InputLabel>
          <Select
            labelId="team-select-label"
            value={teamSearch}
            onChange={(e) => setTeamSearch(e.target.value as string)}
            label="Team"
            size="small"
            sx={{ p: 0, fontSize: 12 }}
          >
            <MenuItem value="">None</MenuItem>
            {teamlist.map((row) => (<MenuItem value={row.team}>{row.team}</MenuItem>))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ mr: 2 ,minWidth: 200, py: 0}} size="small">
          <InputLabel id="job-description-select-label" sx={{ fontSize: 12 }}>Job Description</InputLabel>
          <Select
            labelId="job-description-select-label"
            value={jobDescriptionSearch}
            onChange={(e) => setJobDescriptionSearch(e.target.value as string)}
            label="Job Description"
            size="small"
            sx={{ p: 0, fontSize: 12 }}
          >
            <MenuItem value="">None</MenuItem>
            {teamlist.map((row) => (<MenuItem value={row.jobDescription}>{row.jobDescription}</MenuItem>))}
          </Select>
        </FormControl>
        <button onClick={handleSearch}>Search</button>
    </Box>
      <Box borderRadius={8} overflow="hidden" width="90%" position="relative" height="450px">
        <TableContainer component={Paper} style={{ maxHeight: 450, overflow: 'auto', minHeight: 450, width: '100%' }}>
          <Table width="100%">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Job Description</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {FilterBy(teamlist, teamSearch, jobDescriptionSearch, nameSearch)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ display: 'flex', justifyContent: 'center' }}>
                      <UserCircle imageSrc={row.imageSrc} />
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.name}</TableCell>
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
      {dialogOpen && <Dialog open={true} onClose={handleDialogClose}>
        <DialogTitle>{dialogMode === 'add' ? 'Add Employee' : name }</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogMode === 'add' ? 'Enter the details for the new employee below' : name }</DialogContentText>
            <TextField
              autoFocus margin="dense" id="First Name" label="First Name" value={name}
              fullWidth onChange={handleNameChange}
            />
            <TextField
              autoFocus margin="dense" id="Last Name" label="Last Name" value={name}
              fullWidth onChange={handleNameChange}
            />
            <TextField margin="dense" 
              id="Mail Adrress" label="Mail Address" value={email} 
              fullWidth onChange={handleEmailChange}
              />
            <TextField margin="dense" 
              id="Password" label="Password" value={password} 
              fullWidth onChange={handlePasswordChange}
              />
            <TextField margin="dense" 
              id="jobDescription" label="Job Description" value={jobDescription} 
              fullWidth onChange={handleJobDescriptionChange}
              />
          <div className="custom-row">
            <div className="switch-container" onClick={handleSwitchChange}>
              <div className={`switch ${isManager ? 'manager' : 'employee'}`}>
                <span>{isManager ? 'Manager' : 'Employee'}</span>
              </div>
            </div>
            <select className="select-dropdown" onChange={handleTeamChange}>
              {teamNames.map((option, index) => (
                <option onMouseEnter={() => {}} key={index} value={option}>
                  {option}
                </option>
              ))}
            </select> 
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
