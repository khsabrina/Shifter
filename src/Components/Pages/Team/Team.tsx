import Layout from "../../LayoutArea/Layout/Layout";
import UserPic from "./UserCircle/NoPhotoUser.png"
// import TeamInfo from "../../../actions/apiActions/TeamInfo"

import React, { useState } from 'react';
import {Checkbox,Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
IconButton,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,TextField, Button,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import UserCircle from "./UserCircle/UserCircle";
import { alignProperty } from "@mui/material/styles/cssUtils";

const initialRows = [
  
  { id: 1, imageSrc: UserPic, name: 'John Doe', jobDescription: 'Software Developer' },
  { id: 2, imageSrc: UserPic, name: 'Jane Smith', jobDescription: 'Project Manager' },
  { id: 3, imageSrc: UserPic, name: 'Bob Johnson', jobDescription: 'Graphic Designer' },
];

const Team = () => {
  const [rows, setRows] = useState(initialRows);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [name, setName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [imageSrc, setimageSrc] = useState<string>('');
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

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

  const handleAddRow = () => {
    setDialogMode('add');
    setName('');
    setJobDescription('');
    setimageSrc(UserPic)
    setDialogOpen(true);
  };

  const handleEditRow = (row: typeof initialRows[0]) => {
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

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleJobDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJobDescription(event.target.value);
  };

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleRowSelect = (id: number) => {
    const isSelected = selectedRows.includes(id);
    setSelectedRows(
      isSelected ? selectedRows.filter((rowId) => rowId !== id) : [...selectedRows, id]
    );
  };

  const handleSaveRow = () => {
    if (dialogMode === 'add') {
      setRows((prevRows) => [
        ...prevRows,
        {
          id: Date.now(),
          imageSrc,
          name,
          jobDescription,
        },
      ]);
    } else if (selectedRowId) {
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (row.id === selectedRowId) {
            return {
              ...row,
              imageSrc,
              name,
              jobDescription,
            };
          }
          return row;
        })
      );
    }
    setDialogOpen(false);
  };

  return (
    <>
      {/* <Box borderRadius={8} overflow="hidden" width="80%" position="absolute" top="20%" left="15%" > */}
      <Box borderRadius={8} overflow="hidden" width="90%" position="relative" height="450px"  >
      <TableContainer component={Paper} style={{maxHeight: 450, overflow: 'auto',minHeight: 450,width:'100%'}}>
        <Table width="100%">
          {/* <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Job Description</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead> */}
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{display:'flex' ,justifyContent:'center'}}><UserCircle imageSrc={row.imageSrc} /></TableCell>
                <TableCell style={{textAlign:'center'}}>{row.name}</TableCell>
                <TableCell style={{textAlign:'center'}}>{row.jobDescription}</TableCell>
                <TableCell style={{textAlign:'center'}}>
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
      <Button variant="outlined" style={{position: 'absolute', bottom: 16, right: 16, font: 'icon', color: 'black', borderColor: 'black'}}  onClick={handleAddRow}>
        Add
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogMode === 'add' ? 'Add Row' : 'Edit Row'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the details for the new row below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            value={name}
            onChange={handleNameChange}
          />
          <TextField
            margin="dense"
            id="jobDescription"
            label="Job Description"
            fullWidth
            value={jobDescription}
            onChange={handleJobDescriptionChange}
          />
          <input type="file" accept="image/*" onChange={handleFileSelect} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveRow} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};



function MainTeam(): JSX.Element {
  return (
    <Layout PageName="Team" component={Team}/>  
  );
}

export default MainTeam;
