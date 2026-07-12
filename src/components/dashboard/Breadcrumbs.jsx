import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (path) => {
    switch (path) {
      case 'login': return 'Sign In';
      case 'register': return 'Register';
      case 'forgot-password': return 'Recovery';
      case 'reset-password': return 'Reset';
      default:
        // Capitalize and format
        return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    }
  };

  return (
    <nav className="flex items-center text-xs font-semibold font-sans tracking-wide" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 sm:space-x-1.5">
        <li>
          <Link
            to="/"
            className="text-gray-400 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Console
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const name = getBreadcrumbName(value);

          return (
            <li key={to} className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 text-gray-300 dark:text-dark-border shrink-0" />
              <Link
                to={to}
                className={`ml-1 sm:ml-1.5 ${
                  isLast
                    ? 'text-gray-900 dark:text-white cursor-default pointer-events-none'
                    : 'text-gray-400 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white transition-colors'
                }`}
                aria-current={isLast ? 'page' : undefined}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
