import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Chip, IconButton, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Delete } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { postAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import AutoComplete from "react-google-autocomplete";
import { GOOGLE_KEY } from '../../constants';




export default function AddVFarmerModal({openAddModal, setOpenAddModal , getFarmersData , editfarmerdata , setEditFarmerData}) {
  console.log("editfarmerdata" , editfarmerdata);
  
  const [selectedPlace, setSelectedPlace] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [addressError, setAddressError] = React.useState('')
  console.log('selectedPlace', selectedPlace)

const {token} = useAuth();
  const handleClose = () => {
    setOpenAddModal(false);
  };

  React.useEffect(()=> {
    setAddressError('')
  }, [address])

  const getaddFarmers = async(values , resetForm) => {
    console.log("values" , values);
    if(!address?.length) {
      setAddressError('Required')
      return
    }
    try {
      const param = {
        name: values.name,
        mobileNo: values.mobile,
        geoLocation:[selectedPlace?.lat, selectedPlace?.lng],
        location: address
   }

   console.log('param', param)
   const EditParam = {
    name: values.name,
    mobileNo: values.mobile,
    geoLocation:[selectedPlace?.lat, selectedPlace?.lng],
    location: address,
    id : editfarmerdata?._id
}
  if(Object.keys(editfarmerdata)?.length > 0){
    const res = await postAPIAuth("farmer/editFarmerDetail" , EditParam , token);
    // console.log("ressssssssssssssssssssssss" , res);
    if(res.status == 200){
      toast.success(res.data.message);
      resetForm();
      getFarmersData();
      setEditFarmerData({});
      setOpenAddModal(false);
    }
  }
  else{
    const res = await postAPIAuth("farmer/addFarmerDetail" , param , token);
    console.log("ressssssssssssssssssssssss" , res);
    if(res.status == 200){
      toast.success(res.data.message);
      resetForm();
      getFarmersData();
      setOpenAddModal(false);

    }
  }
    } catch (error) {
      console.log("errror" , error);
      toast.error(error.response.data.message);
      
    }

  }



  console.log('google addddddd', selectedPlace)


  const handlePlaceSelect = React.useCallback((place) => {
    if (place?.geometry) {
      const location = place?.geometry?.location;
      const lat = location.lat();
      const lng = location.lng();

      setSelectedPlace({lat, lng});
      setAddress(place.formatted_address);
      let prem = place?.address_components?.find((m) =>
        m?.types?.includes("premise")
      );
    } else {
      console.error("No geometry available for selected place");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      // location: editfarmerdata?.location || '',
      // geoLocation: editfarmerdata?.geoLocation || '',
      name: editfarmerdata?.name || '',
      mobile: editfarmerdata?.mobileNo || '',
    },
    validationSchema: Yup.object({
      // location: Yup.string().required('Required'),
      // geoLocation: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      mobile: Yup.string().required('Required')
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(10, 'Must be exactly 10 digits')
        .max(10, 'Must be exactly 10 digits'),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log('Form data', values);
      getaddFarmers(values, resetForm);
    },
    enableReinitialize: true,
  });

  React.useEffect(() => {
  }, [editfarmerdata]);




  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}

      >
        <DialogTitle>{Object.keys(editfarmerdata)?.length > 0 ? "Update Farmer" : "Add Farmer"}</DialogTitle>
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
      {/* <div>
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Location
        </label>
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          value={formik.values.location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.location && formik.errors.location ? (
          <div className="text-red-500 text-sm">{formik.errors.location}</div>
        ) : null}
      </div> */}

      <div>
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          GeoLocation
        </label>
        <AutoComplete
            name="geoLocation"
            placeholder=""
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            apiKey={GOOGLE_KEY}
            onPlaceSelected={handlePlaceSelect}
            defaultValue={editfarmerdata?.location ? editfarmerdata?.location : ''}
            options={{
              types: ["geocode", "establishment"],
              componentRestrictions: { country: "in" },
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        {addressError ? (
          <div className="text-red-500 text-sm">{addressError}</div>
        ) : null}
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500 text-sm">{formik.errors.name}</div>
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
  {Object.keys(editfarmerdata)?.length > 0 ? (
    <button 
      type="submit" 
      className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
    >
      Update Farmer
    </button>
  ) : (
    <button 
      type="submit" 
      className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
    >
      Add Farmer
    </button>
  )}
</div>

    </form>
        </DialogContent>
        <DialogActions sx={{paddingInline: '20px'}}>
         
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
