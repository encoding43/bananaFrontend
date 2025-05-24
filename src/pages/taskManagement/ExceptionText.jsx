import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth.jsx';
import { postAPIAuth, postAPIAuthFormData } from '../../service/apiInstance.ts';
import { toast, Toaster } from 'sonner';
// import {postAPIAuthFormData}  from '../../service/apiInstance.js';

export default function AddExceptionModal({ openAddModal, setOpenAddModal, editHarvestingdata, getFarmers }) {
    console.log("editHarvestingdata" , editHarvestingdata);
    
    const { token } = useAuth();

    const handleClose = () => {
        setOpenAddModal(false);
    };

    const validationSchema = Yup.object({
        exceptionDetails: Yup.string().trim().required('Exception details are required'),
    });

    const getExeptionFarmers = async(values , resetForm ) => {

        // alert("ji")

        console.log("values , resetForm" , values);

        const param = {
            "note" : values.exceptionDetails , 
            "id" : editHarvestingdata._id
        }

        try {
            const res = await postAPIAuth(`task/updateNoteTask`, param);

        console.log("resresresres" , res);
        if(res.data.success){
            toast.success(res.data.message);
            resetForm();
            setOpenAddModal(false);
            getFarmers();
        }

        } catch (error) {
            console.log("eorrorr" , error);   
        }
    }

    const formik = useFormik({
        initialValues: {
            exceptionDetails: editHarvestingdata?.note || '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            console.log('Form data', values);
            getExeptionFarmers(values, resetForm);
          },
          enableReinitialize : true
    });

    return (
        <Dialog open={openAddModal} onClose={handleClose} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle>
                Note
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
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <TextField
                        id="exceptionDetails"
                        name="exceptionDetails"
                        label="Exception Details"
                        multiline
                        rows={4}
                        fullWidth
                        value={formik.values.exceptionDetails}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.exceptionDetails && Boolean(formik.errors.exceptionDetails)}
                        helperText={formik.touched.exceptionDetails && formik.errors.exceptionDetails}
                    />
                </DialogContent>
                <DialogActions>
                     <button type="submit" className="flex w-full mx-auto max-w-[250px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">Save</button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
