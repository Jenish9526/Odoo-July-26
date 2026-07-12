import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  UserIcon,
  KeyIcon,
  LinkIcon,
  BellIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Connected accounts mock states
  const [connections, setConnections] = useState({
    github: true,
    slack: false,
    discord: true,
  });

  // Notification mock states
  const [notifs, setNotifs] = useState({
    securityAlerts: true,
    weeklyDigest: false,
    latencySpikes: true,
  });

  // Profile forms hooks
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || 'John Doe',
      email: user?.email || 'admin@dashboard.com',
      org: 'Antigravity Workspace',
      bio: 'Lead Platform Cloud Engineer specializing in Kubernetes, container telemetry clustering systems, and open-source models.',
    },
  });

  // Security change password form hooks
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const newPasswordVal = watchPassword('newPassword');

  const onProfileSave = async (data) => {
    setProfileSaving(true);
    setTimeout(() => {
      setProfileSaving(false);
      showToast('Profile configuration saved successfully!', 'success');
    }, 1200);
  };

  const onPasswordSave = async (data) => {
    setPasswordSaving(true);
    setTimeout(() => {
      setPasswordSaving(false);
      resetPasswordForm();
      showToast('Password credentials updated successfully!', 'success');
    }, 1250);
  };

  const toggleConnection = (key) => {
    setConnections((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(`${key.toUpperCase()} integration status updated.`, 'info');
      return next;
    });
  };

  const toggleNotif = (key) => {
    setNotifs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast('Notification preference updated.', 'info');
      return next;
    });
  };

  return (
    <div className="space-y-6 font-sans w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-dark-border/40 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
            User Account Profile
          </h2>
          <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">
            Configure platform credentials and service integrations.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Avatar Card */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-5 border-glow text-center flex flex-col items-center">
            <div className="relative group select-none">
              <div className="w-24 h-24 rounded-full bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center font-extrabold text-3xl text-brand-violet group-hover:bg-brand-violet/15 transition-all">
                {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
              </div>
              <button
                onClick={() => alert('Mock Avatar upload window triggered.')}
                className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-bold transition-opacity cursor-pointer"
              >
                Change Photo
              </button>
            </div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white mt-4 leading-none">
              {user?.name || 'Operator'}
            </h3>
            <span className="text-[10px] text-brand-violet font-mono font-bold tracking-wider uppercase mt-1.5 px-2 py-0.5 border border-brand-violet/20 bg-brand-violet/5 rounded">
              Platform Admin
            </span>
            <div className="w-full border-t border-gray-100 dark:border-dark-border/40 my-4"></div>
            <p className="text-[10px] text-gray-500 dark:text-dark-muted leading-relaxed text-left">
              Registered email is actively verified. Key authentication keys generated via Google Auth clusters.
            </p>
          </div>

          {/* Connected Accounts */}
          <div className="glass-card rounded-xl p-5 border-glow">
            <div className="flex items-center gap-1.5 mb-4 select-none">
              <LinkIcon className="h-4.5 w-4.5 text-brand-violet" />
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                Connected Services
              </h4>
            </div>
            <div className="space-y-3.5 text-xs font-semibold">
              {Object.keys(connections).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize text-gray-700 dark:text-gray-300 font-bold">{key} Integration</span>
                  <button
                    onClick={() => toggleConnection(key)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                      connections[key] ? 'bg-brand-violet' : 'bg-gray-200 dark:bg-dark-border'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                        connections[key] ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns: Forms sections */}
        <div className="md:col-span-2 space-y-6">
          {/* General Information form */}
          <div className="glass-card rounded-xl p-5 border-glow">
            <div className="flex items-center gap-1.5 mb-5 select-none">
              <UserIcon className="h-4.5 w-4.5 text-brand-cyan" />
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                General Profile Details
              </h4>
            </div>
            <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  icon={UserIcon}
                  error={profileErrors.name}
                  {...registerProfile('name', { required: 'Name is required' })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  icon={EnvelopeIcon}
                  error={profileErrors.email}
                  {...registerProfile('email', { required: 'Email is required' })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Organization"
                  type="text"
                  icon={BuildingOfficeIcon}
                  error={profileErrors.org}
                  {...registerProfile('org')}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-dark-muted">
                  Biography / Summary
                </label>
                <textarea
                  rows="3"
                  className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-2 px-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-violet transition-colors"
                  {...registerProfile('bio')}
                />
              </div>

              <Button type="submit" loading={profileSaving}>
                Save Profile Changes
              </Button>
            </form>
          </div>

          {/* Security Change password */}
          <div className="glass-card rounded-xl p-5 border-glow">
            <div className="flex items-center gap-1.5 mb-5 select-none">
              <KeyIcon className="h-4.5 w-4.5 text-amber-500" />
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                Change Platform Password
              </h4>
            </div>
            <form onSubmit={handlePasswordSubmit(onPasswordSave)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Current Password"
                  type="password"
                  icon={KeyIcon}
                  placeholder="••••••••"
                  error={passwordErrors.currentPassword}
                  {...registerPassword('currentPassword', { required: 'Current password is required' })}
                />
                <Input
                  label="New Password"
                  type="password"
                  icon={KeyIcon}
                  placeholder="••••••••"
                  error={passwordErrors.newPassword}
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  icon={KeyIcon}
                  placeholder="••••••••"
                  error={passwordErrors.confirmNewPassword}
                  {...registerPassword('confirmNewPassword', {
                    required: 'Confirm password is required',
                    validate: (v) => v === newPasswordVal || 'Passwords do not match',
                  })}
                />
              </div>

              <Button type="submit" loading={passwordSaving}>
                Update Security Credentials
              </Button>
            </form>
          </div>

          {/* Notification preferences */}
          <div className="glass-card rounded-xl p-5 border-glow">
            <div className="flex items-center gap-1.5 mb-4 select-none">
              <BellIcon className="h-4.5 w-4.5 text-brand-emerald" />
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-dark-muted uppercase tracking-wider">
                Notification preferences
              </h4>
            </div>
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="sec-alert"
                  checked={notifs.securityAlerts}
                  onChange={() => toggleNotif('securityAlerts')}
                  className="h-4.5 w-4.5 rounded border-gray-200 text-brand-violet cursor-pointer mt-0.5"
                />
                <div>
                  <label htmlFor="sec-alert" className="font-bold text-gray-900 dark:text-white cursor-pointer leading-none">Security Alert Flags</label>
                  <p className="text-[10px] text-gray-400 dark:text-dark-muted mt-0.5">Receive immediate notifications on unexpected credential changes or token renewals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="weekly-dig"
                  checked={notifs.weeklyDigest}
                  onChange={() => toggleNotif('weeklyDigest')}
                  className="h-4.5 w-4.5 rounded border-gray-200 text-brand-violet cursor-pointer mt-0.5"
                />
                <div>
                  <label htmlFor="weekly-dig" className="font-bold text-gray-900 dark:text-white cursor-pointer leading-none">Weekly Digests & Node Reports</label>
                  <p className="text-[10px] text-gray-400 dark:text-dark-muted mt-0.5">Summary metrics and node uptime reviews delivered to your inbox every Monday.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="lat-spike"
                  checked={notifs.latencySpikes}
                  onChange={() => toggleNotif('latencySpikes')}
                  className="h-4.5 w-4.5 rounded border-gray-200 text-brand-violet cursor-pointer mt-0.5"
                />
                <div>
                  <label htmlFor="lat-spike" className="font-bold text-gray-900 dark:text-white cursor-pointer leading-none">API Latency Threshold Alerts</label>
                  <p className="text-[10px] text-gray-400 dark:text-dark-muted mt-0.5">Alert alerts if telemetry response latency crosses 150ms parameters.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
