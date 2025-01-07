'use client';
import Link from 'next/link';
import {usePathname} from "next/navigation";
import clsx from "clsx";
import React from "react";
import { HomeIcon, DocumentDuplicateIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
// const links = [
//   {
//     name: 'Home',
//     href: '/dashboard',
//     icon: HomeIcon,
//     roles: ['admin', 'user']
//   },
//   {
//     name: 'Invoices',
//     href: '/dashboard/invoices',
//     icon: DocumentDuplicateIcon,
//     roles: ['admin']
//   },
//   {
//     name: 'Customers',
//     href: '/dashboard/customers',
//     icon: UserGroupIcon,
//     roles: ['admin', 'user']
//   },
// ];

type NavLinksProps = {
    role: string;
}
type Link = {
    name: string;
    href: string;
    icon: string;
    roles: string[];
};

// NavLinks({
//   links,
//   role,
// }: {
//   links: Link[];
//   role: string;
// }) {

const iconMapping: { [key: string]: React.ComponentType<{className?: string}> } = {
    HomeIcon: HomeIcon,
    DocumentDuplicateIcon: DocumentDuplicateIcon,
    UserGroupIcon: UserGroupIcon,
};

export default function NavLinks({
                                     role,
                                     links,
                                 }: {
    role: string,
    links: Link[]
}) {

    const pathName = usePathname();
    return (
        <>
            {links.filter(link => link.roles.includes(role))
                .map((link) => {
                    const LinkIcon = iconMapping[link.icon];
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                                {
                                    'bg-sky-100 text-blue-600': pathName === link.href,
                                },
                            )}
                        >
                            <LinkIcon className="w-6"/>
                            <p className="hidden md:block">{link.name}</p>
                        </Link>
                    );
                })}
        </>
    );
}
