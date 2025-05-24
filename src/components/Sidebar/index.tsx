import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { useSelector } from 'react-redux';
import { ROUTES_CONST } from './../../constants/routeConstant.js';
import { useCheckPermission } from './../../utils/useCheckPermission.jsx';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  const userDetails = useSelector((state) => state?.user);
  const hasUserAccess = useCheckPermission('Manage user', 'List');
  const hasCompanyAccess = useCheckPermission('Manage Company', 'List');
  const hasLaborAccess = useCheckPermission('Manage Labor', 'List');

  const hasViewAddFarmerAccess = useCheckPermission('Add New Farmer', 'List');

  const hasViewBankAccountAccess = useCheckPermission(
    'Add Bank Account',
    'List',
  );
  const hasHarvestingFarmerAccess = useCheckPermission(
    'Add Harvesting',
    'List',
  );
  const hasGetVideoAccess = useCheckPermission('video', 'List');

  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa>>>>>>>>>>>>>', userDetails);

  // const hasRegisterFarmerAccess = useCheckPermission(
  //   'Add Harvesting',
  //   'List',
  // );
  const hasFarmerBillAccess = useCheckPermission('Farmer Bill', 'List');
  const hasLaborBillAccess = useCheckPermission('Labor bill', 'List');
  const hasCompanyBillAccess = useCheckPermission('Company bill', 'List');
  const hasColdStorageAccess = useCheckPermission('Inventory - CS', 'List');
  const hasEmptyBoxAccess = useCheckPermission('Empty box', 'Company List');
  const hasPackingMaterialAccess = useCheckPermission(
    'Packing Material',
    'Stock list',
  );
  const hasTransportTrucksAccess = useCheckPermission(
    'Transport- Trucks',
    'List',
  );
  const hasTransportPickupAccess = useCheckPermission('Pickups', 'List');

  const hasBIntelligenceSalaryAccess = useCheckPermission(
    'B.Intelligence-salary',
    'mark attendance',
  );
  const hasBRegisterFarmerAccess = useCheckPermission(
    'Register farmer',
    'List',
  );
  console.log('hasBRegisterFarmerAccess', hasBRegisterFarmerAccess);

  const hasBAddPlotsAccess = useCheckPermission('Add plots', 'List');
  const hasBTotalHarvestedAccess = useCheckPermission(
    'Total B harvested',
    'Data',
  );
  const hasBGetBoxesAccess = useCheckPermission('Get boxes', 'list');
  const hasBGetPlotsAccess = useCheckPermission('Get Plots', 'list');
  // audit
  const hasAuditFarmerAccess = useCheckPermission(
    'Audit-farmer ledger',
    'List',
  );
  const hasCompanyLedgerAccess = useCheckPermission('Company Ledger', 'List');
  const hasTransactionBillsAccess = useCheckPermission(
    'Transaction bills',
    'List',
  );
  const hasProfitLossAccess = useCheckPermission('Profit & Loss', 'List');

  //
  console.log('userDetails', userDetails);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-99 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center gap-2 min-h-[68px] h-[68px] flex justify-center">
        <NavLink to="/">
          {/* <img src={Logo} alt="Logo" /> */}
          {/* <div className='text-white font-semibold text-3xl'>Harvest Farm</div> */}
          {userDetails?.data?.images?.length > 0 ? (
            <img
              className="text-white font-semibold text-3xl h-10 w-full flex justify-center"
              src={
                userDetails?.data?.images
                  ? userDetails.data.images
                  : '/logo.png'
              }
              alt=""
            />
          ) : (
            <>{userDetails?.data?.companyName || userDetails?.data?.name}</>
          )}
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-4 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            {/* <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3> */}
            <ul className="mb-6 flex flex-col gap-1.5">
              {userDetails?.data?.isAdmin ? (
                <>
                  {true ? (
                    <SidebarLinkGroup
                      activeCondition={
                        pathname === ROUTES_CONST?.DASHBOARD ||
                        pathname.includes('dashboard')
                      }
                    >
                      {(handleClick, open) => {
                        return (
                          <React.Fragment>
                            <NavLink
                              to="#"
                              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                (pathname === ROUTES_CONST?.DASHBOARD ||
                                  pathname.includes('dashboard')) &&
                                'bg-graydark dark:bg-meta-4'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded
                                  ? handleClick()
                                  : setSidebarExpanded(true);
                              }}
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                                  fill=""
                                />
                                <path
                                  d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                                  fill=""
                                />
                              </svg>
                              Super Admin
                              <svg
                                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                  open && 'rotate-180'
                                }`}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                  fill=""
                                />
                              </svg>
                            </NavLink>
                            <div
                              className={`translate transform overflow-hidden ${
                                !open && 'hidden'
                              }`}
                            >
                              <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                <li>
                                  <NavLink
                                    to={ROUTES_CONST?.SUPPLIER_LIST}
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Supplier List
                                  </NavLink>
                                </li>
                              </ul>
                              <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                <li>
                                  <NavLink
                                    to={ROUTES_CONST?.COLD_STORAGE_LIST}
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Cold Storage List
                                  </NavLink>
                                </li>
                              </ul>
                              <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                <li>
                                  <NavLink
                                    to={ROUTES_CONST.VIDEO_UPLOADING}
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Video Uploading
                                  </NavLink>
                                </li>
                              </ul>
                            </div>
                          </React.Fragment>
                        );
                      }}
                    </SidebarLinkGroup>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to={ROUTES_CONST?.DASHBOARD}
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname === ROUTES_CONST?.DASHBOARD &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                          fill=""
                        ></path>
                        <path
                          d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                          fill=""
                        ></path>
                        <path
                          d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                          fill=""
                        ></path>
                        <path
                          d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                          fill=""
                        ></path>
                      </svg>
                      {userDetails?.data?.type === 'contractor'
                        ? 'Company List'
                        : 'Home'}
                    </NavLink>
                  </li>
                  {userDetails?.data?.type === 'contractor' ? (
                    <li>
                      <NavLink
                        to={ROUTES_CONST?.LABOUR_PAYMENT}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname === ROUTES_CONST?.LABOUR_PAYMENT &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                            fill=""
                          ></path>
                          <path
                            d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                            fill=""
                          ></path>
                          <path
                            d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                            fill=""
                          ></path>
                          <path
                            d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                            fill=""
                          ></path>
                        </svg>
                        Labor Payment
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}
                  {userDetails?.data?.type === 'contractor' ? (
                    <li>
                      <NavLink
                        to={ROUTES_CONST?.LABOR_LEDGER}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname === ROUTES_CONST?.LABOR_LEDGER &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                            fill=""
                          ></path>
                          <path
                            d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                            fill=""
                          ></path>
                          <path
                            d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                            fill=""
                          ></path>
                          <path
                            d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                            fill=""
                          ></path>
                        </svg>
                        Labor Ledger
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}
                  {hasUserAccess ? (
                    <li>
                      <NavLink
                        to={ROUTES_CONST?.USER}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname.includes(ROUTES_CONST?.USER) ||
                            pathname.includes(ROUTES_CONST?.ADD_USER)) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                            fill=""
                          ></path>
                          <path
                            d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                            fill=""
                          ></path>
                        </svg>
                        Manage User
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}
                  {hasCompanyAccess ? (
                    <li>
                      <NavLink
                        to={ROUTES_CONST?.COMPANY}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes(ROUTES_CONST?.COMPANY) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_130_9807)">
                            <path
                              d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V7.53335C0.506348 8.4896 1.29385 9.2771 2.2501 9.2771H15.7501C16.7063 9.2771 17.4938 8.4896 17.4938 7.53335V2.3021C17.4938 1.34585 16.7063 0.55835 15.7501 0.55835ZM16.2563 7.53335C16.2563 7.8146 16.0313 8.0396 15.7501 8.0396H2.2501C1.96885 8.0396 1.74385 7.8146 1.74385 7.53335V2.3021C1.74385 2.02085 1.96885 1.79585 2.2501 1.79585H15.7501C16.0313 1.79585 16.2563 2.02085 16.2563 2.3021V7.53335Z"
                              fill=""
                            ></path>
                            <path
                              d="M6.13135 10.9646H2.2501C1.29385 10.9646 0.506348 11.7521 0.506348 12.7083V15.8021C0.506348 16.7583 1.29385 17.5458 2.2501 17.5458H6.13135C7.0876 17.5458 7.8751 16.7583 7.8751 15.8021V12.7083C7.90322 11.7521 7.11572 10.9646 6.13135 10.9646ZM6.6376 15.8021C6.6376 16.0833 6.4126 16.3083 6.13135 16.3083H2.2501C1.96885 16.3083 1.74385 16.0833 1.74385 15.8021V12.7083C1.74385 12.4271 1.96885 12.2021 2.2501 12.2021H6.13135C6.4126 12.2021 6.6376 12.4271 6.6376 12.7083V15.8021Z"
                              fill=""
                            ></path>
                            <path
                              d="M15.75 10.9646H11.8688C10.9125 10.9646 10.125 11.7521 10.125 12.7083V15.8021C10.125 16.7583 10.9125 17.5458 11.8688 17.5458H15.75C16.7063 17.5458 17.4938 16.7583 17.4938 15.8021V12.7083C17.4938 11.7521 16.7063 10.9646 15.75 10.9646ZM16.2562 15.8021C16.2562 16.0833 16.0312 16.3083 15.75 16.3083H11.8688C11.5875 16.3083 11.3625 16.0833 11.3625 15.8021V12.7083C11.3625 12.4271 11.5875 12.2021 11.8688 12.2021H15.75C16.0312 12.2021 16.2562 12.4271 16.2562 12.7083V15.8021Z"
                              fill=""
                            ></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_130_9807">
                              <rect
                                width="18"
                                height="18"
                                fill="white"
                                transform="translate(0 0.052124)"
                              ></rect>
                            </clipPath>
                          </defs>
                        </svg>
                        Manage Company
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}
                  {hasLaborAccess ? (
                    <li>
                      <NavLink
                        to={ROUTES_CONST?.MANAGE_LABOR}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes(ROUTES_CONST?.MANAGE_LABOR) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                            fill=""
                          ></path>
                          <path
                            d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                            fill=""
                          ></path>
                        </svg>
                        Manage Labor
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}
                  {hasViewAddFarmerAccess ? (
                    <li>
                      <NavLink
                        to={ROUTES_CONST?.ADD_FARMER}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes(ROUTES_CONST?.ADD_FARMER) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                            fill=""
                          ></path>
                          <path
                            d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                            fill=""
                          ></path>
                        </svg>
                        Add New Farmer
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}
                  {hasViewAddFarmerAccess ? (
                    <li>
                      <NavLink
                        to={ROUTES_CONST?.ADD_VENDOR}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes(ROUTES_CONST?.ADD_VENDOR) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                            fill=""
                          ></path>
                          <path
                            d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                            fill=""
                          ></path>
                        </svg>
                        Add New Vendor
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}
                  {hasViewAddFarmerAccess ? (
                    <li>
                      <NavLink
                        to={ROUTES_CONST?.ADD_COMMISSIONAGENT}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes(
                            ROUTES_CONST?.ADD_COMMISSIONAGENT,
                          ) && 'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                            fill=""
                          ></path>
                          <path
                            d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                            fill=""
                          ></path>
                        </svg>
                        Add CommissionAgent
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}
                  {hasViewBankAccountAccess ? (
                    <li>
                      <NavLink
                        to={ROUTES_CONST?.FARMER_BANK_ACCOUNT}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes(
                            ROUTES_CONST?.FARMER_BANK_ACCOUNT,
                          ) && 'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.2875 0.506226H3.7125C2.75625 0.506226 1.96875 1.29373 1.96875 2.24998V15.75C1.96875 16.7062 2.75625 17.5219 3.74063 17.5219H14.3156C15.2719 17.5219 16.0875 16.7344 16.0875 15.75V2.24998C16.0313 1.29373 15.2438 0.506226 14.2875 0.506226ZM14.7656 15.75C14.7656 16.0312 14.5406 16.2562 14.2594 16.2562H3.7125C3.43125 16.2562 3.20625 16.0312 3.20625 15.75V2.24998C3.20625 1.96873 3.43125 1.74373 3.7125 1.74373H14.2875C14.5688 1.74373 14.7938 1.96873 14.7938 2.24998V15.75H14.7656Z"
                            fill=""
                          ></path>
                          <path
                            d="M12.7965 2.6156H9.73086C9.22461 2.6156 8.80273 3.03748 8.80273 3.54373V7.25623C8.80273 7.76248 9.22461 8.18435 9.73086 8.18435H12.7965C13.3027 8.18435 13.7246 7.76248 13.7246 7.25623V3.5156C13.6965 3.03748 13.3027 2.6156 12.7965 2.6156ZM12.4309 6.8906H10.0684V3.88123H12.4309V6.8906Z"
                            fill=""
                          ></path>
                          <path
                            d="M4.97773 4.35938H7.03086C7.36836 4.35938 7.67773 4.07812 7.67773 3.7125C7.67773 3.34687 7.39648 3.09375 7.03086 3.09375H4.94961C4.61211 3.09375 4.30273 3.375 4.30273 3.74063C4.30273 4.10625 4.61211 4.35938 4.97773 4.35938Z"
                            fill=""
                          ></path>
                          <path
                            d="M4.97773 7.9312H7.03086C7.36836 7.9312 7.67773 7.64995 7.67773 7.28433C7.67773 6.9187 7.39648 6.63745 7.03086 6.63745H4.94961C4.61211 6.63745 4.30273 6.9187 4.30273 7.28433C4.30273 7.64995 4.61211 7.9312 4.97773 7.9312Z"
                            fill=""
                          ></path>
                          <path
                            d="M13.0789 10.2374H4.97891C4.64141 10.2374 4.33203 10.5187 4.33203 10.8843C4.33203 11.2499 4.61328 11.5312 4.97891 11.5312H13.0789C13.4164 11.5312 13.7258 11.2499 13.7258 10.8843C13.7258 10.5187 13.4164 10.2374 13.0789 10.2374Z"
                            fill=""
                          ></path>
                          <path
                            d="M13.0789 13.8093H4.97891C4.64141 13.8093 4.33203 14.0906 4.33203 14.4562C4.33203 14.8218 4.61328 15.1031 4.97891 15.1031H13.0789C13.4164 15.1031 13.7258 14.8218 13.7258 14.4562C13.7258 14.0906 13.4164 13.8093 13.0789 13.8093Z"
                            fill=""
                          ></path>
                        </svg>
                        Add Bank Account
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}
                  {hasHarvestingFarmerAccess ? (
                    <li>
                      <NavLink
                        to={ROUTES_CONST?.MANAGE_FARMERS}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes(ROUTES_CONST?.MANAGE_FARMERS) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_130_9756)">
                            <path
                              d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                              fill=""
                            ></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_130_9756">
                              <rect
                                width="18"
                                height="18"
                                fill="white"
                                transform="translate(0 0.052124)"
                              ></rect>
                            </clipPath>
                          </defs>
                        </svg>
                        Add Harvesting Detail
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}

                  {/*  */}
                  {/* hasGetVideoAccess */}
                  {userDetails?.data?.role === 'FruitSupplier' ? (
                    <li>
                      <NavLink
                        to={ROUTES_CONST?.VIDEO_UPLOADING}
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          pathname.includes(ROUTES_CONST?.VIDEO_UPLOADING) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_130_9756)">
                            <path
                              d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                              fill=""
                            ></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_130_9756">
                              <rect
                                width="18"
                                height="18"
                                fill="white"
                                transform="translate(0 0.052124)"
                              ></rect>
                            </clipPath>
                          </defs>
                        </svg>
                        Video
                      </NavLink>
                    </li>
                  ) : (
                    ''
                  )}
                  {/*  */}
                  {hasFarmerBillAccess ||
                  hasLaborBillAccess ||
                  hasCompanyBillAccess ? (
                    <SidebarLinkGroup
                      activeCondition={
                        pathname === ROUTES_CONST?.FARMER_BILL ||
                        pathname === ROUTES_CONST?.LABOUR_BILL ||
                        pathname === ROUTES_CONST?.COMPANY_BILL
                      }
                    >
                      {(handleClick, open) => {
                        return (
                          <React.Fragment>
                            <NavLink
                              to="#"
                              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                (pathname === ROUTES_CONST?.FARMER_BILL ||
                                  pathname === ROUTES_CONST?.LABOUR_BILL ||
                                  pathname === ROUTES_CONST?.COMPANY_BILL) &&
                                'bg-graydark dark:bg-meta-4'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded
                                  ? handleClick()
                                  : setSidebarExpanded(true);
                              }}
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_130_9728)">
                                  <path
                                    d="M3.45928 0.984375H1.6874C1.04053 0.984375 0.478027 1.51875 0.478027 2.19375V3.96563C0.478027 4.6125 1.0124 5.175 1.6874 5.175H3.45928C4.10615 5.175 4.66865 4.64063 4.66865 3.96563V2.16562C4.64053 1.51875 4.10615 0.984375 3.45928 0.984375ZM3.3749 3.88125H1.77178V2.25H3.3749V3.88125Z"
                                    fill=""
                                  ></path>
                                  <path
                                    d="M7.22793 3.71245H16.8748C17.2123 3.71245 17.5217 3.4312 17.5217 3.06558C17.5217 2.69995 17.2404 2.4187 16.8748 2.4187H7.22793C6.89043 2.4187 6.58105 2.69995 6.58105 3.06558C6.58105 3.4312 6.89043 3.71245 7.22793 3.71245Z"
                                    fill=""
                                  ></path>
                                  <path
                                    d="M3.45928 6.75H1.6874C1.04053 6.75 0.478027 7.28437 0.478027 7.95937V9.73125C0.478027 10.3781 1.0124 10.9406 1.6874 10.9406H3.45928C4.10615 10.9406 4.66865 10.4062 4.66865 9.73125V7.95937C4.64053 7.28437 4.10615 6.75 3.45928 6.75ZM3.3749 9.64687H1.77178V8.01562H3.3749V9.64687Z"
                                    fill=""
                                  ></path>
                                  <path
                                    d="M16.8748 8.21252H7.22793C6.89043 8.21252 6.58105 8.49377 6.58105 8.8594C6.58105 9.22502 6.86231 9.47815 7.22793 9.47815H16.8748C17.2123 9.47815 17.5217 9.1969 17.5217 8.8594C17.5217 8.5219 17.2123 8.21252 16.8748 8.21252Z"
                                    fill=""
                                  ></path>
                                  <path
                                    d="M3.45928 12.8531H1.6874C1.04053 12.8531 0.478027 13.3875 0.478027 14.0625V15.8344C0.478027 16.4813 1.0124 17.0438 1.6874 17.0438H3.45928C4.10615 17.0438 4.66865 16.5094 4.66865 15.8344V14.0625C4.64053 13.3875 4.10615 12.8531 3.45928 12.8531ZM3.3749 15.75H1.77178V14.1188H3.3749V15.75Z"
                                    fill=""
                                  ></path>
                                  <path
                                    d="M16.8748 14.2875H7.22793C6.89043 14.2875 6.58105 14.5687 6.58105 14.9344C6.58105 15.3 6.86231 15.5812 7.22793 15.5812H16.8748C17.2123 15.5812 17.5217 15.3 17.5217 14.9344C17.5217 14.5687 17.2123 14.2875 16.8748 14.2875Z"
                                    fill=""
                                  ></path>
                                </g>
                                <defs>
                                  <clipPath id="clip0_130_9728">
                                    <rect
                                      width="18"
                                      height="18"
                                      fill="white"
                                    ></rect>
                                  </clipPath>
                                </defs>
                              </svg>
                              Bills
                              <svg
                                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                  open && 'rotate-180'
                                }`}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                  fill=""
                                />
                              </svg>
                            </NavLink>
                            <div
                              className={`translate transform overflow-hidden ${
                                !open && 'hidden'
                              }`}
                            >
                              {hasFarmerBillAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.FARMER_BILL}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Farmer Bill
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                              {hasFarmerBillAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.VENDOR_BILL}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Vendor Bill
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                              {hasFarmerBillAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.COMMISSIONAGENT_BILL}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      CommissionAgent Bill
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                              {hasCompanyBillAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.COMPANY_BILL}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Company Bill
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                              {hasLaborBillAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.LABOUR_BILL}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Labour Bill
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                            </div>
                          </React.Fragment>
                        );
                      }}
                    </SidebarLinkGroup>
                  ) : (
                    ''
                  )}
                  {/* inventory start */}
                  {hasColdStorageAccess ||
                  hasEmptyBoxAccess ||
                  hasPackingMaterialAccess ? (
                    <SidebarLinkGroup
                      activeCondition={
                        pathname === ROUTES_CONST?.INVENTORY_COLD_STORAGE ||
                        pathname === ROUTES_CONST?.EMPTY_BOX ||
                        pathname === ROUTES_CONST?.PACKING_MATERIAL
                      }
                    >
                      {(handleClick, open) => {
                        return (
                          <React.Fragment>
                            <NavLink
                              to="#"
                              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                (pathname ===
                                  ROUTES_CONST?.INVENTORY_COLD_STORAGE ||
                                  pathname === ROUTES_CONST?.EMPTY_BOX ||
                                  pathname ===
                                    ROUTES_CONST?.PACKING_MATERIAL) &&
                                'bg-graydark dark:bg-meta-4'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded
                                  ? handleClick()
                                  : setSidebarExpanded(true);
                              }}
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                  fill="white"
                                ></path>
                              </svg>
                              Inventory
                              <svg
                                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                  open && 'rotate-180'
                                }`}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                  fill=""
                                />
                              </svg>
                            </NavLink>
                            <div
                              className={`translate transform overflow-hidden ${
                                !open && 'hidden'
                              }`}
                            >
                              {hasColdStorageAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.INVENTORY_COLD_STORAGE}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Cold Storage
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                              {hasEmptyBoxAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.EMPTY_BOX}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Empty Box
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                              {hasPackingMaterialAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.PACKING_MATERIAL}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Packing Material
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                            </div>
                          </React.Fragment>
                        );
                      }}
                    </SidebarLinkGroup>
                  ) : (
                    ''
                  )}
                  {/* inventory ends */}

                  {/* transport start */}
                  {hasTransportTrucksAccess || hasTransportPickupAccess ? (
                    <SidebarLinkGroup
                    // activeCondition={
                    // pathname === ROUTES_CONST?.FARMER_BILL || pathname === ROUTES_CONST?.LABOUR_BILL ||
                    // pathname === ROUTES_CONST?.PACKING_MATERIAL
                    // }
                    >
                      {(handleClick, open) => {
                        return (
                          <React.Fragment>
                            <NavLink
                              to="#"
                              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                // pathname === ROUTES_CONST?.FARMER_BILL || pathname === ROUTES_CONST?.LABOUR_BILL ||
                                pathname === ROUTES_CONST?.PACKING_MATERIAL &&
                                'bg-graydark dark:bg-meta-4'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded
                                  ? handleClick()
                                  : setSidebarExpanded(true);
                              }}
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_130_9728)">
                                  <path
                                    d="M3.45928 0.984375H1.6874C1.04053 0.984375 0.478027 1.51875 0.478027 2.19375V3.96563C0.478027 4.6125 1.0124 5.175 1.6874 5.175H3.45928C4.10615 5.175 4.66865 4.64063 4.66865 3.96563V2.16562C4.64053 1.51875 4.10615 0.984375 3.45928 0.984375ZM3.3749 3.88125H1.77178V2.25H3.3749V3.88125Z"
                                    fill=""
                                  ></path>
                                  <path
                                    d="M7.22793 3.71245H16.8748C17.2123 3.71245 17.5217 3.4312 17.5217 3.06558C17.5217 2.69995 17.2404 2.4187 16.8748 2.4187H7.22793C6.89043 2.4187 6.58105 2.69995 6.58105 3.06558C6.58105 3.4312 6.89043 3.71245 7.22793 3.71245Z"
                                    fill=""
                                  ></path>
                                  <path
                                    d="M3.45928 6.75H1.6874C1.04053 6.75 0.478027 7.28437 0.478027 7.95937V9.73125C0.478027 10.3781 1.0124 10.9406 1.6874 10.9406H3.45928C4.10615 10.9406 4.66865 10.4062 4.66865 9.73125V7.95937C4.64053 7.28437 4.10615 6.75 3.45928 6.75ZM3.3749 9.64687H1.77178V8.01562H3.3749V9.64687Z"
                                    fill=""
                                  ></path>
                                  <path
                                    d="M16.8748 8.21252H7.22793C6.89043 8.21252 6.58105 8.49377 6.58105 8.8594C6.58105 9.22502 6.86231 9.47815 7.22793 9.47815H16.8748C17.2123 9.47815 17.5217 9.1969 17.5217 8.8594C17.5217 8.5219 17.2123 8.21252 16.8748 8.21252Z"
                                    fill=""
                                  ></path>
                                  <path
                                    d="M3.45928 12.8531H1.6874C1.04053 12.8531 0.478027 13.3875 0.478027 14.0625V15.8344C0.478027 16.4813 1.0124 17.0438 1.6874 17.0438H3.45928C4.10615 17.0438 4.66865 16.5094 4.66865 15.8344V14.0625C4.64053 13.3875 4.10615 12.8531 3.45928 12.8531ZM3.3749 15.75H1.77178V14.1188H3.3749V15.75Z"
                                    fill=""
                                  ></path>
                                  <path
                                    d="M16.8748 14.2875H7.22793C6.89043 14.2875 6.58105 14.5687 6.58105 14.9344C6.58105 15.3 6.86231 15.5812 7.22793 15.5812H16.8748C17.2123 15.5812 17.5217 15.3 17.5217 14.9344C17.5217 14.5687 17.2123 14.2875 16.8748 14.2875Z"
                                    fill=""
                                  ></path>
                                </g>
                                <defs>
                                  <clipPath id="clip0_130_9728">
                                    <rect
                                      width="18"
                                      height="18"
                                      fill="white"
                                    ></rect>
                                  </clipPath>
                                </defs>
                              </svg>
                              Transport
                              <svg
                                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                  open && 'rotate-180'
                                }`}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                  fill=""
                                />
                              </svg>
                            </NavLink>
                            <div
                              className={`translate transform overflow-hidden ${
                                !open && 'hidden'
                              }`}
                            >
                              {hasTransportTrucksAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      // to={ROUTES_CONST?.FARMER_BILL}
                                      to={ROUTES_CONST?.TRUCK_WEIGHT}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Trucks
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                              {hasTransportPickupAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.LABOUR_PICKUPS}
                                      // to={'#'}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Pickups
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                            </div>
                          </React.Fragment>
                        );
                      }}
                    </SidebarLinkGroup>
                  ) : (
                    ''
                  )}
                  {/* transport ends */}

                  {/* party pay */}

                  {hasBIntelligenceSalaryAccess ||
                  hasBRegisterFarmerAccess ||
                  hasBAddPlotsAccess ||
                  hasBTotalHarvestedAccess ||
                  hasBGetBoxesAccess ||
                  hasBGetPlotsAccess ? (
                    <SidebarLinkGroup
                      activeCondition={
                        pathname === ROUTES_CONST?.INVENTORY_COLD_STORAGE ||
                        pathname === ROUTES_CONST?.EMPTY_BOX ||
                        pathname === ROUTES_CONST?.PACKING_MATERIAL
                      }
                    >
                      {(handleClick, open) => {
                        return (
                          <React.Fragment>
                            <NavLink
                              to="#"
                              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                (pathname === ROUTES_CONST?.PAY_SALARY ||
                                  pathname === ROUTES_CONST?.REGISTER_FARMER ||
                                  pathname === ROUTES_CONST?.PLOT_VISITS ||
                                  pathname ===
                                    ROUTES_CONST?.TOTOL_BANANA_HARVESTING ||
                                  pathname === ROUTES_CONST?.GET_BOXES ||
                                  pathname === ROUTES_CONST.GETS_PLOTES ||
                                  pathname === ROUTES_CONST.GETS_PLOTES) &&
                                'bg-graydark dark:bg-meta-4'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded
                                  ? handleClick()
                                  : setSidebarExpanded(true);
                              }}
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                  fill="white"
                                ></path>
                              </svg>
                              Bussiness Intelligence
                              <svg
                                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                  open && 'rotate-180'
                                }`}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                  fill=""
                                />
                              </svg>
                            </NavLink>
                            <div
                              className={`translate transform overflow-hidden ${
                                !open && 'hidden'
                              }`}
                            >
                              {hasBIntelligenceSalaryAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.PAY_SALARY}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Pay Salary
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}

                              {hasBRegisterFarmerAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.REGISTER_FARMER}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Register Farmer
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}

                              {hasBAddPlotsAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.PLOT_VISITS}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      PLOT Visits
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}

                              {hasBTotalHarvestedAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.TOTOL_BANANA_HARVESTING}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Total Banana Harvested
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                              {hasBGetBoxesAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST?.GET_BOXES}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Get Boxes
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}

                              {hasBGetPlotsAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST.GETS_PLOTES}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Get Plots
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                            </div>
                          </React.Fragment>
                        );
                      }}
                    </SidebarLinkGroup>
                  ) : (
                    ''
                  )}

                  {/* end party pay  */}

                  {/* audit start */}
                  {hasAuditFarmerAccess ||
                  hasCompanyLedgerAccess ||
                  hasTransactionBillsAccess ||
                  hasProfitLossAccess ? (
                    <SidebarLinkGroup
                      activeCondition={
                        pathname === ROUTES_CONST?.INVENTORY_COLD_STORAGE ||
                        pathname === ROUTES_CONST?.EMPTY_BOX ||
                        pathname === ROUTES_CONST?.PACKING_MATERIAL
                      }
                    >
                      {(handleClick, open) => {
                        return (
                          <React.Fragment>
                            <NavLink
                              to="#"
                              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                // { path: ROUTES_CONST.COMPANY_FARMER_LEDGER, component: CompanyFarmerLedger },
                                // { path: ROUTES_CONST.COMPANY_PARTY_LEDGER, component: CompanypartyLedger },
                                (pathname ===
                                  ROUTES_CONST.COMPANY_FARMER_LEDGER ||
                                  pathname === ROUTES_CONST.TRANSACTION_BILLS ||
                                  pathname === ROUTES_CONST.AUDIT_PROFIT_LOSS ||
                                  pathname ===
                                    ROUTES_CONST.COMPANY_PARTY_LEDGER) &&
                                'bg-graydark dark:bg-meta-4'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded
                                  ? handleClick()
                                  : setSidebarExpanded(true);
                              }}
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.43425 7.5093H2.278C2.44675 7.5093 2.55925 7.3968 2.58737 7.31243L2.98112 6.32805H5.90612L6.27175 7.31243C6.328 7.48118 6.46862 7.5093 6.58112 7.5093H7.453C7.76237 7.48118 7.87487 7.25618 7.76237 7.03118L5.428 1.4343C5.37175 1.26555 5.3155 1.23743 5.14675 1.23743H3.88112C3.76862 1.23743 3.59987 1.29368 3.57175 1.4343L1.153 7.08743C1.0405 7.2843 1.20925 7.5093 1.43425 7.5093ZM4.47175 2.98118L5.3155 5.17493H3.59987L4.47175 2.98118Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M10.1249 2.5031H16.8749C17.2124 2.5031 17.5218 2.22185 17.5218 1.85623C17.5218 1.4906 17.2405 1.20935 16.8749 1.20935H10.1249C9.7874 1.20935 9.47803 1.4906 9.47803 1.85623C9.47803 2.22185 9.75928 2.5031 10.1249 2.5031Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M16.8749 6.21558H10.1249C9.7874 6.21558 9.47803 6.49683 9.47803 6.86245C9.47803 7.22808 9.75928 7.50933 10.1249 7.50933H16.8749C17.2124 7.50933 17.5218 7.22808 17.5218 6.86245C17.5218 6.49683 17.2124 6.21558 16.8749 6.21558Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M16.875 11.1656H1.77187C1.43438 11.1656 1.125 11.4469 1.125 11.8125C1.125 12.1781 1.40625 12.4594 1.77187 12.4594H16.875C17.2125 12.4594 17.5219 12.1781 17.5219 11.8125C17.5219 11.4469 17.2125 11.1656 16.875 11.1656Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M16.875 16.1156H1.77187C1.43438 16.1156 1.125 16.3969 1.125 16.7625C1.125 17.1281 1.40625 17.4094 1.77187 17.4094H16.875C17.2125 17.4094 17.5219 17.1281 17.5219 16.7625C17.5219 16.3969 17.2125 16.1156 16.875 16.1156Z"
                                  fill="white"
                                ></path>
                              </svg>
                              Audit
                              <svg
                                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                  open && 'rotate-180'
                                }`}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                  fill=""
                                />
                              </svg>
                            </NavLink>
                            <div
                              className={`translate transform overflow-hidden ${
                                !open && 'hidden'
                              }`}
                            >
                              {hasAuditFarmerAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST.COMPANY_FARMER_LEDGER}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Farmer Ledger
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}

                              {hasCompanyLedgerAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST.COMPANY_PARTY_LEDGER}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Company/party Ledger
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}

                              {hasTransactionBillsAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST.TRANSACTION_BILLS}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Transactions & Bills
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}

                              {hasProfitLossAccess ? (
                                <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  <li>
                                    <NavLink
                                      to={ROUTES_CONST.AUDIT_PROFIT_LOSS}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Profit and Loss
                                    </NavLink>
                                  </li>
                                </ul>
                              ) : (
                                ''
                              )}
                            </div>
                          </React.Fragment>
                        );
                      }}
                    </SidebarLinkGroup>
                  ) : (
                    ''
                  )}
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
