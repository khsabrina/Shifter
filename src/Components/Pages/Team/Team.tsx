import Layout from "../../LayoutArea/Layout/Layout";
import UserPic from "./UserCircle/NoPhotoUser.png"
import {TeamInfo} from "../../../actions/apiActions"
import "./Team.css"
import React, { ChangeEvent, useEffect, useState } from 'react';
import {Checkbox,Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Switch, FormControlLabel
,IconButton,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,TextField, Button,
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
  useEffect(() => {
    async function fetchData() {
      const result = await TeamInfo();
      const items = result.employee.map((item, index) => {
        return {
          ...item,
          id: index + 1,
          imageSrc: UserPic
        };
      });
      setTeamlist(items);
      setRows(items)
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
        {id: Date.now(),imageSrc,name,jobDescription},
      ]);
    } 
    setDialogOpen(false);
  };

  return (
    <>
      <Box mt={2} display="flex" alignItems="center">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          style={{ marginRight: 'auto' }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="outlined" style={{ marginLeft: 8 }} onClick={handleShowBar}>
          change 
          {/* {showSearchBar && <SearchBar filters={filters} onChange={handleFilterChange} />} */}
          {showSearchBar && <SearchBar data={data} teamNames={teamNames} />}

        </Button>
        <Button variant="outlined" style={{ marginLeft: 8 }} onClick={handleAddRow}>
          Add
        </Button>
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
              {rows
                .filter(row => {
                  if (!searchText) return true;
                  const nameMatches = row.name.toLowerCase().includes(searchText.toLowerCase());
                  const jobDescMatches = row.jobDescription.toLowerCase().includes(searchText.toLowerCase());
                  return nameMatches || jobDescMatches;
                })
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ display: 'flex', justifyContent: 'center' }}>
                      <UserCircle imageSrc={row.imageSrc} />
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.name}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.jobDescription}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Noc Team</TableCell>
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
                <option key={index} value={option}>
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
