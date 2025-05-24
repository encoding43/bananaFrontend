import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { postAPIAuthFormData } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function AddDailyWeightModal({
  openAddModal, setOpenAddModal, editFarmerData, setEditFarmerData, updateData
}) {
  const handleClose = () => {
    setOpenAddModal(false);
    setEditFarmerData(null);
  };
   console.log({editFarmerData})
  const initialValues = {
    type: 'dailyWeight',
    weight: editFarmerData?.weight || '',
    charge: editFarmerData?.charge || '',
    distance: editFarmerData?.distance || '',
    images: [],
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      weight: Yup.number().required('Weight in kg is required'),
      charge: Yup.number().required('Charge is required'),
      distance: Yup.number().required('Distance is required'),
      images: Yup.mixed(),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('type', values?.type);
      formData.append('weight', values?.weight);
      formData.append('charge', values?.charge);
      formData.append('distance', values?.distance);
      formData.append('typeName', 'transport'); 
      formData.append('harvestingId',editFarmerData?.harvestingId ); 
      if (editFarmerData) {
        formData.append('supplierId', editFarmerData?.supplierId || '');
      }
      

      {
        values.images?.length && 
        Array.from(values.images).forEach((file) => {
          formData.append('images', file); 
        });
      }

      try {
        let res;
        if (editFarmerData) {
          formData.append('id', editFarmerData?._id);
          res = await postAPIAuthFormData(`transport/editTransportDetail`, formData);
        } else {
          res = await postAPIAuthFormData(`transport/addTransportDetail`, formData);
        }
        if (res?.data?.status === 200) {
          toast.success(editFarmerData ? 'Weight updated successfully!' : 'Weight added successfully!');
          handleClose();
          updateData();
          resetForm();
        } else {
          toast.error(res?.data?.message);
        }
      } catch (error) {
        toast.error('Operation failed. Please try again.');
      }
    },
  });

  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle>{editFarmerData ? 'Edit Weight' : 'Add Daily Weight'}</DialogTitle>
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

        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Weight - kg
                </label>
                <input
                  type="text"
                  name="weight"
                  placeholder="Enter Weight in kg"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.weight && formik.errors.weight ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.weight && formik.errors.weight ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.weight}</div>
                ) : null}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Charge
                </label>
                <input
                  type="text"
                  name="charge"
                  placeholder="Enter Charge"
                  value={formik.values.charge}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.charge && formik.errors.charge ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.charge && formik.errors.charge ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.charge}</div>
                ) : null}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Distance
                </label>
                <input
                  type="text"
                  name="distance"
                  placeholder="Enter Distance"
                  value={formik.values.distance}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.distance && formik.errors.distance ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.distance && formik.errors.distance ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.distance}</div>
                ) : null}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Photos
                </label>
                <input
                  type="file"
                  name="images"
                  accept=".jpg, .jpeg, .png"
                  multiple
                  onChange={(event) => {
                    formik.setFieldValue('images', event.currentTarget.files);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.images && formik.errors.images ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.images && formik.errors.images ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.images}</div>
                ) : null}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              type="submit"
              className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              {editFarmerData ? 'Update' : 'Submit'}
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
