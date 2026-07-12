import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const { loginMock, loading } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    console.log('Login Form Submitted:', data);
    try {
      setApiError('');
      await loginMock(data.email, data.password);
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Login failed');
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to access your analytics environment">
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

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-700 dark:text-dark-text tracking-wider uppercase">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-brand-cyan hover:text-brand-cyanHover transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
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
        </div>

        {/* Submit */}
        <Button loading={loading} className="w-full mt-2">
          Sign In
        </Button>

        {/* Dev tip */}
        <div className="p-3 bg-gray-50 dark:bg-dark-bg/50 border border-gray-100 dark:border-dark-border rounded-lg text-[10px] text-gray-400 dark:text-dark-muted font-mono leading-relaxed">
          <span className="text-brand-violet font-semibold uppercase">Quick Access:</span><br />
          Email: <span className="text-gray-600 dark:text-gray-300">admin@dashboard.com</span><br />
          Pass: <span className="text-gray-600 dark:text-gray-300">admin123</span>
        </div>

        {/* Separator */}
        <div className="relative flex items-center justify-center py-2">
          <div className="border-t border-gray-100 dark:border-dark-border w-full"></div>
          <span className="absolute bg-white dark:bg-dark-card px-3 text-[10px] text-gray-400 dark:text-dark-muted uppercase font-semibold tracking-wider">
            New to our system?
          </span>
        </div>

        {/* Register link */}
        <div className="text-center text-sm font-semibold">
          <Link
            to="/register"
            className="text-brand-cyan hover:text-brand-cyanHover transition-colors"
          >
            Create an account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
