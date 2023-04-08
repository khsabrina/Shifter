import Layout from "../../LayoutArea/Layout/Layout";

import React, { useState } from 'react';
import {Checkbox,Box,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
IconButton,Button,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,TextField,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';


const Home = () => {
  return (
    <h6>Home</h6>
  );
};



function MainHome(): JSX.Element {
  return (
    <Layout PageName="Home" component={Home}/>  
  );
}

export default MainHome;