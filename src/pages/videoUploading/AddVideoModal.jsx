import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Autocomplete,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SelectNewUserRole from "../../components/Forms/SelectGroup/SelectNewUserRole"
import { useAuth } from '../../hooks/useAuth';

export default function AddVideoModal({ openAddModal, setOpenAddModal, editingLabor, updateData }) {
  console.log("editingLabor" , editingLabor);
  
  const navigate = useNavigate();  
  const [laborName, setLaborName] = React.useState('');
  const [laborMobileNo, setLaborMobileNo] = React.useState('');
  const [teamContractor, setTeamContractor] = React.useState('');
  const [contractorMobile, setContractorMobile] = React.useState('');
  const [farmerData, setFarmerData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [userRoleDAata , setUserRoleData] = React.useState([]);
  const {token} = useAuth();
  React.useEffect(() => {
    if (editingLabor) {
      setLaborName(editingLabor.name || '');
      setLaborMobileNo(editingLabor.mobile || '');
      setTeamContractor(editingLabor.teamContractor || '');
      setContractorMobile(editingLabor.ContractorMobile || '');
    } else {
      setLaborName('');
      setLaborMobileNo('');
      setTeamContractor('');
      setContractorMobile('');
    }
  }, [editingLabor]);

  const handleClose = () => {
    setOpenAddModal(false);
  };

  const getFarmerDataList = async ()=> {
    try {
      const res = await getAPIAuth('farmer/getFarmerDetail?block=true');
      console.log("resresresresresresres" , res);
      if(res?.data?.success) {
        setFarmerData(res?.data?.data?.documents);
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  React.useEffect(() => {
    getFarmerDataList();
  },[])

  const handleFormSubmit = async (values, resetForm) => {
    console.log("sddddddvalues" , values);
    
    
    try {
      const userData = {
        taskId : editingLabor._id,
        assignedTo : values.assignName
      };

      let res = await postAPIAuth(`task/assignTask`, userData);
     
       console.log({res})
      if (res?.data?.success ) {
          toast.success(`Task Assign successfully.`);
          handleClose();
          updateData(); 
          resetForm();
          navigate("/");
          setUserRoleData([]);
        }
        else{
            toast.error(res?.data?.message);
        }
    } catch (err) {
        console.error('Error submitting form:', err);
        toast.error(err?.response?.data?.message);
        // toast.error(`Error ${editingLabor ? 'updating' : 'adding'} labor. Please try again later.`);
    }
  };
  const validationSchema = Yup.object({
    taskName: Yup.string().required('Task name is required'),
  });
  const formik = useFormik({
    initialValues: {
      taskName: editingLabor?.task ||'',
      UserRole : "",
      assignName : ""
    },
    validationSchema,
    onSubmit: ((vlaues, { resetForm }) => {
      handleFormSubmit(vlaues , resetForm)
    }),
    enableReinitialize : true
  });
  console.log("formik.valesss" ,formik.values.UserRole );
  

  const FilterUserRolefetchData = async () => {
    try {
      const res = await getAPIAuth(`/supplier/get?role=${formik.values.UserRole}`, token);
  console.log("datadatadata" , res);
     
      if (res?.data?.success) {
        setUserRoleData(res?.data?.data?.documents || []);
      }
      else{
        setUserRoleData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    if(formik.values.UserRole){
      FilterUserRolefetchData();
    }
  },[formik.values.UserRole])


  return (
    <React.Fragment>
      <Dialog
        open={openAddModal}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle> Assign Task</DialogTitle>
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
      <SelectNewUserRole
  value={formik.values.UserRole}
  onChange={(value) => formik.setFieldValue('UserRole', value)}
/>
               </div>

               <div>
        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
          Task Assign To
        </label>
        <Select
          name="assignName"
          onChange={(event) => formik.setFieldValue('assignName', event.target.value)}
          onBlur={formik.handleBlur}
          value={formik.values.assignName}
          size="small"
          fullWidth
          displayEmpty
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-3 py-1 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        >
          <MenuItem value="" disabled>
            Select Name
          </MenuItem>
          {userRoleDAata.map((item, index) => (
            <MenuItem key={index} value={item._id}>
              {item.username}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.assignName && formik.errors.assignName ? (
          <div className="mt-1 text-red-500">{formik.errors.assignName}</div>
        ) : null}
      </div>
   
      </div>
      {/* <button type="submit" className="mt-4 px-6 py-3 bg-primary text-white rounded-lg">Submit</button> */}
      <DialogActions sx={{paddingInline: '20px'}}>
          <button type="submit"  className="mt-4 flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">Assign Task</button>
        </DialogActions>
    </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
