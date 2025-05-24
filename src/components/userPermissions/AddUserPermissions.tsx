// @ts-nocheck
import { useState } from "react";

const AddUserPermissions = ({ permissions, onToggle }) => {
  return (
    <div className="w-full">
      <div className="">
        <div className="">
          <h3 className="font-medium text-black dark:text-white">
            User Permissions
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 w-full gap-5.5 py-6.5 ">
          {permissions.map((category, categoryIndex) => (
            <div className="rounded-lg flex flex-col gap-4 p-4.5  border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark" key={category.title}>
              <h4 className="font-medium capitalize text-black dark:text-white">{category.title}</h4>
              {category.items.map((item, itemIndex) => (
                <label
                  key={item.label}
                  htmlFor={`${category.title}-${item.label}`}
                  className="flex capitalize cursor-pointer select-none items-center"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`${category.title}-${item.label}`}
                      className="sr-only"
                      checked={item.value}
                      onChange={() => onToggle(categoryIndex, itemIndex)}
                    />
                    <div className="block h-6 w-10 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                    <div
                      className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition ${
                        item.value && '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                      }`}
                    ></div>
                  </div>
                  <span className="ml-3 text-black dark:text-white">{item.label}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddUserPermissions;
