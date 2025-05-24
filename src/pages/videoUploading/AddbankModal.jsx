import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { postAPIAuth, postAPIAuthFormData } from '../../service/apiInstance';
import { useNavigate } from 'react-router-dom';

export default function AddBankFarmerModal({ openAddModal, setOpenAddModal, editingLabor, updateData }) {
  console.log("editingLaboreditingLabor" , editingLabor);
  
  const navigate = useNavigate();
  
  const handleClose = () => {
    setOpenAddModal(false);
  };

  const handleFormSubmit = async (values, resetForm) => {
    console.log("valuesvalues" , values);
    
    try {
      const formData = new FormData();
      formData.append('typeName', "video");

      formData.append('title', values.videoTilte);
      if (values.videoFile?.name) {
        // alert("hii")
        formData.append('video', values?.videoFile);
      }
      if (editingLabor) {
        formData.append('id', editingLabor._id);
      }

      let res;
      if (editingLabor) {
        res = await postAPIAuthFormData('bussinessIntelligence/editVideo', formData);
      } else {
        res = await postAPIAuthFormData('bussinessIntelligence/addVideo', formData);
      }
   console.log("resresres" , res);
   
      if (res?.data?.status == 200) {
        toast.success(`Video ${editingLabor ? 'updated' : 'added'} successfully.`);
        handleClose();
        updateData();
        resetForm();
        navigate("/video");
      } else {
        toast.error(res?.data?.message);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error('An error occurred. Please try again.');
    }
  };

  const validationSchema = Yup.object({
    videoTilte: Yup.string().required('Title is required'),
    // videoFile: Yup.mixed()
    //   .required('A video is required')
    //   .test('fileFormat', 'Unsupported format', (value) =>
    //     value ? ['video/mp4', 'video/mov', 'video/avi'].includes(value.type) : true
    //   )
    //   .test('fileSize', 'File size is too large', (value) =>
    //     value ? value.size <= 52428800 : true // 50 MB limit
    //   ),
  });

  const formik = useFormik({
    initialValues: {
      videoFile: null,
      videoTilte : editingLabor?.title || ''
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleFormSubmit(values, resetForm);
    },
    enableReinitialize: true,
  });

  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle>{editingLabor ? 'Edit Video' : 'Add Video'}</DialogTitle>
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
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Video Name
                </label>
                <input
                  type="text"
                  name="videoTilte"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.videoTilte}
                  placeholder="Enter video Tilte"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {formik.touched.videoTilte && formik.errors.videoTilte ? (
                  <div className="mt-1 text-red-500">{formik.errors.videoTilte}</div>
                ) : null}
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Upload Video
                </label>
                <input
                  type="file"
                  name="videoFile"
                  accept=".jpg, .jpeg, .png"
                  onChange={(event) =>
                    formik.setFieldValue('videoFile', event.currentTarget.files[0])
                  }
                  onBlur={formik.handleBlur}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {formik.touched.videoFile && formik.errors.videoFile ? (
                  <div className="mt-1 text-red-500">{formik.errors.videoFile}</div>
                ) : null}
              </div>
            </div>

            <DialogActions sx={{ paddingInline: '20px' }}>
              <button
                type="submit"
                className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                {editingLabor ? 'Edit Video' : 'Add Video'}
              </button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
