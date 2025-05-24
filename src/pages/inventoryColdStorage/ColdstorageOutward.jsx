import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../hooks/useAuth.jsx';
import { postAPIAuth } from '../../service/apiInstance.ts';
import { toast } from 'sonner';

const handRatioCount = ['3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H'];

export default function ColdstorageOutwardModal({
  showOutwardModal,
  setShowOutwardModal,
  selectedOutward,
  fetchData,
  selectedItem,
}) {
  console.log('wwwwwwwwwwselectedOutward', selectedItem);

  const { token } = useAuth();
  const [formData, setFormData] = useState({
    coldStoreId: '',
    companyId: '',
    brand: '',
    totalCount: '',
    kgType: '',
    handRatio: '',
  });
  const [formErrors, setFormErrors] = useState({
    coldStoreId: '',
    company: '',
    brand: '',
    totalCount: '',
    kgType: '',
    handRatio: '',
  });
  const [companyList, setCompanyList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [handsRatioCount, setHandsRatioCount] = useState([]);
  const [handsRatioCountValue, setHandsRatioCountValue] = useState({});
  const [boxCountValue, setBoxCountValue] = useState(0);
  const [boxCount, setBoxCount] = useState([]);
  const [handsRatioArray, setHandsRatioArray] = useState([]);
  const resetFormAndErrors = () => {
    setFormData({
      coldStoreId: '',
      companyId: '',
      brand: '',
      totalCount: '',
      kgType: '',
      handRatio: '',
      fieldId: '',
      address: '',
      vehicleNo: '',
      date: '',
      contactNo: '',
    });
    setFormErrors({
      coldStoreId: '',
      company: '',
      brand: '',
      totalCount: '',
      kgType: '',
      handRatio: '',
      address: '',
      vehicleNo: '',
      date: '',
      contactNo: '',
    });
  };

  console.log('handsRatioArray', handsRatioArray);

  const handleClose = () => {
    setShowOutwardModal(false);
    resetFormAndErrors();
  };

  const getCompanyList = (data) => {
    const uniqueArray = data?.length
      ? [...new Set(data?.map((item) => item?.companyId))]?.map((id) =>
          data?.find((item) => item?.companyId === id),
        )
      : [];
    setCompanyList(uniqueArray);
  };

  const getBrandList = () => {
    const uniqueData = selectedOutward?.data?.filter(
      (item) => item?.companyId === formData?.companyId,
    );
    const filteredUniqueArray = uniqueData?.length
      ? [...new Set(uniqueData?.map((item) => item?.boxBrand))]?.map((id) =>
          uniqueData?.find((item) => item?.boxBrand === id),
        )
      : [];

    setBrandList(filteredUniqueArray);
  };

  //
  useEffect(() => {
    console.log('function chala handsRatioCount');
    const companyNameArray = selectedOutward?.data?.filter(
      (item) => item?.companyId === formData?.companyId,
    );
    const companyName = companyNameArray?.[0]?.partyName;
    setHandsRatioCountValue(handsRatioCount?.[companyName]);
  }, [formData?.companyId, formData?.brand, handsRatioCount]);

  useEffect(() => {
    getBrandList();
  }, [formData?.companyId]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      coldStoreId: selectedOutward?.coldStoreId,
      kgType: selectedOutward?.kgType,
      fieldId: selectedOutward?._id,
    }));
    getCompanyList(selectedOutward?.data);
  }, [selectedOutward]);

  useEffect(() => {
    let data = [];
    handsRatioCountValue &&
      Object?.entries(handsRatioCountValue)?.map(([key]) =>
        data.push({ handRatio: key, totalCount: '' }),
      );
    setHandsRatioArray(data);
  }, [handsRatioCountValue]);

  console.log('selectedOutward', selectedOutward);
  console.log('handsRatioCount', handsRatioCount);

  const get_hands_ratio_count = (array) => {
    const result = {};

    array?.forEach((entry) => {
      const companyName = entry.partyName;
      const handsRatio = entry.Box.handsRatio;

      // Initialize the company in the result object if it doesn't exist
      if (!result[companyName]) {
        result[companyName] = {};
      }

      // Sum up each hand ratio
      for (const hand in handsRatio) {
        if (result[companyName][hand]) {
          result[companyName][hand] += Number(handsRatio[hand]);
        } else {
          result[companyName][hand] = Number(handsRatio[hand]);
        }
      }
    });
    setHandsRatioCount(result);
  };

  console.log(
    'handsRatioCountValue',
    handsRatioCountValue,
    typeof handsRatioCountValue,
  );

  // const get_hands_ratio_count = (array) => {
  //   const result = {};

  //   array.forEach(entry => {
  //     const companyName = entry.partyName;
  //     const boxBrand = entry.Box.brand; // Extract the boxBrand
  //     const handsRatio = entry.Box.handsRatio;

  //     // Initialize the company and brand in the result object if they don't exist
  //     if (!result[companyName]) {
  //       result[companyName] = {};
  //     }
  //     if (!result[companyName][boxBrand]) {
  //       result[companyName][boxBrand] = {};
  //     }

  //     // Sum up each hand ratio based on both companyName and boxBrand
  //     for (const hand in handsRatio) {
  //       if (result[companyName][boxBrand][hand]) {
  //         result[companyName][boxBrand][hand] += Number(handsRatio[hand]);
  //       } else {
  //         result[companyName][boxBrand][hand] = Number(handsRatio[hand]);
  //       }
  //     }
  //   });
  //   return result;
  // }

  useEffect(() => {
    if (formData?.companyId && formData?.brand) {
      const filteredData = selectedOutward?.data
        ?.filter((item) => item?.companyId === formData?.companyId)
        ?.filter((item) => item?.boxBrand === formData?.brand);
      console.log('filteredData ', filteredData);
      get_hands_ratio_count(filteredData);
      setBoxCount(filteredData);
    }
  }, [selectedOutward, formData?.companyId, formData?.brand]);

  useEffect(() => {
    const totalCount = get_total_box_count(boxCount);
    // console.log('totalCounttotalCount', totalCount)
    setBoxCountValue(totalCount);
  }, [selectedOutward, formData?.companyId, formData?.brand, boxCount]);

  const get_total_box_count = (array) => {
    let totalCount = 0;

    array.forEach((entry) => {
      totalCount += Number(entry.Box.count);
    });

    return totalCount;
  };

  const handleOutward = async (e) => {
    e.preventDefault();
    if (!formData?.companyId) {
      setFormErrors((prev) => ({
        ...prev,
        company: 'Please select company',
      }));
      return;
    }
    if (!formData?.brand) {
      setFormErrors((prev) => ({
        ...prev,
        brand: 'Please select brand',
      }));
      return;
    }
    if (!formData?.address) {
      setFormErrors((prev) => ({
        ...prev,
        address: 'Please enter address',
      }));
      return;
    }
    if (!formData?.vehicleNo) {
      setFormErrors((prev) => ({
        ...prev,
        vehicleNo: 'Please enter vehicleNo',
      }));
      return;
    }
    if (!formData?.date) {
      setFormErrors((prev) => ({
        ...prev,
        date: 'Please select date',
      }));
      return;
    }
    if (!formData?.contactNo) {
      setFormErrors((prev) => ({
        ...prev,
        contactNo: 'Please enter contact No.',
      }));
      return;
    }
    // if(formData?.kgType >= 13 && !formData?.handRatio) {
    //   setFormErrors(prev=>({
    //     ...prev,
    //     handRatio: 'Please select hands ratio'
    //   }))
    //   return
    // }
    if (formData?.kgType < 13 && !formData?.totalCount) {
      setFormErrors((prev) => ({
        ...prev,
        totalCount: 'Please enter quantity',
      }));
      return;
    }
    // if(formData?.totalCount > selectedOutward?.totalCount) {
    //   toast.error(`Outward value should be less than or equal to ${selectedOutward?.totalCount} `)
    //   return
    // }
    if (formData?.kgType >= 13) {
      let hasError = false;
      handsRatioArray?.length &&
        handsRatioArray?.forEach((item) => {
          if (item?.totalCount > handsRatioCountValue?.[item?.handRatio]) {
            toast.error(
              `Outward value for ${item?.handRatio} should be less than or equal to ${handsRatioCountValue?.[item?.handRatio]} `,
            );
            hasError = true;
          }
        });
      if (hasError) return;
      // if(formData?.totalCount > handsRatioCountValue?.[formData?.handRatio]) {
      //   toast.error(`Outward value for ${formData?.handRatio} should be less than or equal to ${handsRatioCountValue?.[formData?.handRatio]} `)
      //   return
      // }
    }
    console.log('hello');
    if (formData?.kgType < 13) {
      if (formData?.totalCount > boxCountValue) {
        toast.error(
          `Outward value for ${formData?.kgType} should be less than or equal to ${boxCountValue} `,
        );
        return;
      }
    }
    const payload = {
      coldStoreId: formData?.coldStoreId,
      companyId: formData?.companyId,
      brand: formData?.brand,
      totalCount: formData?.kgType < 13 ? formData?.totalCount : '',
      kgType: formData?.kgType,
      handRatio: formData?.kgType >= 13 ? formData?.handRatio : '',
      handRatioArr: handsRatioArray,
      _id: formData?.fieldId,
      address: formData?.address,
      vehicleNo: formData?.vehicleNo,
      date: formData?.date,
      contactNo: formData?.contactNo,
    };
    try {
      const res = await postAPIAuth(`coldStorage/boxOut`, payload, token);
      console.log(res, 'fjfjfjfjfjfjfj');

      if (res?.status === 200) {
        toast.success('Outward successfully');
        resetFormAndErrors();
        fetchData();
        setShowOutwardModal(false);
      } else {
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <Dialog
      open={showOutwardModal}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle>
        Cold Storage Outward
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
      <form onSubmit={handleOutward}>
        <DialogContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-3">
                Select Company
              </label>
              <Select
                value={formData?.companyId || ''}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    brand: '',
                    companyId: e.target.value,
                  }));
                  setFormErrors((prev) => ({
                    ...prev,
                    company: '',
                  }));
                }}
                displayEmpty
                sx={{ width: '100%', height: '49.6px' }}
              >
                <MenuItem value="" disabled>
                  Select Company
                </MenuItem>
                {companyList?.length &&
                  companyList.map((option, i) => (
                    <MenuItem key={option?.companyId} value={option?.companyId}>
                      {option?.partyName}
                    </MenuItem>
                  ))}
              </Select>
              {formErrors?.company && (
                <div className="text-red-500 mt-1">{formErrors?.company}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-3">
                Select Brand
              </label>
              <Select
                value={formData?.brand || ''} // Ensures the empty state for the placeholder
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, brand: e.target.value }));
                  setFormErrors((prev) => ({ ...prev, brand: '' }));
                }}
                displayEmpty
                sx={{ width: '100%', height: '49.6px' }}
              >
                <MenuItem value="" disabled>
                  Select Brand
                </MenuItem>
                {brandList?.length &&
                  brandList.map((option, i) => (
                    <MenuItem key={option?.boxBrand} value={option?.boxBrand}>
                      {option?.boxBrand}
                    </MenuItem>
                  ))}
              </Select>
              {formErrors?.brand && (
                <div className="text-red-500 mt-1">{formErrors?.brand}</div>
              )}
            </div>

            <div>
              <label
                class={` block text-sm font-medium text-black dark:text-white mb-3`}
              >
                Address
              </label>
              <input
                type="text"
                value={formData?.address}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, address: e.target.value }));
                  setFormErrors((prev) => ({ ...prev, address: '' }));
                }}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                placeholder="Enter address"
              />
              {formErrors?.address && (
                <div className="text-red-500 mt-1">{formErrors?.address}</div>
              )}
            </div>
            {/* <div>
              <label
                class={` block text-sm font-medium text-black dark:text-white mb-3`}
              >
                Vehicle No.
              </label>
              <input
                type="text"
                value={formData?.vehicleNo}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    vehicleNo: e.target.value,
                  }));
                  setFormErrors((prev) => ({ ...prev, vehicleNo: '' }));
                }}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                placeholder="Enter vehicle Number"
              />
              {formErrors?.vehicleNo && (
                <div className="text-red-500 mt-1">{formErrors?.vehicleNo}</div>
              )}
            </div> */}
            <div>
              <label class="block text-sm font-medium text-black dark:text-white mb-3">
                Vehicle No.
              </label>
              <input
                type="text"
                value={formData?.vehicleNo}
                onChange={(e) => {
                  const value = e.target.value;

                  // Vehicle number validation (example: alphanumeric and limit to 10 characters)
                  const vehicleNoPattern = /^[A-Za-z0-9\s-]{0,10}$/; // Adjust pattern based on your requirement

                  if (vehicleNoPattern.test(value)) {
                    setFormData((prev) => ({
                      ...prev,
                      vehicleNo: value,
                    }));
                    setFormErrors((prev) => ({ ...prev, vehicleNo: '' }));
                  } else {
                    setFormErrors((prev) => ({
                      ...prev,
                      vehicleNo:
                        'Invalid Vehicle No. (Alphanumeric, max 10 characters)',
                    }));
                  }
                }}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                placeholder="Enter vehicle Number"
              />
              {formErrors?.vehicleNo && (
                <div className="text-red-500 mt-1">{formErrors?.vehicleNo}</div>
              )}
            </div>

            <div>
              <label
                class={` block text-sm font-medium text-black dark:text-white mb-3`}
              >
                Date
              </label>
              <input
                type="date"
                value={formData?.date}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, date: e.target.value }));
                  setFormErrors((prev) => ({ ...prev, date: '' }));
                }}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                placeholder="Select date"
              />
              {formErrors?.date && (
                <div className="text-red-500 mt-1">{formErrors?.date}</div>
              )}
            </div>
            <div>
              <label
                class={` block text-sm font-medium text-black dark:text-white mb-3`}
              >
                Contact No.
              </label>
              <input
                type="text"
                value={formData?.contactNo}
                onChange={(e) => {
                  // Ensure only numbers are allowed and restrict length to 10
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    setFormData((prev) => ({
                      ...prev,
                      contactNo: value,
                    }));
                    setFormErrors((prev) => ({ ...prev, contactNo: '' }));
                  }
                }}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                placeholder="Enter contact no."
              />
              {formErrors?.contactNo && (
                <div className="text-red-500 mt-1">{formErrors?.contactNo}</div>
              )}
            </div>
            {formData?.kgType >= 13 ? (
              <>
                {handsRatioArray?.length
                  ? handsRatioArray?.map((key) => (
                      <div className="grid grid-cols-2 col-span-2 gap-4">
                        <div>
                          <label
                            class={` block text-sm font-medium text-black dark:text-white mb-3`}
                          >
                            Hand Ratio {key?.handRatio}
                          </label>
                          <input
                            type="text"
                            value={key?.handRatio}
                            readOnly
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                            placeholder="Enter Quantity"
                          />
                        </div>
                        <div>
                          <label
                            class={` block text-sm font-medium text-black dark:text-white mb-3`}
                          >
                            Enter {key?.handRatio} Quantity
                          </label>
                          <input
                            type="text"
                            value={key?.totalCount}
                            name={key?.handRatio}
                            onChange={(e) => {
                              setHandsRatioArray((prev) =>
                                prev?.map((item) =>
                                  item?.handRatio === key?.handRatio
                                    ? { ...item, totalCount: e.target.value }
                                    : item,
                                ),
                              );
                            }}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                            placeholder="Enter Quantity"
                          />
                        </div>
                      </div>
                    ))
                  : ''}
              </>
            ) : (
              ''
            )}
            {formData?.kgType < 13 ? (
              <div>
                <label
                  class={` block text-sm font-medium text-black dark:text-white mb-3`}
                >
                  Enter Quantity
                </label>
                <input
                  type="text"
                  value={formData?.totalCount}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      totalCount: e.target.value,
                    }));
                    setFormErrors((prev) => ({ ...prev, totalCount: '' }));
                  }}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary"
                  placeholder="Enter Quantity"
                />
                {formErrors?.totalCount && (
                  <div className="text-red-500 mt-1">
                    {formErrors?.totalCount}
                  </div>
                )}
              </div>
            ) : (
              ''
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <button
            type="submit"
            className="flex w-full mx-auto max-w-[250px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Save
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
