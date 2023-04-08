import Layout from "../../LayoutArea/Layout/Layout";

import React, { useState } from 'react';
import {Checkbox,Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
IconButton,Button,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,TextField,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';


const Prioritizer = () => {
  return (
    <h6>Prioritizer</h6>
  );
};



function MainPrioritizer(): JSX.Element {
  return (
    <Layout PageName="Prioritizer" component={Prioritizer}/>  
  );
}

export default MainPrioritizer;