import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserStart,
  fetchUserFailure,
  fetchUserSuccess,
} from '../../redux/userSlice.tsx';
import { getAPIAuth, postAPIAuthFormData } from '../../service/apiInstance.ts';
import toast from 'react-hot-toast';
import { useAuth } from './../../hooks/useAuth';
import { withPageGuard } from '../../utils/withPageGuard.jsx';
import { useCheckPermission } from '../../utils/useCheckPermission.jsx';
import UserInfoDisplay from './UserInfoDisplay.jsx';

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { token } = useAuth();
  console.log('aaaaaaaaaaaaaaaauser', user);
  const checkNamePermission = useCheckPermission('Profile', 'name');
  const checkLogoPermission = useCheckPermission('Profile', 'logo');

  const fetchUserData = async () => {
    try {
      // alert('hello')
      dispatch(fetchUserStart());
      const res = await getAPIAuth('/user/userFullDetails', token);
      console.log('aaaaaares', res);
      dispatch(fetchUserSuccess(res?.data?.data));
    } catch (error) {
      dispatch(fetchUserFailure(error.toString()));
    }
  };

  const getProfileData = async (vlaues) => {
    console.log('vlauesvlaues', vlaues);
    const formData = new FormData();
    formData?.append('typeName', 'users');
    if (!user?.data?.type == 'contractor' || user?.data?.role) {
      formData?.append(
        'type',
        user?.data?.role === 'FruitSupplier' ? 'FS' : 'CS',
      );
    }

    if (user?.data?.type == 'contractor') {
      formData?.append('type', 'LC');
    }
    formData?.append('name', vlaues.name);
    formData?.append('images', vlaues.logo);
    try {
      const res = await postAPIAuthFormData(
        `user/updateUser/${user?.data?._id}`,
        formData,
        'Profile',
        'name',
      );
      console.log(res, 'fjfjfjfjfjfjfj');

      if (res?.data?.success) {
        // toast.success('Amount Added Successfully');
        fetchUserData();
        // fetchData();
        // resetForm();
        // setOpenAddModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      name: user?.data?.companyName || '',
      logo: user?.data?.images || null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      logo: Yup.mixed().required('Logo is required'),
    }),
    onSubmit: (values) => {
      getProfileData(values);
    },
  });

  const handleLogoChange = (event) => {
    formik.setFieldValue('logo', event.currentTarget.files[0]);
  };

  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Profile " />
      </div>
      <div className="table-container capitalize bg-white rounded-lg shadow-md p-8">
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {checkNamePermission ? (
            <>
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
                  <div className="text-red-500 text-sm">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <></>
          )}

          {true ? (
            <>
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Logo
                </label>
                <input
                  type="file"
                  name="logo"
                  accept=".jpg, .jpeg, .png"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={handleLogoChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.logo && formik.errors.logo ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.logo}
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="col-span-full">
            <button
              type="submit"
              className="flex w-full mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <hr className="my-15 border-t border-gray-200" />

      <div className="flex flex-col items-center justify-center mb-6">
        <h2 className="text-title-lg font-bold text-center text-black dark:text-white">
          Overview
        </h2>
      </div>

      <div className="table-container capitalize bg-white rounded-lg shadow-md p-8">
        <UserInfoDisplay user={user} />
      </div>
    </>
  );
};

export default withPageGuard(ProfilePage, 'Profile', 'name');
// withPageGuard(ProfilePage , "Profile" , "name" )
