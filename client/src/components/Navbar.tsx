"use client";
import { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { usePreferenceContext } from "@/context";




function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const path = usePathname()
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const {preferences:{theme},dispatch} = usePreferenceContext()
 
  const navigation = [
    { name: "Home", href: "/", current: path == "/" },
    { name: "Solo", href: "/single", current: path == "/single" },
    { name: "Multiplayer", href: "/multiplayer", current: path == "/multiplayer" },
    { name: "About", href: "/about", current: path == "/about" },
  ];

  useEffect(() => {
    const jwt_token = Cookies.get('jwt_token');
    setIsUserLoggedIn(!!jwt_token);
  },[])

  const logOut = () => {
    Cookies.remove("jwt_token");
    setIsUserLoggedIn(false);
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    if (theme == "dark")
      dispatch({type:"setTheme",payload:"dark"})
    else 
    dispatch({type:"setTheme",payload:"light"})
  };
  return (
    <Disclosure
      as="nav"
      className="bg-white border-b border-gray-200 shadow relative"
    >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-20 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex items-center">
                  <a href="/">
                  <img
                    className="h-8 w-auto mr-2"
                    src="/assets/images/logo.png"
                    alt="Your Company"
                  />
                  </a>
                  <p className="logo_text">GeekyType</p>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-12 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Add the icon button for dark mode */}
                <button
                  onClick={toggleDarkMode}
                  className="inline-flex items-center justify-center rounded-full text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                  {isDarkMode ? (
                    <MoonIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <SunIcon className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */} 
                {isUserLoggedIn ? (
                  <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-100 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                      <span className="sr-only">Open user menu</span>
                      <UserCircleIcon className="h-8 w-8 text-gray-700" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logOut}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                ): (
                  <>
                  <a href='/auth' className="text-gray-700 hidden sm:block hover:bg-gray-100 hover:text-gray-900 rounded-md px-3 py-2 text-sm font-medium">Login/SignUp</a>
                  <a href="/auth"><UserCircleIcon className="h-8 w-8 text-gray-700 sm:hidden" /></a>
                  </>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
