import { Home, Menu, PlusCircle, User, MessageCircle, ShieldAlert, MapPin } from "lucide-react";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

import { Button } from "./button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Nav menus strictly based on original logic
  const menuItems = [
    { title: "Home Feed", url: "/", icon: <Home className="size-4 shrink-0" /> },
  ];

  if (user) {
    menuItems.push(
      { title: "Post Item", url: "/post", icon: <PlusCircle className="size-4 shrink-0" /> },
      { title: "Messages", url: "/inbox", icon: <MessageCircle className="size-4 shrink-0" /> },
      { title: "Profile", url: "/profile", icon: <User className="size-4 shrink-0" /> }
    );
    if (user.role === 'admin') {
      menuItems.push({ title: "Security Logs", url: "/admin/logs", icon: <ShieldAlert className="size-4 shrink-0" /> });
    }
  }

  return (
    <section className="py-4 fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navbar */}
        <nav className="hidden justify-between md:flex items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black font-heading text-white">
              <MapPin className="text-primary-500" /> Campus<span className="text-primary-500">Connect</span>
            </Link>
            <div className="flex items-center ml-8">
              <NavigationMenu className="[&_[data-radix-navigation-menu-viewport]]:rounded-3xl">
                <NavigationMenuList className="rounded-3xl flex gap-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.title}
                      className={`group inline-flex h-10 w-max items-center justify-center rounded-2xl px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5 ${isActive(item.url) ? "bg-primary-500/20 text-primary-400" : "bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                      to={item.url}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon} {item.title}
                      </span>
                    </Link>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
               <Button onClick={logout} variant="outline" className="border-gray-700 bg-transparent text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 rounded-2xl shadow-none">
                 Logout
               </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white rounded-2xl shadow-none">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary-600 hover:bg-primary-500 text-white rounded-2xl shadow-glow">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navbar */}
        <div className="flex md:hidden items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-black font-heading text-white">
            <MapPin className="text-primary-500" /> Campus<span className="text-primary-500">Connect</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-800 rounded-xl">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto bg-gray-950 border-gray-800 text-white border-l">
                <SheetHeader>
                  <SheetTitle>
                    <Link to="/" className="flex items-center gap-2 text-xl font-black font-heading text-white">
                      <MapPin className="text-primary-500" /> Campus<span className="text-primary-500">Connect</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-8 flex flex-col gap-4">
                   <div className="flex flex-col gap-2">
                     {menuItems.map(item => (
                       <Link
                         key={item.title}
                         to={item.url}
                         className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-colors ${isActive(item.url) ? "bg-primary-900/40 text-primary-400" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                       >
                         {item.icon} {item.title}
                       </Link>
                     ))}
                   </div>
                  <div className="border-t border-gray-800 py-6 mt-4">
                    <div className="flex flex-col gap-3">
                      {user ? (
                         <Button onClick={logout} variant="outline" className="w-full border-gray-700 bg-transparent text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl h-12 text-base">
                           Logout
                         </Button>
                      ) : (
                        <>
                          <Link to="/login" className="w-full">
                            <Button variant="outline" className="w-full border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 rounded-xl h-12 text-base">
                              Sign in
                            </Button>
                          </Link>
                          <Link to="/register" className="w-full">
                             <Button className="w-full bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-glow h-12 text-base">
                               Get Started
                             </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}
