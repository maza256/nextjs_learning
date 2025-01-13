'use client';
import Link from 'next/link';
import {usePathname} from "next/navigation";
import clsx from "clsx";
import React from "react";
import {HomeIcon, DocumentDuplicateIcon, UserGroupIcon, GlobeEuropeAfricaIcon, CheckIcon, UsersIcon} from '@heroicons/react/24/outline';
import { LinkType } from '@/app/lib/definitions';


type NavLinksProps = {
    role: string;
}


const iconMapping: { [key: string]: React.ComponentType<{className?: string}> } = {
    HomeIcon: HomeIcon,
    DocumentDuplicateIcon: DocumentDuplicateIcon,
    UserGroupIcon: UserGroupIcon,
    GlobeEuropeAfricaIcon: GlobeEuropeAfricaIcon,
    CheckIcon: CheckIcon,
    UsersIcon: UsersIcon,
};

export default function NavLinks({
                                     role,
                                     links,
                                 }: {
    role: string,
    links: LinkType[]
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
