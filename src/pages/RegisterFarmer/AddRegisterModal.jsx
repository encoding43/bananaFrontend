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
import AutoComplete from "react-google-autocomplete";
import { GOOGLE_KEY } from '../../constants';
import { Spinner } from '@nextui-org/spinner';


export default function AddRegisterFarmerModal({
  openAddModal, setOpenAddModal, editFarmerData, setEditFarmerData, updateData
}) {
  const [selectedPlace, setSelectedPlace] = React.useState('')
  const [address, setAddress] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  console.log('selectedPlace', loading)

  const handleClose = () => {
    setOpenAddModal(false);
    setEditFarmerData(null);
  };

  const initialValues = {
    typeName: 'farmerRegister',
    date: editFarmerData?.date || '',
    // location: editFarmerData?.location || '',
    // geoLocation: editFarmerData?.geoLocation || '',
    name: editFarmerData?.name || '',
    mobileNo: editFarmerData?.mobileNo || '',
    areaInAcres: editFarmerData?.areaInAcres || '',
    numberOfPlants: editFarmerData?.numberOfPlants || '',
    varietyOfBanana: editFarmerData?.varietyOfBanana || '',
    plantationDate: editFarmerData?.plantationDate || '',
    photos: [],
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      date: Yup.string().required('Date is required'),
      // location: Yup.string().required('Location is required'),
      // geoLocation: Yup.string().required('Geolocation is required'),
      name: Yup.string().required('Name is required'),
      mobileNo: Yup.string()
        .required('Mobile is required')
        .matches(/^[0-9]{10}$/, 'Mobile number is not valid'),
      areaInAcres: Yup.string().required('Area in Acres is required'),
      numberOfPlants: Yup.string().required('Number of Plants is required'),
      varietyOfBanana: Yup.string().required('Variety of Banana is required'),
      plantationDate: Yup.string().required('Plantation Date is required'),
      photos: Yup.mixed().required('Photos are required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('typeName', values?.typeName);
      formData.append('date', values?.date);
      formData.append('location', address);
      formData.append('geoLocation[]', selectedPlace?.lat);
      formData.append('geoLocation[]', selectedPlace?.lng);
      formData.append('name', values?.name);
      formData.append('mobileNo', values?.mobileNo);
      formData.append('areaInAcres', values?.areaInAcres);
      formData.append('numberOfPlants', values?.numberOfPlants);
      formData.append('varietyOfBanana', values?.varietyOfBanana);
      formData.append('plantationDate', values?.plantationDate);

      {
        values.photos?.length && 
        Array.from(values.photos).forEach((file) => {
          formData.append('photos', file); 
        });
      }
      setLoading(true);
      try {
        let res;
        if (editFarmerData) {
          // Edit farmer
          // const body = {
          //   id : editFarmerData._id
          // }
        formData.append('id',editFarmerData?._id);

          res = await postAPIAuthFormData(`farmer/editRegisteredFarmer`, formData);
        } else {
          // Add new farmer
          res = await postAPIAuthFormData(`farmer/registerFarmer`, formData);
        }
        console.log({ res });
        if (res?.data?.status === 200) {
          toast.success(editFarmerData ? 'Farmer updated successfully!' : 'Farmer registered successfully!');
          handleClose();
          updateData();
          resetForm(); // Reset the form values
        } else {
          toast.error(res?.data?.message);
        }
      } catch (error) {
        toast.error('Operation failed. Please try again.');
        setLoading(false);
      }
      finally {
        setLoading(false);
      }
    },
  });

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

  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle>{editFarmerData ? 'Edit Farmer' : 'Add Register Farmer'}</DialogTitle>
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
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.date && formik.errors.date ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.date && formik.errors.date ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.date}</div>
                ) : null}
              </div>
              {/* <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.location && formik.errors.location ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.location && formik.errors.location ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.location}</div>
                ) : null}
              </div> */}
              {/* <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  GeoLocation
                </label>
                <input
                  type="text"
                  name="geoLocation"
                  placeholder="Enter Geolocation"
                  value={formik.values.geoLocation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.geoLocation && formik.errors.geoLocation ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.geoLocation && formik.errors.geoLocation ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.geoLocation}</div>
                ) : null}
              </div> */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    GeoLocation
                  </label>
                  <AutoComplete
                      name="geoLocation"
                      placeholder="Enter location"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      apiKey={GOOGLE_KEY}
                      onPlaceSelected={handlePlaceSelect}
                      defaultValue={editFarmerData?.location ? editFarmerData?.location : ''}
                      options={{
                        types: ["geocode", "establishment"],
                        componentRestrictions: { country: "in" },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.name && formik.errors.name ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                ) : null}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobileNo"
                  placeholder="Enter Mobile"
                  value={formik.values.mobileNo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.mobileNo && formik.errors.mobileNo ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.mobileNo && formik.errors.mobileNo ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.mobileNo}</div>
                ) : null}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Area In Acres
                </label>
                <input
                  type="text"
                  name="areaInAcres"
                  placeholder="Enter Area in Acres"
                  value={formik.values.areaInAcres}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.areaInAcres && formik.errors.areaInAcres ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.areaInAcres && formik.errors.areaInAcres ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.areaInAcres}</div>
                ) : null}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Number of Plants
                </label>
                <input
                  type="text"
                  name="numberOfPlants"
                  placeholder="Enter Number of Plants"
                  value={formik.values.numberOfPlants}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.numberOfPlants && formik.errors.numberOfPlants ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.numberOfPlants && formik.errors.numberOfPlants ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.numberOfPlants}</div>
                ) : null}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Variety of Banana
                </label>
                <input
                  type="text"
                  name="varietyOfBanana"
                  placeholder="Enter Variety of Banana"
                  value={formik.values.varietyOfBanana}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.varietyOfBanana && formik.errors.varietyOfBanana ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.varietyOfBanana && formik.errors.varietyOfBanana ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.varietyOfBanana}</div>
                ) : null}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Plantation Date
                </label>
                <input
                  type="date"
                  name="plantationDate"
                  value={formik.values.plantationDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.plantationDate && formik.errors.plantationDate ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.plantationDate && formik.errors.plantationDate ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.plantationDate}</div>
                ) : null}
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Photos
                </label>
                <input
                  type="file"
                  name="photos"
                  accept=".jpg, .jpeg, .png"
                  multiple
                  onChange={(event) => {
                    formik.setFieldValue('photos', event.currentTarget.files);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                    formik.touched.photos && formik.errors.photos ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.photos && formik.errors.photos ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.photos}</div>
                ) : null}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
        
            {
              loading ? (<>
                 <Spinner size="sm" color="default" classNames={{ base: "flex flex-row items-center", label: "text-Black"}} label="Loading..." />
              </>):(
                <>
               
               <button
              type="submit"
              className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              {editFarmerData ? 'Update' : 'Submit'}
            </button>
                </>
              )
            }
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
