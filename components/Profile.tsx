import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout, editProfile } from '../store/slices/authSlice';
import { User, Mail, Phone, Calendar, MapPin, Trophy, LogOut, Heart, Bell, Shield, Edit2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MyBookings from './MyBookings';

const Profile: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        dob: ''
    });

    useEffect(() => {
        if (user) {
            // Convert DOB from DD-MM-YYYY to YYYY-MM-DD for date input
            const dobForInput = user.dob && user.dob.match(/^\d{2}-\d{2}-\d{4}$/)
                ? user.dob.split('-').reverse().join('-')
                : user.dob || '';

            setFormData({
                first_name: user.first_name || '',
                dob: dobForInput
            });
        }
    }, [user]);

    if (!isAuthenticated || !user) {
        navigate('/');
        return null;
    }

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Convert DOB from DD-MM-YYYY to YYYY-MM-DD for date input
        const dobForInput = user.dob && user.dob.match(/^\d{2}-\d{2}-\d{4}$/)
            ? user.dob.split('-').reverse().join('-')
            : user.dob || '';

        setFormData({
            first_name: user.first_name || '',
            dob: dobForInput
        });
    };

    const handleSave = async () => {
        try {
            // Convert date from YYYY-MM-DD to DD-MM-YYYY format for API
            const dobToSend = formData.dob.match(/^\d{4}-\d{2}-\d{2}$/)
                ? formData.dob.split('-').reverse().join('-')
                : formData.dob;

            await dispatch(editProfile({
                first_name: formData.first_name,
                dob: dobToSend
            })).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            // Optionally handle error state here
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not set';
        // Check if dateString is in YYYY-MM-DD format (from input type="date")
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = dateString.split('-');
            return `${day}-${month}-${year}`;
        }

        const [day, month, year] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="min-h-screen bg-brand-dark py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <div className="bg-brand-gray border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-orange-500"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-red/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                        {/* Profile Image */}
                        <div className="relative">
                            <img
                                src={user.image}
                                alt={user.first_name}
                                className="w-32 h-32 rounded-full border-4 border-brand-red/50 object-cover"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-brand-red text-white text-xs px-3 py-1 rounded-full font-bold">
                                {user.verified_user ? 'Verified' : 'Unverified'}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white mb-2 font-display">
                                {user.first_name || 'Football Fan'}
                            </h1>
                            <p className="text-gray-400 mb-4">
                                Referral Code: <span className="text-brand-red font-mono font-bold">{user.referralCode}</span>
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="bg-black/30 px-4 py-2 rounded-lg">
                                    <div className="text-brand-red font-bold text-xl">{user.favorite_league.length}</div>
                                    <div className="text-gray-400 text-sm">Favorite Leagues</div>
                                </div>
                                <div className="bg-black/30 px-4 py-2 rounded-lg">
                                    <div className="text-brand-red font-bold text-xl">{user.favorite_team.length}</div>
                                    <div className="text-gray-400 text-sm">Favorite Teams</div>
                                </div>
                                <div className="bg-black/30 px-4 py-2 rounded-lg">
                                    <div className="text-brand-red font-bold text-xl">{user.watchlist.length}</div>
                                    <div className="text-gray-400 text-sm">Watchlist</div>
                                </div>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-6 py-2 rounded-xl flex items-center gap-2 transition-all border border-red-600/30"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-brand-gray border border-white/10 rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <User size={20} className="text-brand-red" />
                            Personal Information
                        </h2>
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="text-brand-red hover:text-white transition-colors flex items-center gap-2"
                            >
                                <Edit2 size={18} />
                                <span>Edit</span>
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 bg-white/5 px-3 py-1 rounded-lg"
                                >
                                    <X size={16} />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="text-white bg-brand-red hover:bg-red-600 transition-colors flex items-center gap-1 px-3 py-1 rounded-lg"
                                >
                                    <Save size={16} />
                                    <span>Save</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {isEditing ? (
                            <>
                                <div className="bg-black/30 p-4 rounded-lg border border-brand-red/50">
                                    <div className="flex items-center gap-2 text-brand-red text-sm mb-1">
                                        <User size={18} />
                                        <span>First Name</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="bg-transparent text-white font-medium w-full focus:outline-none"
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <InfoItem
                                    icon={<Phone size={18} />}
                                    label="Phone"
                                    value={`+${user.country_code} ${user.phone}`}
                                    disabled={true}
                                />
                                <InfoItem
                                    icon={<Mail size={18} />}
                                    label="Email"
                                    value={user.email || 'Not provided'}
                                    disabled={true}
                                />
                                <div className="bg-black/30 p-4 rounded-lg border border-brand-red/50">
                                    <div className="flex items-center gap-2 text-brand-red text-sm mb-1">
                                        <Calendar size={18} />
                                        <span>Date of Birth</span>
                                    </div>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="bg-transparent text-white font-medium w-full focus:outline-none [color-scheme:dark]"
                                    />
                                </div>
                                <InfoItem
                                    icon={<MapPin size={18} />}
                                    label="Location"
                                    value={user.location || 'Not set'}
                                    disabled={true}
                                />
                            </>
                        ) : (
                            <>
                                <InfoItem
                                    icon={<User size={18} />}
                                    label="First Name"
                                    value={user.first_name || 'Not set'}
                                />
                                <InfoItem
                                    icon={<Phone size={18} />}
                                    label="Phone"
                                    value={`+${user.country_code} ${user.phone}`}
                                />
                                <InfoItem
                                    icon={<Mail size={18} />}
                                    label="Email"
                                    value={user.email || 'Not provided'}
                                />
                                <InfoItem
                                    icon={<Calendar size={18} />}
                                    label="Date of Birth"
                                    value={formatDate(user.dob)}
                                />
                                <InfoItem
                                    icon={<MapPin size={18} />}
                                    label="Location"
                                    value={user.location || 'Not set'}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-brand-gray border border-white/10 rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-brand-red" />
                        Preferences & Settings
                    </h2>

                    <div className="space-y-3">
                        <PreferenceItem
                            icon={<Bell size={18} />}
                            label="Push Notifications"
                            enabled={user.push_notification_status}
                        />
                        <PreferenceItem
                            icon={<Mail size={18} />}
                            label="Email Notifications"
                            enabled={user.email_notification_status}
                        />
                        <PreferenceItem
                            icon={<Phone size={18} />}
                            label="SMS Notifications"
                            enabled={user.sms_notification_status}
                        />
                    </div>
                </div>

                {/* Favorite Teams */}
                {user.favorite_team.length > 0 && (
                    <div className="bg-brand-gray border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Heart size={20} className="text-brand-red" />
                            Favorite Teams
                        </h2>

                        <div className="grid md:grid-cols-2 gap-3">
                            {user.favorite_team.map((team) => (
                                <div
                                    key={team._id}
                                    className="bg-black/30 p-4 rounded-lg border border-white/5 hover:border-brand-red/50 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <Trophy size={20} className="text-brand-red" />
                                        <div>
                                            <div className="text-white font-semibold">Team ID: {team.team_id}</div>
                                            <div className="text-gray-400 text-sm">League ID: {team.league_id}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* My Bookings Section */}
                {/* <div className="mt-6">
                    <MyBookings userId={user._id} />
                </div> */}

                {/* Account Details */}
                <div className="mt-6 bg-brand-gray border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Account Details</h2>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Member Since:</span>
                            <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Last Updated:</span>
                            <span className="text-white">{new Date(user.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Referral Source:</span>
                            <span className="text-white">{user.source || 'Direct'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Referral Type:</span>
                            <span className="text-white">{user.referral || 'None'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    disabled?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, disabled }) => (
    <div className={`bg-black/30 p-4 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            {icon}
            <span>{label}</span>
        </div>
        <div className="text-white font-medium">{value}</div>
    </div>
);

interface PreferenceItemProps {
    icon: React.ReactNode;
    label: string;
    enabled: boolean;
}

const PreferenceItem: React.FC<PreferenceItemProps> = ({ icon, label, enabled }) => (
    <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-white">
            {icon}
            <span>{label}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${enabled
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
            {enabled ? 'Enabled' : 'Disabled'}
        </div>
    </div>
);

export default Profile;
