import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Box, Chip, IconButton, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';


export default function AddVichelsFarmerModal({openAddModal, setOpenAddModal}) {

  const handleClose = () => {
    setOpenAddModal(false);
  };

  



  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}

      >
        <DialogTitle>Add Labor</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                New Labor Name
              </label>
              <input type="text" placeholder="Default Input" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Labor Mobile Number
              </label>
              <input type="text" placeholder="Default Input" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                New Team Contractor
              </label>
              <input type="text" placeholder="Default Input" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Contractor Mobile 
              </label>
              <input type="text" placeholder="Default Input" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
            </div>

          </div>
        </DialogContent>
        <DialogActions sx={{paddingInline: '20px'}}>
          <button className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">Add Labor</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
