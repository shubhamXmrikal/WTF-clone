import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, X, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearch, setSort, setFilter } from '../../store/slices/eventSlice';
import { authAPI } from '../../api';

interface Team {
    team: {
        _id: number;
        team_name: string;
        team_image: string;
    };
    user_id: string;
    league_id: number;
    team_id: number;
}

interface Organizer {
    _id: string;
    image: string;
    organizer_name: string;
}

const EventFilters: React.FC = () => {
    const dispatch = useAppDispatch();
    const { filters } = useAppSelector((state) => state.events);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([]);
    const [organizers, setOrganizers] = useState<Organizer[]>([]);

    console.log(favoriteTeams);
    console.log(organizers);

    // Local state for filter selection before applying
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [selectedOrganizers, setSelectedOrganizers] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamsRes = await authAPI.getFavoriteTeams();

                console.log(teamsRes);
                if (teamsRes.status && teamsRes.data.teams) {
                    setFavoriteTeams(teamsRes.data.teams);
                }

                const organizersRes = await authAPI.getOrganizerList();
                if (organizersRes.status && organizersRes.data.organizer_list) {
                    setOrganizers(organizersRes.data.organizer_list);
                }
            } catch (error) {
                console.error('Failed to fetch filter data', error);
            }
        };

        fetchData();
    }, []);

    // Sync local state with redux state when modal opens
    useEffect(() => {
        if (isFilterOpen) {
            setSelectedTeams(filters.filter?.team_id || []);
            setSelectedOrganizers(filters.filter?.organizer_id || []);
        }
    }, [isFilterOpen, filters.filter]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearch(e.target.value));
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'price_high') {
            dispatch(setSort({ price: '-1' }));
        } else if (value === 'price_low') {
            dispatch(setSort({ price: '1' }));
        } else if (value === 'date_new') {
            dispatch(setSort({ event_date: '-1' }));
        } else {
            dispatch(setSort({ event_date: '1' }));
        }
    };

    const toggleTeam = (teamId: string) => {
        setSelectedTeams(prev =>
            prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]
        );
    };

    const toggleOrganizer = (organizerId: string) => {
        setSelectedOrganizers(prev =>
            prev.includes(organizerId)
                ? prev.filter(id => id !== organizerId)
                : [...prev, organizerId]
        );
    };

    const applyFilters = () => {
        dispatch(setFilter({
            team_id: selectedTeams,
            organizer_id: selectedOrganizers
        }));
        setIsFilterOpen(false);
    };

    const clearFilters = () => {
        setSelectedTeams([]);
        setSelectedOrganizers([]);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#111] p-4 rounded-xl border border-gray-800">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search events, teams, or venues..."
                        value={filters.search}
                        onChange={handleSearch}
                        className="w-full bg-black border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                    />
                </div>

                {/* Sort & Filter */}
                <div className="flex gap-4">
                    <div className="relative">
                        <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            onChange={handleSortChange}
                            className="bg-black border border-gray-700 rounded-lg py-2 pl-10 pr-8 text-white appearance-none focus:outline-none focus:border-brand-red cursor-pointer"
                            defaultValue="date_old"
                        >
                            <option value="date_old">Upcoming First</option>
                            <option value="date_new">Latest Added</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={`flex items-center gap-2 border px-4 py-2 rounded-lg transition-all ${(filters.filter?.team_id?.length || 0) + (filters.filter?.organizer_id?.length || 0) > 0
                            ? 'bg-brand-red border-brand-red text-white'
                            : 'bg-black border-gray-700 text-gray-300 hover:text-white hover:border-brand-red'
                            }`}
                    >
                        <Filter size={18} />
                        <span className="md:block hidden">Filters</span>
                        {((filters.filter?.team_id?.length || 0) + (filters.filter?.organizer_id?.length || 0) > 0) && (
                            <span className="bg-white text-brand-red text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {(filters.filter?.team_id?.length || 0) + (filters.filter?.organizer_id?.length || 0)}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Modal */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Filter</h3>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-8">
                            {/* By Team */}
                            <div>
                                <h4 className="text-brand-red mb-4 font-medium">By Team</h4>
                                <div className="space-y-4">
                                    {favoriteTeams.length > 0 ? (
                                        favoriteTeams.map((item) => (
                                            <div
                                                key={item.team_id}
                                                onClick={() => toggleTeam(item.team_id.toString())}
                                                className="flex items-center gap-4 cursor-pointer group"
                                            >
                                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${selectedTeams.includes(item.team_id.toString())
                                                    ? 'border-brand-red bg-brand-red'
                                                    : 'border-gray-600 group-hover:border-gray-400'
                                                    }`}>
                                                    {selectedTeams.includes(item.team_id.toString()) && <Check size={14} className="text-white" />}
                                                </div>
                                                <img
                                                    src={item.team_image}
                                                    alt={item.team_name}
                                                    className="w-8 h-8 object-contain"
                                                />
                                                <span className="text-gray-300 group-hover:text-white transition-colors">
                                                    {item.team_name}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No favorite teams found.</p>
                                    )}
                                </div>
                            </div>

                            {/* By Organizer */}
                            <div>
                                <h4 className="text-brand-red mb-4 font-medium">By Organizer</h4>
                                <div className="space-y-4">
                                    {organizers.length > 0 ? (
                                        organizers.map((org) => (
                                            <div
                                                key={org._id}
                                                onClick={() => toggleOrganizer(org._id)}
                                                className="flex items-center gap-4 cursor-pointer group"
                                            >
                                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${selectedOrganizers.includes(org._id)
                                                    ? 'border-brand-red bg-brand-red'
                                                    : 'border-gray-600 group-hover:border-gray-400'
                                                    }`}>
                                                    {selectedOrganizers.includes(org._id) && <Check size={14} className="text-white" />}
                                                </div>
                                                <img
                                                    src={org.image}
                                                    alt={org.organizer_name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <span className="text-gray-300 group-hover:text-white transition-colors">
                                                    {org.organizer_name}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No organizers found.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-800 flex gap-4">
                            <button
                                onClick={clearFilters}
                                className="flex-1 py-3 rounded-xl bg-[#222] text-white font-medium hover:bg-[#333] transition-all"
                            >
                                Clear all
                            </button>
                            <button
                                onClick={applyFilters}
                                className="flex-1 py-3 rounded-xl bg-brand-red text-white font-medium hover:bg-red-600 transition-all shadow-lg shadow-red-900/20"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EventFilters;
