import Layout from "../../LayoutArea/Layout/Layout";

import React, { useState } from 'react';
import {Checkbox,Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
IconButton,Button,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,TextField,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const initialRows = [
  { id: 1, name: 'John Doe', jobDescription: 'Software Developer' },
  { id: 2, name: 'Jane Smith', jobDescription: 'Project Manager' },
  { id: 3, name: 'Bob Johnson', jobDescription: 'Graphic Designer' },
];

const Team = () => {
  const [rows, setRows] = useState(initialRows);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [name, setName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const handleAddRow = () => {
    setDialogMode('add');
    setName('');
    setJobDescription('');
    setDialogOpen(true);
  };

  const handleEditRow = (row: typeof initialRows[0]) => {
    setDialogMode('edit');
    setName(row.name);
    setJobDescription(row.jobDescription);
    setSelectedRowId(row.id);
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
      <Button variant="outlined" onClick={handleAddRow}>
        Add Row
      </Button>
      {/* <Box borderRadius={8} overflow="hidden" width="80%" position="absolute" top="20%" left="15%" > */}
      <Box borderRadius={8} overflow="hidden" width="80%" position="relative" height="400px" >
      <TableContainer component={Paper} style={{maxHeight: 400, overflow: 'auto'}}>
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
                <TableCell padding="checkbox">
                  <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                  checked={selectedRows.length === rows.length}
                  onChange={() =>
                    selectedRows.length === rows.length
                      ? setSelectedRows([])
                      : setSelectedRows(rows.map((row) => row.id))
                  }
                />
              </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.jobDescription}</TableCell>
                <TableCell>
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
