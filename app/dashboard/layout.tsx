import SideNav from '@/app/ui/dashboard/sidenav';

export const experimental_ppr = true;
const links = [
    {
        name: 'Home',
        href: '/dashboard',
        icon: 'HomeIcon',
        roles: ['temporary', 'user']
    },
    {
        name: 'Holidays',
        href: '/dashboard/holidays',
        icon: 'GlobeEuropeAfricaIcon',
        roles: ['user', 'temporary']
    },
    {
        name: 'Holiday Approvals',
        href: '/dashboard/approvals',
        icon: 'CheckIcon',
        roles: ['temporary']
    },
    {
        name: 'User Management',
        href: '/dashboard/users',
        icon: 'UsersIcon',
        roles: ['temporary']
    },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav  links={links}/>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}