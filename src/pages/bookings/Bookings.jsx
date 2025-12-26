import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Search,
  LayoutList,
  Grid3X3,
  ChevronDown
} from 'lucide-react';
// import { useData } from '../contexts/DataContext';

const Bookings = () => {
  const { bookings, users, updateBooking, updateUser, fields, addBooking, currentAdmin, slotConfigs } = useData();

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showManager, setShowManager] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [showUserResults, setShowUserResults] = useState(false);
  const [addPlayerError, setAddPlayerError] = useState(null);
  const [addPlayerSuccess, setAddPlayerSuccess] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedFieldFilter, setSelectedFieldFilter] = useState('All');
  const [viewMode, setViewMode] = useState('LIST');

  const searchRef = useRef(null);

  const canManageSession = ['Founder & CEO', 'Super Admin', 'Operations Manager'].includes(currentAdmin?.role || '');

  const availableDays = useMemo(() => {
    const daysSet = new Set(['Thursday', 'Friday', 'Saturday']);
    slotConfigs.filter(sc => sc.isActive && sc.type === 'DayOfWeek')
      .forEach(sc => sc.daysOfWeek?.forEach(d => daysSet.add(d)));
    return Array.from(daysSet);
  }, [slotConfigs]);

  const availableTimes = useMemo(() => {
    const timesSet = new Set();
    if (slotConfigs.length === 0) return ['19:00', '20:00', '21:00', '22:00'];
    slotConfigs.filter(sc => sc.isActive).forEach(sc => {
      let currentH = parseInt(sc.startTime.split(':')[0]);
      const endH = parseInt(sc.endTime.split(':')[0]);
      while (currentH < endH) {
        timesSet.add(`${currentH.toString().padStart(2, '0')}:00`);
        currentH++;
      }
    });
    return Array.from(timesSet).sort();
  }, [slotConfigs]);

  const filteredBookings = bookings.filter(b => {
    const matchDay = selectedDay === 'All' || b.dayOfWeek === selectedDay;
    const matchField = selectedFieldFilter === 'All' || b.fieldId === selectedFieldFilter;
    const matchSearch = searchQuery === '' ||
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.players.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchDay && matchField && matchSearch;
  });

  const searchResults = userIdInput.length > 0
    ? users.filter(u =>
      u.name.toLowerCase().includes(userIdInput.toLowerCase()) ||
      u.id.includes(userIdInput) ||
      u.email.toLowerCase().includes(userIdInput.toLowerCase())
    ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowUserResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenManager = (booking) => {
    setSelectedBooking(booking);
    setShowManager(true);
    setUserIdInput('');
    setShowUserResults(false);
    setAddPlayerError(null);
    setAddPlayerSuccess(null);
    setSuggestion(null);
  };

  return (
    <div className="bookings_container">
      {/* KPIs */}
      <div className="bookings_kpi_grid">
        <div className="bookings_kpi_card">
          <div className="bookings_kpi_label">Total Sessions</div>
          <div className="bookings_kpi_value">{bookings.length}</div>
        </div>
        <div className="bookings_kpi_card">
          <div className="bookings_kpi_label">Total Players</div>
          <div className="bookings_kpi_value bookings_success">{bookings.reduce((acc, b) => acc + b.players.length, 0)}</div>
        </div>
        <div className="bookings_kpi_card">
          <div className="bookings_kpi_label">Waitlisted</div>
          <div className="bookings_kpi_value bookings_warning">{bookings.reduce((acc, b) => acc + (b.waitlist?.length || 0), 0)}</div>
        </div>
        <div className="bookings_kpi_card">
          <div className="bookings_kpi_label">Upcoming (24h)</div>
          <div className="bookings_kpi_value bookings_info">{bookings.filter(b => b.status === 'Confirmed').length}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bookings_schedule_panel">
        <div className="bookings_toolbar">
          <div className="bookings_toolbar_left">
            <h3 className="bookings_toolbar_title">Game Schedule</h3>
            <div className="bookings_search_box" ref={searchRef}>
              <Search size={14} className="bookings_search_icon" />
              <input
                type="text"
                placeholder="Search User or Field..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Day filter */}
            <div className="bookings_day_filter">
              {availableDays.map(day => (
                <button
                  key={day}
                  className={selectedDay === day ? 'bookings_active' : ''}
                  onClick={() => setSelectedDay(day)}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
              <button
                className={selectedDay === 'All' ? 'bookings_active' : ''}
                onClick={() => setSelectedDay('All')}
              >
                All
              </button>
            </div>

            {/* Field filter */}
            <div className="bookings_field_filter">
              <select value={selectedFieldFilter} onChange={e => setSelectedFieldFilter(e.target.value)}>
                <option value="All">All Fields</option>
                {fields.filter(f => f.status === 'Active').map(f => (
                  <option key={f.id} value={f.id}>{f.name} - {f.location}</option>
                ))}
              </select>
              <ChevronDown size={12} className="bookings_select_arrow" />
            </div>
          </div>

          {/* View toggle */}
          <div className="bookings_view_toggle">
            <button className={viewMode === 'LIST' ? 'bookings_active' : ''} onClick={() => setViewMode('LIST')}>
              <LayoutList size={14} /> List
            </button>
            <button className={viewMode === 'CALENDAR' ? 'bookings_active' : ''} onClick={() => setViewMode('CALENDAR')}>
              <Grid3X3 size={14} /> Calendar
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {viewMode === 'LIST' ? (
          <div className="bookings_list_view">
            {filteredBookings.length === 0 ? (
              <div className="bookings_empty_state">No bookings found matching filters.</div>
            ) : (
              filteredBookings.map(booking => {
                const playerCount = booking.players.length;
                const isFull = playerCount >= booking.maxPlayers;
                return (
                  <div key={booking.id} className="bookings_booking_row">
                    <div className="bookings_booking_info">
                      <div className="bookings_time_badge">
                        <span className="bookings_day">{booking.dayOfWeek.substring(0, 3)}</span>
                        <span className="bookings_time">{booking.time}</span>
                      </div>
                      <div>
                        <div className="bookings_field_name">
                          <h4>{booking.fieldName}</h4>
                          <span className="bookings_booking_id">{booking.id}</span>
                        </div>
                        <div className="bookings_details">
                          <span><Clock size={14} /> {booking.duration}h</span>
                          <span><MapPin size={14} /> Dubai</span>
                        </div>
                      </div>
                    </div>
                    <div className="bookings_booking_actions">
                      <div className="bookings_roster_status">
                        <div className="bookings_player_count">
                          <Users size={14} />
                          <span className={isFull ? 'bookings_full' : 'bookings_available'}>
                            {playerCount} / {booking.maxPlayers} Players
                          </span>
                        </div>
                        {booking.waitlist?.length > 0 && <div className="bookings_waitlist_count">Waitlist: {booking.waitlist.length}</div>}
                      </div>
                      <button className="bookings_manage_btn" onClick={() => handleOpenManager(booking)}>Manage</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="bookings_calendar_view">
            <div className="bookings_empty_state">Calendar view coming soon.</div>
          </div>
        )}
      </div>

      {/* Session Manager Modal */}
      {showManager && selectedBooking && (
        <div className="bookings_modal_overlay">
          <div className="bookings_modal_content">
            <div className="bookings_modal_header">
              <h3>Manage Session: {selectedBooking.id}</h3>
            </div>
            <div className="bookings_modal_body">
              {/* Roster, Waitlist, Add Player etc. */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
