import { useUser } from "@clerk/clerk-react";
import { ShoppingBagIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { NAVIGATION } from "./Navbar";

function Sidebar() {
    const location = useLocation(); // create an instance of 'useLocation' hook to access current URL and it's components
    
    const { user } = useUser(); // create an instance of 'useUser' hook to access logged-in user's information

    return (
        <div className="drawer-side is-drawer-close:overflow-visible">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                <div className="p-4 w-full">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
                            <ShoppingBagIcon className="w-6 h-6 text-primary-content" />
                        </div>
                        <span className="text-xl font-bold is-drawer-close:hidden">Admin</span>
                    </div>
                </div>

                <ul className="menu w-full grow flex flex-col gap-2">
                    {NAVIGATION.map((item) => { // iterate over each item in 'NAVIGATION' array
                        const isActive = location.pathname === item.path; // check if current URL matches the 'path' of the item, if yes, set 'isActive' to true, otherwise set it to false
                        
                        return (
                            <li key={item.path}> {/* render a list with path as key ie unique identifier */}
                                <Link
                                    to={item.path} // clicking this link takes user to the specified path
                                    className={`is-drawer-close:tooltip is-drawer-close:tooltip-right 
                                    ${isActive ? "bg-primary text-primary-content" : ""}`} // specific styles are applied if 'isActive' is true for this item
                                >
                                    {item.icon} {/* render current item's icon */}
                                    <span className="is-drawer-close:hidden">{item.name}</span> {/* render current item's name */}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="p-4 w-full">
                    <div className="flex items-center gap-3">
                        <div className="avatar shrink-0">
                            <img src={user?.imageUrl} alt={user?.name} className="w-10 h-10 rounded-full" /> {/* render user's image if it exists
                            with user's name as alternate text if image is not present */}
                        </div>

                        <div className="flex-1 min-w-0 is-drawer-close:hidden">
                            <p className="text-sm font-semibold truncate">
                                {user?.firstName} {user?.lastName} {/* render user's first and last name */}
                            </p>

                            <p className="text-xs opacity-60 truncate">
                                {user?.emailAddresses?.[0]?.emailAddress} {/* render user's first email address */}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;