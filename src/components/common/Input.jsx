import React, { useState, forwardRef } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  placeholder,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-1.5 w-full text-left font-sans">
      {label && (
        <label className="text-xs font-semibold text-gray-700 dark:text-dark-text tracking-wider uppercase">
          {label}
        </label>
      )}
      
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-dark-muted">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          className={`
            block w-full rounded-lg text-sm transition-colors duration-200 focus:outline-none
            bg-white dark:bg-dark-card
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-dark-muted
            border ${
              error
                ? 'border-brand-rose focus:border-brand-rose focus:ring-1 focus:ring-brand-rose'
                : 'border-gray-200 dark:border-dark-border focus:border-brand-violet dark:focus:border-brand-violet focus:ring-0'
            }
            ${Icon ? 'pl-10' : 'pl-4'}
            ${isPassword ? 'pr-10' : 'pr-4'}
            py-2.5
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-dark-muted hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error && (
        <span className="text-[11px] font-semibold text-brand-rose tracking-wide block animate-pulse">
          {error.message}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
