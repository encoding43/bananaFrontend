import React from 'react';
import { Card, CardBody, CardHeader, Divider, Chip } from '@nextui-org/react';

const UserInfoDisplay = ({ user }) => {
  const isFS = user?.data?.role === 'FruitSupplier';
  const isCS = user?.data?.role === 'ColdStorage';
  const isLC = user?.data?.type === 'contractor';

  const InfoItem = ({ label, value }) => (
    <div className="w-full p-4 hover:bg-blue-50 transition-all duration-300 rounded-xl border border-transparent hover:border-blue-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-base font-semibold text-gray-700">{label}</span>
        <span className="text-base font-medium text-blue-600">
          {value || 'N/A'}
        </span>
      </div>
    </div>
  );

  const SectionTitle = ({ title, subtitle }) => (
    <div className="flex flex-col gap-1 mb-2">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
    </div>
  );

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <Card className="shadow-xl border border-gray-100">
        <CardHeader className="px-6 py-5 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex flex-col">
            <p className="text-2xl font-bold text-gray-800">
              Profile Information
            </p>
            <p className="text-base font-medium text-gray-600">
              {isFS
                ? 'Fruit Supplier Details'
                : isCS
                  ? 'Cold Storage Details'
                  : 'Labor Contractor Details'}
            </p>
          </div>
        </CardHeader>
        <Divider className="bg-gradient-to-r from-blue-200 to-purple-200" />
        <CardBody className="p-6">
          {isFS && (
            <div className="space-y-6">
              <div>
                <SectionTitle
                  title="Company Information"
                  subtitle="Basic details about your company"
                />
                <div className="bg-white rounded-xl shadow-sm">
                  <InfoItem
                    label="Company Name"
                    value={user?.data?.companyName}
                  />
                  <InfoItem
                    label="Company Email"
                    value={user?.data?.companyEmail}
                  />
                  <InfoItem
                    label="Company Address"
                    value={user?.data?.companyAddress}
                  />
                </div>
              </div>

              <div>
                <SectionTitle
                  title="Owner Details"
                  subtitle="Contact information of the owner"
                />
                <div className="bg-white rounded-xl shadow-sm">
                  <InfoItem label="Owner Name" value={user?.data?.ownerName} />
                  <InfoItem
                    label="Owner Mobile"
                    value={user?.data?.ownerMobile}
                  />
                </div>
              </div>

              <div>
                <SectionTitle
                  title="Business Information"
                  subtitle="Registration and business details"
                />
                <div className="bg-white rounded-xl shadow-sm">
                  <InfoItem label="GST Number" value={user?.data?.gstIn} />
                  <InfoItem label="IEC Code" value={user?.data?.iecCode} />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-lg font-bold text-gray-800 mb-3">
                    Destination Countries
                  </p>
                  <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl shadow-sm">
                    {user?.data?.destinationCountries?.map((country, index) => (
                      <Chip
                        key={index}
                        variant="shadow"
                        color="primary"
                        size="lg"
                        className="font-medium"
                      >
                        {country}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-lg font-bold text-gray-800 mb-3">
                    Harvesting Areas
                  </p>
                  <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl shadow-sm">
                    {user?.data?.harvestingAreas?.map((area, index) => (
                      <Chip
                        key={index}
                        variant="shadow"
                        color="success"
                        size="lg"
                        className="font-medium"
                      >
                        {area}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-lg font-bold text-gray-800 mb-3">
                    Purchasing Procedures
                  </p>
                  <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl shadow-sm">
                    {user?.data?.purchasingProcedure?.map(
                      (procedure, index) => (
                        <Chip
                          key={index}
                          variant="shadow"
                          color="secondary"
                          size="lg"
                          className="font-medium"
                        >
                          {procedure}
                        </Chip>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCS && (
            <div className="space-y-6">
              <div>
                <SectionTitle
                  title="Storage Facility Information"
                  subtitle="Details about your cold storage facility"
                />
                <div className="bg-white rounded-xl shadow-sm">
                  <InfoItem label="CS Name" value={user?.data?.csName} />
                  <InfoItem label="CS Email" value={user?.data?.csEmail} />
                  <InfoItem label="CS Address" value={user?.data?.csAddress} />
                  <InfoItem
                    label="Storage Capacity"
                    value={`${user?.data?.capacity} units`}
                  />
                </div>
              </div>

              <div>
                <SectionTitle
                  title="Owner Information"
                  subtitle="Contact details of the owner"
                />
                <div className="bg-white rounded-xl shadow-sm">
                  <InfoItem label="Owner Name" value={user?.data?.ownerName} />
                  <InfoItem
                    label="Owner Mobile"
                    value={user?.data?.ownerMobile}
                  />
                </div>
              </div>
            </div>
          )}

          {isLC && (
            <div className="space-y-6">
              <div>
                <SectionTitle
                  title="Personal Information"
                  subtitle="Basic details about the contractor"
                />
                <div className="bg-white rounded-xl shadow-sm">
                  <InfoItem label="Name" value={user?.data?.name} />
                  <InfoItem
                    label="Entity Name"
                    value={user?.data?.entityName}
                  />
                  <InfoItem label="Email" value={user?.data?.email} />
                  <InfoItem label="Mobile" value={user?.data?.mobile} />
                </div>
              </div>

              <div>
                <SectionTitle
                  title="Work Information"
                  subtitle="Details about your work area"
                />
                <div className="bg-white rounded-xl shadow-sm">
                  <InfoItem label="Sector" value={user?.data?.sector} />
                  <InfoItem label="Fruit" value={user?.data?.fruit} />
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default UserInfoDisplay;
