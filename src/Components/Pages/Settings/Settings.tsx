import Layout from "../../LayoutArea/Layout/Layout";

import React, { useState } from 'react';
import {Checkbox,Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
IconButton,Button,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,TextField,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';


const Settings = () => {
  return (
    <h6>settings</h6>
  );
};



function MainSettings(): JSX.Element {
  return (
    <Layout PageName="Settings" component={Settings}/>  
  );
}

export default MainSettings;
