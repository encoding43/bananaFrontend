import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth.jsx';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance.ts';
import { toast } from 'sonner';
import moment from 'moment';

export default function AddReceivingPaymentModal({ openAddModal, setOpenAddModal, AddPaymentData, fetchData }) {
    console.log("AddPaymentData" , AddPaymentData);
    
    const { token } = useAuth();

    const handleClose = () => {
        setOpenAddModal(false);
    };

    const validationSchema = Yup.object({
        date: Yup.date().required('Date is required').nullable(),
        year: Yup.string().required('Year is required'), // Add year validation
    });


    const getExeptionFarmers = async (values, resetForm) => {
        console.log("valuesvalues" , values);
        
        const payload = {
            salaryId: AddPaymentData._id,
            date: values.date,
            mark: values.year,
        };
        try {
            const res = await postAPIAuth(
                `Supplier/addMark`,
                payload,
                token,
            );

            if (res?.status === 200) {
                toast.success(res.data.message);
                fetchData();
                resetForm();
                setOpenAddModal(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const formik = useFormik({
        initialValues: {
            date: moment(AddPaymentData?.scheduleDate).format('YYYY-MM-DD') || '',
            year: '', // Initialize year in Formik's initial values
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            getExeptionFarmers(values, resetForm);
        },
        enableReinitialize: true,
    });

    return (
        <Dialog open={openAddModal} onClose={handleClose} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle>
                Mark Attendance
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
    <Box className="flex flex-col gap-3">
        {/* Date input field */}
        <Box className="w-full">
            <TextField
                label="Date"
                variant="outlined"
                size="small"
                fullWidth
                type="date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputLabelProps={{ shrink: true }}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
            />
        </Box>
    </Box>

    <Box className="flex flex-col gap-3 mt-4">
        <Box className="w-full">
            <Typography variant="p" className='text-black'>Attendance Status</Typography>
            <Select
                name="year"
                value={formik.values.year}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                    bgcolor: 'white',
                    color: 'black',
                    marginTop: '8px',
                }}
                error={formik.touched.year && Boolean(formik.errors.year)}
                helperText={formik.touched.year && formik.errors.year}
            >
                <MenuItem value={"P"}>Present</MenuItem>
                <MenuItem value={"PH"}>Halfday</MenuItem>
                <MenuItem value={"A"}>Absent</MenuItem>
            </Select>
        </Box>
    </Box>
</DialogContent>

                <DialogActions>
                    <div className="flex w-[100%] gap-3 justify-center">
                        <button
                            type="submit"
                            className="inline-flex w-full max-w-[190px] m-0 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-center font-medium text-white hover:bg-opacity-90"
                        >
                            Save
                        </button>
                    </div>
                </DialogActions>
            </form>
        </Dialog>
    );
}
