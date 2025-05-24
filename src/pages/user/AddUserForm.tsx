// @ts-nocheck
import { useParams, useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SelectNewUserRole from '../../components/Forms/SelectGroup/SelectNewUserRole';
import { useState, useEffect } from 'react';
import { getAPIAuth, postAPIAuth } from '../../service/apiInstance';
import { toast } from 'sonner';
import {withPageGuard} from './../../utils/withPageGuard.jsx'
import { IoClose } from 'react-icons/io5';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useAuth }  from "../../hooks/useAuth.jsx"
const AddUserForm = () => {
  const { userId } = useParams(); // Get the userId from URL parameters
  const navigate = useNavigate(); // Hook for navigation
  const [userName, setUserName] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userSalary, setUserSalary] = useState('');
  const [allowedLeaves, setAllowedLeaves] = useState('')
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { token } = useAuth();

  // console.log("mangaetokennnnnnnn" , token);
  
  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    } else {
      // Clear form fields for creating a new user
      setUserName('');
      setUserMobile('');
      setUserPassword('');
      setUserRole('');
      setUserSalary('');
      setIsEditing(false);
    }
  }, [userId]);

  const fetchUserData = async (id) => {
    try {
      const response = await getAPIAuth(`/supplier/get?userId=${id}`);
      console.log(response.data.data.documents[0],'--------------------')
      if (response.status === 200 && response?.data?.success && response?.data?.data?.documents.length > 0) {
        const user = response?.data?.data.documents[0]; 
        console.log("setAllowedLeavessetAllowedLeavessetAllowedLeaves" , user);
        
        setUserName(user?.username || '');
        setUserMobile(user?.mobile || '');
        setAllowedLeaves(user?.allowedLeaves);
        // setUserPassword(''); 
        // setUserRole(user?.role || '');
        setUserSalary(user?.salary || '');
        setIsEditing(true);
      } else {
        toast.error('User data not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const mobileRegex = /^[0-9]{10}$/;

    if (!userName) {
      toast.error("Enter Name of New User");
      setLoading(false);
      return;
    }
    if (!mobileRegex.test(userMobile)) {
      toast.error("Enter a valid 10-digit Mobile Number of New User");
      setLoading(false);
      return;
    }
    if (!isEditing && (userPassword.length === 0 || userPassword.length < 6)) {
      toast.error("Enter a proper Password of New User (at least 6 characters)");
      setLoading(false);
      return;
    }
    if (!isEditing && userRole.length === 0) {
      toast.error("Enter Role of New User");
      setLoading(false);
      return;
    }
    if (userSalary?.trim()?.length === 0 || isNaN(userSalary)) {
      toast.error("Enter a valid Salary of New User");
      setLoading(false);
      return;
    }
    if (allowedLeaves?.trim()?.length === 0 || isNaN(allowedLeaves)) {
      toast.error("Enter a valid allowed leaves of New User");
      setLoading(false);
      return;
    }

    try {
      let res;
      const userData = {
        username: userName,
        mobile: userMobile,
        password: isEditing ? undefined : userPassword,
        salary: userSalary,
        role: isEditing ? undefined : userRole,
        allowedLeaves: allowedLeaves
      };

      if (isEditing) {
        // Update the user
        res = await postAPIAuth(`/supplier/edit/${userId}`, userData , token , "Manage user" , "edit");
      } else {
        // Create a new user
        res = await postAPIAuth("/Supplier/create/user", userData , token , "Manage user" , "add user");
      }

      if (res?.data?.success) {
        toast.success(`User ${isEditing ? 'Updated' : 'Created'} Successfully`);
        if (!isEditing) {
          // Clear form fields if creating a new user
          setUserName('');
          setUserMobile('');
          setUserPassword('');
          setUserRole('');
          setUserSalary('');
        } else {
          // Navigate back to the previous page or user list after updating
          navigate('/user'); // Change to the appropriate route
        }
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
      <Breadcrumb pageName={isEditing ? "Edit User" : "Add New User"} />
        <Link to={"/user"}>
        <div className="close-btn rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 cursor-pointer">
        <IoMdArrowRoundBack />

      </div>
        </Link>
    </div>
      <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            {isEditing ? "Edit User" : "Add User"}
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  User Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter user name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  User Mobile
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter user mobile"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={userMobile}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    setUserMobile(onlyNums);
                  }}
                />
              </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              {!isEditing ? (<div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  User Password <span className="text-meta-1">*</span>
                </label>
                <input
                  required
                  type="password"
                  placeholder="Enter user password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                />
              </div>) : (<></>)}
              

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Salary
                </label>
                <input
                  required
                  placeholder="Add salary"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={userSalary}
                  onChange={(e) => setUserSalary(e.target.value)}
                ></input>
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Allowed Leaves
                </label>
                <input
                  required
                  placeholder="Allowed Leaves"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={allowedLeaves}
                  onChange={(e) => setAllowedLeaves(e.target.value)}
                ></input>
              </div>
               {!isEditing ? (
                 <div className='w-full xl:w-1/2'>
                 <SelectNewUserRole value={userRole} onChange={setUserRole} />
               </div>
               ) : (<></>)}
             
            </div>
            <div className="flex justify-end">
              <button type="submit" className="rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                {loading ? "Processing..." : isEditing ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        </form>
      </div>
      </>
  );
};

export default withPageGuard(AddUserForm, 'Manage user', 'add user');
