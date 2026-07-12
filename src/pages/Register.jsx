import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EnvelopeIcon, KeyIcon, UserIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Register = () => {
  const { registerMock, loading } = useAuth();
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false }
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    try {
      setApiError('');
      setSuccessMsg('');
      const res = await registerMock(data.name, data.email, data.password);
      setSuccessMsg(res.message || 'Account created! Please verify email.');
    } catch (err) {
      setApiError(err.message || 'Registration failed');
    }
  };

  if (successMsg) {
    return (
      <AuthLayout title="Account Created" subtitle="Check your mail inbox">
        <div className="text-center space-y-6 py-4 font-sans">
          <div className="w-14 h-14 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald flex items-center justify-center mx-auto animate-bounce">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Activation Required</h3>
          <p className="text-gray-500 dark:text-dark-muted text-xs leading-relaxed max-w-xs mx-auto">
            We have sent a verification code to your email. Please follow the instructions to verify your identity.
          </p>
          <Link
            to="/login"
            className="block w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-button hover:shadow-neon-violet text-center transition-all"
          >
            Return to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Account" subtitle="Register to start tracking real-time models">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-brand-rose/10 border border-brand-rose/20 text-brand-rose rounded-lg text-xs font-semibold text-center"
          >
            {apiError}
          </motion.div>
        )}

        {/* Full name */}
        <Input
          label="Full Name"
          icon={UserIcon}
          placeholder="Linus Torvalds"
          error={errors.name}
          {...register('name', { required: 'Name is required' })}
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          icon={EnvelopeIcon}
          placeholder="linus@linux.org"
          error={errors.email}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address format',
            },
          })}
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          icon={KeyIcon}
          placeholder="••••••••"
          error={errors.password}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        {/* Confirm password */}
        <Input
          label="Confirm Password"
          type="password"
          icon={KeyIcon}
          placeholder="••••••••"
          error={errors.confirmPassword}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === passwordVal || 'Passwords do not match',
          })}
        />

        {/* Terms agreement checkbox */}
        <div className="space-y-1 text-left">
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 rounded border-gray-200 dark:border-dark-border text-brand-violet focus:ring-0 cursor-pointer mt-0.5"
              {...register('terms', { required: 'You must agree to the conditions to register' })}
            />
            <label htmlFor="terms" className="text-xs text-gray-500 dark:text-dark-muted font-medium cursor-pointer">
              I agree to the <span className="text-brand-cyan hover:underline">Terms of Service</span> and <span className="text-brand-cyan hover:underline">Privacy Policy</span>.
            </label>
          </div>
          {errors.terms && (
            <span className="text-[10px] font-semibold text-brand-rose tracking-wide block animate-pulse">
              {errors.terms.message}
            </span>
          )}
        </div>

        {/* Submit */}
        <Button loading={loading} className="w-full mt-2">
          Create Account
        </Button>

        {/* Separator */}
        <div className="relative flex items-center justify-center py-2">
          <div className="border-t border-gray-100 dark:border-dark-border w-full"></div>
          <span className="absolute bg-white dark:bg-dark-card px-3 text-[10px] text-gray-400 dark:text-dark-muted uppercase font-semibold tracking-wider">
            Have an account?
          </span>
        </div>

        {/* Login redirect */}
        <div className="text-center text-sm font-semibold">
          <Link
            to="/login"
            className="text-brand-cyan hover:text-brand-cyanHover transition-colors"
          >
            Sign in instead
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
