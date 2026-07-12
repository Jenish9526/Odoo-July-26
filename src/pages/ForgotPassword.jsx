import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ForgotPassword = () => {
  const { forgotPasswordMock, loading } = useAuth();
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '' }
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      setSuccessMsg('');
      const res = await forgotPasswordMock(data.email);
      setSuccessMsg(res.message || 'Reset instructions sent successfully');
    } catch (err) {
      setApiError(err.message || 'Failed to dispatch reset request');
    }
  };

  if (successMsg) {
    return (
      <AuthLayout title="Reset Mail Sent" subtitle="Check your email inbox">
        <div className="text-center space-y-6 py-4 font-sans">
          <div className="w-14 h-14 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald flex items-center justify-center mx-auto animate-bounce">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-4.8a2 2 0 012.22 0l8 4.8A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Request Dispatched</h3>
          <p className="text-gray-500 dark:text-dark-muted text-xs leading-relaxed max-w-xs mx-auto">
            If an account is associated with this email, we have dispatched instructions to configure a new credential.
          </p>
          <div className="bg-gray-50 dark:bg-dark-bg/50 border border-gray-100 dark:border-dark-border rounded-lg p-3 text-[10px] text-gray-400 dark:text-dark-muted font-mono text-left leading-normal">
            <span className="text-brand-violet font-semibold uppercase">Verification Hint:</span><br />
            Since this is a mock interface, click the mock-reset route directly:<br />
            <Link to="/reset-password?token=mock_reset_token_123" className="text-brand-cyan hover:underline font-semibold">
              Reset Password Screen &rarr;
            </Link>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to request recovery instructions">
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

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          icon={EnvelopeIcon}
          placeholder="name@company.com"
          error={errors.email}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address format',
            },
          })}
        />

        {/* Submit */}
        <Button loading={loading} className="w-full mt-2">
          Send Recovery Link
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

export default ForgotPassword;
