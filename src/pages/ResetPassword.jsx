import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { KeyIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ResetPassword = () => {
  const { resetPasswordMock, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { password: '', confirmPassword: '' }
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    try {
      setApiError('');
      setSuccessMsg('');
      if (!token) {
        throw new Error('Verification token is missing. Please click the exact link from the email.');
      }
      const res = await resetPasswordMock(token, data.password);
      setSuccessMsg(res.message || 'Password reset successfully!');
    } catch (err) {
      setApiError(err.message || 'Reset failed');
    }
  };

  if (successMsg) {
    return (
      <AuthLayout title="Password Reset" subtitle="Credential updated successfully">
        <div className="text-center space-y-6 py-4 font-sans">
          <div className="w-14 h-14 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald flex items-center justify-center mx-auto animate-bounce">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Credentials Updated</h3>
          <p className="text-gray-500 dark:text-dark-muted text-xs leading-relaxed max-w-xs mx-auto">
            Your account password has been successfully reset. You can now use your new password to sign in.
          </p>
          <Link
            to="/login"
            className="block w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-button hover:shadow-neon-violet text-center transition-all"
          >
            Go to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Choose a strong, secure new password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-brand-rose/10 border border-brand-rose/20 text-brand-rose rounded-lg text-xs font-semibold text-center"
          >
            {apiError}
          </motion.div>
        )}

        {!token && (
          <div className="p-3 bg-brand-rose/10 border border-brand-rose/20 text-brand-rose rounded-lg text-[10px] text-center font-sans font-semibold">
            {"Warning: No token detected in URL search parameters. Ensure you configured '?token=...' inside the address bar."}
          </div>
        )}

        {/* Password */}
        <Input
          label="New Password"
          type="password"
          icon={KeyIcon}
          placeholder="••••••••"
          error={errors.password}
          disabled={!token}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        {/* Confirm Password */}
        <Input
          label="Confirm New Password"
          type="password"
          icon={KeyIcon}
          placeholder="••••••••"
          error={errors.confirmPassword}
          disabled={!token}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === passwordVal || 'Passwords do not match',
          })}
        />

        {/* Submit */}
        <Button loading={loading} disabled={!token} className="w-full mt-2">
          Reset Password
        </Button>

        {/* Redirect */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white transition-colors mt-2"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
