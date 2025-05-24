import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ROUTES_CONST } from '../constants/routeConstant';
import PageTitle from './../components/PageTitle';
import SignIn from './../pages/Authentication/SignIn';
import AddUserForm from './../pages/user/AddUserForm';
import Farmers from './../pages/farmers';
import Labor from './../pages/labor';
import NewUserListTable from './../pages/user/NewUserListTable';
import SupplierListTable from './../pages/superAdmin/SupplierList';
import ColdStorageTable from './../pages/superAdmin/ColdStorageList';
import RegisterFarmer from './../pages/RegisterFarmer/Index';
import FarmerBankAccount from './../pages/FarmerBankAccount/Index';
import VichelsFarmers from './../pages/VichelsFarmers/Index';
import DefaultLayout from '../layout/DefaultLayout';
import AdddFarmers from '../pages/AddFarmers/Index';
import FarmerSchedules from './../pages/SheduleFarmers/Index';
import Protected from './ProtectedRoute';
import AuthProtected from './AuthProtectedRoute';
import CompanyBil from '../pages/CompanyBill/index';
import FarmerBill from '../pages/FamerBill/index';
import LabourBill from '../pages/LabourBill/index';
import Company from '../pages/company';
import PackingMaterial from '../pages/packingMaterial/PackingMaterial';
import EmptyBox from '../pages/emptyBoxes/index';
import InventColdStorage from '../pages/inventoryColdStorage/index';
import Party from '../pages/ColdStoragePages/Party/Index';
import TruckWeight from '../pages/transport/TruckWeight';
import LabourPickup from '../pages/pickupDaily/LabourPickup';
import TransportPaymet from '../pages/transport/TransportPayment/index';
import PickUpTransportPaymet from '../pages/pickupDaily/TransportPayment';
import ProfilePage from '../pages/profile/UserProfile';
import NotificationPage from '../pages/notification/Notificaiton';
import BussinessPaySalary from '../pages/PaySalary';
import BussinessPlotVisits from '../pages/PlotVisits/Index';
import BusssinessBananaHarvesting from '../pages/BananaHarvesting/Index';
import BussinessGetBox from '../pages/BussinessGetBox/Index';
import BussinessPlotGets from '../pages/bussinessGetPlotes/Index';
import CompanyFarmerLedger from '../pages/CompanyFarmerLedger';
import CompanypartyLedger from '../pages/CompanypartyLedger';
import TaskManagement from '../pages/taskManagement/Index';
import VideoUploading from '../pages/videoUploading/Index';
import TransactionsandBills from '../pages/transactionsAndbills';
import AuditProfitAndLoss from '../pages/auditPofitAndLoss';
import LabourContractorSignUp from '../pages/labour_contractor_pages/labor_contractor_signup/LabourContractorSignUp';
import Dashboard from '../pages/Dashboard/Dashboard';
import LaborLedger from '../pages/labour_contractor_pages/labor_contractor_signup/labor_ledger/LaborLedger';
import LaborPaymentDashboard from '../pages/labour_contractor_pages/labour_Payment/LaborContractorDashboard';
import AdddVendors from '../pages/AddVendors/Index';
import AdddCommissionAgent from '../pages/AddCommissionAgents/Index';
import VendorBill from '../pages/VendorBill';
import CommissionAgentBill from '../pages/CommissionAgentBill/index';
import ExportBill from '../pages/ExportBill';

const RoutesComponent = () => {
  const routeConfig = [
    { path: ROUTES_CONST.DASHBOARD, component: Dashboard },
    { path: ROUTES_CONST.MANAGE_FARMERS, component: Farmers },
    { path: ROUTES_CONST.MANAGE_LABOR, component: Labor },
    { path: ROUTES_CONST.VEHICLE_FARMERS, component: VichelsFarmers },
    { path: ROUTES_CONST.REGISTER_FARMER, component: RegisterFarmer },
    { path: ROUTES_CONST.FARMER_BANK_ACCOUNT, component: FarmerBankAccount },
    // {path : ROUTES_CONST.FARMER_SCHEDULE , component : SheduleFarmers },
    { path: ROUTES_CONST.SUPPLIER_LIST, component: SupplierListTable },
    { path: ROUTES_CONST.COLD_STORAGE_LIST, component: ColdStorageTable },
    { path: ROUTES_CONST.USER, component: NewUserListTable },
    { path: ROUTES_CONST.ADD_USER, component: AddUserForm },
    { path: `${ROUTES_CONST.EDIT_USER}/:userId`, component: AddUserForm },
    { path: ROUTES_CONST.ADD_FARMER, component: AdddFarmers },
    { path: ROUTES_CONST.FARMER_SCHEDULES, component: FarmerSchedules },
    { path: ROUTES_CONST.COMPANY_BILL, component: CompanyBil },
    { path: ROUTES_CONST.COMPANY, component: Company },
    { path: ROUTES_CONST.FARMER_BILL, component: FarmerBill },
    { path: ROUTES_CONST.LABOUR_BILL, component: LabourBill },
    { path: ROUTES_CONST.PACKING_MATERIAL, component: PackingMaterial },
    { path: ROUTES_CONST.EMPTY_BOX, component: EmptyBox },
    { path: ROUTES_CONST.INVENTORY_COLD_STORAGE, component: InventColdStorage },
    { path: ROUTES_CONST.CSPARTY, component: Party },
    { path: ROUTES_CONST.TRUCK_WEIGHT, component: TruckWeight },
    { path: ROUTES_CONST.LABOUR_PICKUPS, component: LabourPickup },
    { path: ROUTES_CONST.TRANSPORT_PAYMENT, component: TransportPaymet },
    {
      path: ROUTES_CONST.PICKUP_TRANSPORT_PAYMENT,
      component: PickUpTransportPaymet,
    },
    { path: ROUTES_CONST.PROFILE_PAGE, component: ProfilePage },
    { path: ROUTES_CONST.NOTIFICATION, component: NotificationPage },
    { path: ROUTES_CONST.PAY_SALARY, component: BussinessPaySalary },
    { path: ROUTES_CONST.PLOT_VISITS, component: BussinessPlotVisits },
    {
      path: ROUTES_CONST.TOTOL_BANANA_HARVESTING,
      component: BusssinessBananaHarvesting,
    },
    { path: ROUTES_CONST.GET_BOXES, component: BussinessGetBox },
    { path: ROUTES_CONST.GETS_PLOTES, component: BussinessPlotGets },
    {
      path: ROUTES_CONST.COMPANY_FARMER_LEDGER,
      component: CompanyFarmerLedger,
    },
    { path: ROUTES_CONST.COMPANY_PARTY_LEDGER, component: CompanypartyLedger },
    { path: ROUTES_CONST.TASK_MANAGEMENT, component: TaskManagement },
    { path: ROUTES_CONST.VIDEO_UPLOADING, component: VideoUploading },
    { path: ROUTES_CONST.TRANSACTION_BILLS, component: TransactionsandBills },
    { path: ROUTES_CONST.AUDIT_PROFIT_LOSS, component: AuditProfitAndLoss },
    { path: ROUTES_CONST.LABOR_LEDGER, component: LaborLedger },

    { path: ROUTES_CONST.LABOUR_PAYMENT, component: LaborPaymentDashboard },
    { path: ROUTES_CONST.ADD_VENDOR, component: AdddVendors },
    { path: ROUTES_CONST.ADD_COMMISSIONAGENT, component: AdddCommissionAgent },
    { path: ROUTES_CONST.VENDOR_BILL, component: VendorBill },
    { path: ROUTES_CONST.COMMISSIONAGENT_BILL, component: CommissionAgentBill },
    { path: ROUTES_CONST.EXPORT_BILL, component: ExportBill },
  ];

  return (
    <>
      <Routes>
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin" />
              <AuthProtected Component={SignIn} />
            </>
          }
        />

        {/* <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <AuthProtected Component={SignUp} />
            </>
          }
        /> */}

        <Route
          path={ROUTES_CONST.LABOR_CONTRACTOR_SIGNUP}
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <AuthProtected Component={LabourContractorSignUp} />
            </>
          }
        />

        <Route element={<DefaultLayout />}>
          {routeConfig?.map((item) => (
            <Route
              key={item?.path}
              path={item?.path}
              element={<Protected Component={item?.component} />}
            />
          ))}
        </Route>
        {/* <Route
          path="/manageFarmers"
          element={
            <>
              <PageTitle title="Manage Farmers" />
              <Farmers />
            </>
          }
        /> */}
        {/* <Route
          path="/manageLabor"
          element={
            <>
              <PageTitle title="Manage Labor" />
              <Labor />
            </>
          }
        /> */}

        {/* farmere management  */}
        {/* <Route
          path="/vichelsFarmers"
          element={
            <>
              <PageTitle title="Register Farmers" />
              <VichelsFarmers />
            </>
          }
        /> */}

        {/*  */}

        {/* <Route
          path="/registerFarmer"
          element={
            <>
              <PageTitle title="Register Farmers" />
              <RegisterFarmer />
            </>
          }
        /> */}

        {/*  */}

        {/* <Route
          path="/FarmerBankAccount"
          element={
            <>
              <PageTitle title="Register Farmers" />
              <FarmerBankAccount />
            </>
          }
        /> */}

        {/* <Route
          path="/FarmerSchedules"
          element={
            <>
              <PageTitle title="Register Farmers" />
              <SheduleFarmers />
            </>
          }
        /> */}

        {/* end farmers management */}

        {/* 
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        /> */}
        {/* <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        /> */}
        {/* <Route
          path="/AddNewUser/:userId"
          element={
            <>
              <PageTitle title="AddNewUser" />
              <AddUserForm />
            </>
          }
        /> */}
        {/* <Route
          path="/supplierList"
          element={
            <>
              <PageTitle title="AddNewUser" />
              <SupplierListTable />
            </>
          }
        /> */}
        {/* <Route
          path="/coldStorageList"
          element={
            <>
              <PageTitle title="AddNewUser" />
              <ColdStorageTable />
            </>
          }
        /> */}
        {/* <Route
          path="/AddNewUser"
          element={
            <>
              <PageTitle title="AddNewUser" />
              <AddUserForm />
            </>
          }
        /> */}
        {/* <Route
          path="/newUserListTable"
          element={
            <>
              <PageTitle title="UserList" />
              <NewUserListTable />
            </>
          }
        /> */}
        {/* <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </>
          }
        /> */}
        {/* <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        /> */}
        {/* <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </>
          }
        /> */}
        {/* <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        /> */}
        {/* <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </>
          }
        /> */}
      </Routes>
    </>
  );
};

export default RoutesComponent;
