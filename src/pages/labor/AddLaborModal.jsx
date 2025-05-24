import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Autocomplete,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

export default function AddLaborModal({ openAddModal, setOpenAddModal, editingLabor, updateData }) {
  const navigate = useNavigate();  
  const [laborName, setLaborName] = React.useState('');
  const [laborMobileNo, setLaborMobileNo] = React.useState('');
  const [selectedContractor, setSelectedContractor] = React.useState()
  const [loading, setLoading] = React.useState(false);
  const [laborData, setLaborData] = React.useState([])
  const {token} = useAuth()
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (editingLabor) {
      setLaborName(editingLabor.name || '');
      setLaborMobileNo(editingLabor.mobile || '');
      setSelectedContractor(editingLabor?.contractorId || '')
    } else {
      setLaborName('');
      setLaborMobileNo('');
      setSelectedContractor('')
    }
  }, [editingLabor]);

  const handleClose = () => {
    setOpenAddModal(false);
    setErrors({});
  };


  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAPIAuth(`supplier/labor/contractor`, token );
      if (res?.data?.success) {
        setLaborData(res?.data?.data?.documents || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    if (token && openAddModal){
        fetchData();
    }
  }, [token, openAddModal]);

  const validateInputs = () => {
    const newErrors = {};
    const mobileRegex = /^[0-9]{10}$/;

    if (!laborName) newErrors.laborName = "Enter Name of New Labor";
    if (!mobileRegex.test(laborMobileNo)) newErrors.laborMobileNo = "Enter a valid 10-digit Mobile Number of Labor";

    return newErrors;
  };

  const handleLaborChange = (event, value) => {
    setSelectedContractor(value?._id);
    setErrors((prv) => ({ ...prv, laborContractor: "" }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: laborName,
        mobile: laborMobileNo,
        contractorId : selectedContractor
      };

      let res;
      if (editingLabor) {
        // Call the update API
        res = await postAPIAuth(`/supplier/labor/update/${editingLabor._id}`, userData ,  token ,  "Manage Labor" , "Add Labor");
      } else {
        // Call the add API
        res = await postAPIAuth('/supplier/labor/create', userData , token ,  "Manage Labor" , "Add Labor");
      }
       console.log({res})
      if (res?.data?.success ) {
          toast.success(`Labor ${editingLabor ? 'updated' : 'added'} successfully.`);
          handleClose();
          updateData(); 
          navigate("/manageLabor")
          setLaborName('');
          setLaborMobileNo('');
          // setTeamContractor('');
          // setContractorMobile('');
        }
        else{
            toast.error(res?.data?.message);
        }
    } catch (err) {
        console.error('Error submitting form:', err);
        toast.error(`Error ${editingLabor ? 'updating' : 'adding'} labor. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle>{editingLabor ? 'Edit Labor' : 'Add Labor'}</DialogTitle>
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
              <input
                required
                value={laborName}
                onChange={(e) => setLaborName(e.target.value)}
                type="text"
                placeholder="Enter Labor Name "
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.laborName && <p className="text-red-500 text-sm mt-1">{errors.laborName}</p>}
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Labor Mobile Number
              </label>
              <input
                required
                value={laborMobileNo}
                onChange={(e) => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    setLaborMobileNo(onlyNums);
                  }}
                type="text"
                placeholder="Enter Labor Mobile"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.laborMobileNo && <p className="text-red-500 text-sm mt-1">{errors.laborMobileNo}</p>}
            </div>
            {/* <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                New Team Contractor
              </label>
              <input
                required
                value={teamContractor}
                onChange={(e) => setTeamContractor(e.target.value)}
                type="text"
                placeholder="Enter Team Contractor"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.teamContractor && <p className="text-red-500 text-sm mt-1">{errors.teamContractor}</p>}
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Contractor Mobile
              </label>
              <input
                required
                value={contractorMobile}
                onChange={(e) => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    setContractorMobile(onlyNums);
                  }}
                type="text"
                placeholder="Enter Contractor Mobile"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.contractorMobile && <p className="text-red-500 text-sm mt-1">{errors.contractorMobile}</p>}
            </div> */}
            <div className=''>
              <label className="block text-sm font-medium text-black dark:text-white mb-3">
                Select Labor Contractor
              </label>
              <Autocomplete
                value={laborData?.find((option) => option._id === selectedContractor) || null}
                onBlur={() => {
                  if (!selectedContractor) {
                    setErrors((prev) => ({ ...prev, laborContractor: "Select Labor Contractor Required" }));
                  }
                }}
                onChange={handleLaborChange}
                name="selectLabor"
                options={laborData}
                getOptionLabel={(option) => `${option.name} (${option?.mobile})`}
                // isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Labor Contractor"
                    sx={{ width: '100%', height: '49.6px' }}
                    error={!!errors.laborContractor}
                    helperText={errors.laborContractor}
                  />
                )}
                sx={{ width: '100%' }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ paddingInline: '20px' }}>
          <button 
            type='submit' 
            onClick={handleFormSubmit} 
            className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            disabled={loading}
          >
            {editingLabor ? 'Update' : 'Add'}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
