import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { postAPIAuth } from '../../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';
import AutoComplete from 'react-google-autocomplete';
import { GOOGLE_KEY } from '../../../constants';

export default function AddColdStoragePartyModal({
  openAddModal,
  setOpenAddModal,
  getFarmersData,
  editfarmerdata,
  setEditFarmerData,
}) {
  const [selectedPlace, setSelectedPlace] = React.useState('');
  const [address, setAddress] = React.useState('');

  const { token } = useAuth();

  const handleClose = () => {
    setOpenAddModal(false);
  };

  const getaddParty = async (values, resetForm) => {
    if (!address?.length) {
      formik.setFieldError('address', 'Required');
      return;
    }

    try {
      const param = {
        name: values.firstName,
        ownerName: values.ownerName,
        mobile: values.mobile,
        geoLocation: [selectedPlace?.lat, selectedPlace?.lng],
        address: address,
      };

      const res = Object.keys(editfarmerdata)?.length > 0 
        ? await postAPIAuth(`coldStorage/party/update/${editfarmerdata?._id}`, param, token)
        : await postAPIAuth('coldStorage/party/create', param, token);

      if (res.data.success) {
        toast.success(res.data.message);
        resetForm();
        getFarmersData();
        setEditFarmerData({});
        setOpenAddModal(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handlePlaceSelect = React.useCallback((place) => {
    if (place?.geometry) {
      const location = place?.geometry?.location;
      setSelectedPlace({
        lat: location.lat(),
        lng: location.lng(),
      });
      setAddress(place.formatted_address);
      formik.setFieldValue('address', place.formatted_address); // Set address field value
    } else {
      console.error('No geometry available for selected place');
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: editfarmerdata?.name || '',
      ownerName: editfarmerdata?.ownerName || '',
      address: editfarmerdata?.address || '',
      mobile: editfarmerdata?.mobile || '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      ownerName: Yup.string().required('Required'),
      mobile: Yup.string()
        .required('Required')
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(10, 'Must be exactly 10 digits')
        .max(10, 'Must be exactly 10 digits'),
      address: Yup.string().required('Required'), // Address validation
    }),
    onSubmit: (values, { resetForm }) => {
      getaddParty(values, resetForm);
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
        <DialogTitle>{Object.keys(editfarmerdata)?.length > 0 ? 'Update Party' : 'Add Party'}</DialogTitle>
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
          <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-red-500 text-sm">{formik.errors.firstName}</div>
              ) : null}
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Owner Name
              </label>
              <input
                type="text"
                name="ownerName"
                placeholder="Owner Name"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={formik.values.ownerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.ownerName && formik.errors.ownerName ? (
                <div className="text-red-500 text-sm">{formik.errors.ownerName}</div>
              ) : null}
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Address
              </label>
              <AutoComplete
                name="address"
                placeholder="Address"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                apiKey={GOOGLE_KEY}
                onPlaceSelected={handlePlaceSelect}
                defaultValue={formik.values.address}
                onBlur={formik.handleBlur}
                options={{
                  types: ['geocode', 'establishment'],
                  componentRestrictions: { country: 'in' },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
             {formik.touched.address && formik.errors.address ? (
                <div className="text-red-500 text-sm">{formik.errors.address}</div>
              ) : null}
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.mobile && formik.errors.mobile ? (
                <div className="text-red-500 text-sm">{formik.errors.mobile}</div>
              ) : null}
            </div>

            <div className="col-span-full">
              <button
                type="submit"
                className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                {Object.keys(editfarmerdata)?.length > 0 ? 'Update Farmer' : 'Add Farmer'}
              </button>
            </div>
          </form>
        </DialogContent>
        <DialogActions sx={{ paddingInline: '20px' }} />
      </Dialog>
    </React.Fragment>
  );
}
