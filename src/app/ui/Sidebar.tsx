"use client";

import React, { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";

const Sidebar: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        {children}
      </div>
      <div className="drawer-side flex">
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <SidebarItem name={"Overview"} path={"/"} />
          <SidebarItem name={"Tables"} path={"/tables"} />
        </ul>
      </div>
    </div>
  );
  //   <div className="flex h-screen w-64 flex-col justify-between border-e bg-white">
  //     <div className="px-4 py-6">
  //       <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
  //         Logo
  //       </span>

  //       <ul className="mt-6 space-y-1">
  //         <SidebarItem name="Overview" path="/" />
  //         <SidebarItem name="Tables" path="/tables" />
  //         <li>
  //           <details className="group [&_summary::-webkit-details-marker]:hidden">
  //             <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
  //               <span className="text-sm font-medium"> Players </span>

  //               <span className="shrink-0 transition duration-300 group-open:-rotate-180">
  //                 <svg
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   className="size-5"
  //                   viewBox="0 0 20 20"
  //                   fill="currentColor"
  //                 >
  //                   <path
  //                     fillRule="evenodd"
  //                     d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
  //                     clipRule="evenodd"
  //                   />
  //                 </svg>
  //               </span>
  //             </summary>

  //             <ul className="mt-2 space-y-1 px-4">
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
  //                 >
  //                   Banned Users
  //                 </a>
  //               </li>

  //               <li>
  //                 <a
  //                   href="#"
  //                   className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
  //                 >
  //                   Calendar
  //                 </a>
  //               </li>
  //             </ul>
  //           </details>
  //         </li>
  //       </ul>
  //     </div>
  //   </div>
  // );
};

interface SidebarItemProps {
  name: string;
  path: string;
}

const SidebarItem = ({ name, path }: SidebarItemProps) => {
  const currentPath = usePathname();
  const style = currentPath === path ? "bg-base-300 rounded-md" : "";

  return (
    <li className={style}>
      <a href={path}>{name}</a>
    </li>
  );
};

export default Sidebar;
