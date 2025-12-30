import React, { useState, useRef, useEffect } from "react";
import "./Bookings.css";
import {
  Grid3X3,
  LayoutList,
  MapPin,
  Search,
  Timer,
  User,
  Users,
} from "lucide-react";
import { GiHamburger } from "react-icons/gi";
import { CiGrid41 } from "react-icons/ci";

// Mock useData — real loyihangizda o'zgartiriladi
const useData = () => {
  const fields = [
    { id: "1", name: "Al Quoz Field", location: "Dubai", status: "Active" },
    { id: "2", name: "JLT Turf", location: "Dubai", status: "Active" },
  ];

  const bookings = [
    {
      id: "BK-001",
      dayOfWeek: "Thursday",
      time: "20:00",
      duration: 1,
      fieldId: "1",
      fieldName: "Al Quoz Field",
      userId: "U123",
      userName: "John Doe",
      status: "Confirmed",
      price: 3,
      maxPlayers: 14,
      players: [
        {
          userId: "U101",
          name: "Alice",
          status: "Confirmed",
          joinedAt: "2025-12-27",
        },
        {
          userId: "U102",
          name: "Bob",
          status: "Confirmed",
          joinedAt: "2025-12-27",
        },
        {
          userId: "U103",
          name: "Charlie",
          status: "Confirmed",
          joinedAt: "2025-12-27",
        },
      ],
      waitlist: [],
      creditUsageHistory: [],
    },
    {
      id: "BK-002",
      dayOfWeek: "Friday",
      time: "19:00",
      duration: 1,
      fieldId: "2",
      fieldName: "JLT Turf",
      userId: "U124",
      userName: "Admin Created",
      status: "Confirmed",
      price: 3,
      maxPlayers: 14,
      players: [
        {
          userId: "U104",
          name: "Diana",
          status: "Confirmed",
          joinedAt: "2025-12-27",
        },
      ],
      waitlist: [],
      creditUsageHistory: [],
    },
  ];

  const users = [
    {
      id: "U101",
      name: "Alice Johnson",
      email: "alice@example.com",
      credits: 15,
      creditsSpent: 30,
      totalBookings: 10,
    },
    {
      id: "U102",
      name: "Bob Smith",
      email: "bob@example.com",
      credits: 5,
      creditsSpent: 45,
      totalBookings: 15,
    },
    {
      id: "U103",
      name: "Charlie Brown",
      email: "charlie@example.com",
      credits: 0,
      creditsSpent: 60,
      totalBookings: 20,
    },
  ];

  const slotConfigs = [
    {
      id: "SC-1",
      type: "DayOfWeek",
      daysOfWeek: ["Thursday", "Friday", "Saturday"],
      startTime: "19:00",
      endTime: "22:00",
      durationMinutes: 60,
      maxPlayers: 14,
      isActive: true,
      fieldId: "1",
    },
  ];

  const currentAdmin = { role: "Super Admin" };

  const updateBooking = async (booking) => {
    console.log("Updated booking:", booking);
    await new Promise((r) => setTimeout(r, 300));
  };

  const updateUser = async (user) => {
    console.log("Updated user:", user);
    await new Promise((r) => setTimeout(r, 300));
  };

  const addBooking = async (booking) => {
    console.log("Added booking:", booking);
    await new Promise((r) => setTimeout(r, 300));
  };

  return {
    bookings,
    users,
    fields,
    slotConfigs,
    updateBooking,
    updateUser,
    addBooking,
    currentAdmin,
  };
};

const Bookings = () => {
  const {
    bookings,
    users,
    updateBooking,
    updateUser,
    fields,
    addBooking,
    currentAdmin,
    slotConfigs,
  } = useData();

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showManager, setShowManager] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userIdInput, setUserIdInput] = useState("");
  const [showUserResults, setShowUserResults] = useState(false);
  const [addPlayerError, setAddPlayerError] = useState(null);
  const [addPlayerSuccess, setAddPlayerSuccess] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedFieldFilter, setSelectedFieldFilter] = useState("All");
  const [viewMode, setViewMode] = useState("LIST");

  const searchRef = useRef(null);

  const canManageSession = [
    "Founder & CEO",
    "Super Admin",
    "Operations Manager",
  ].includes(currentAdmin?.role || "");

  // Available days from slot configs
  const availableDays = React.useMemo(() => {
    const daysSet = new Set(["Thursday", "Friday", "Saturday"]);
    slotConfigs
      .filter((sc) => sc.isActive && sc.type === "DayOfWeek")
      .forEach((sc) => {
        sc.daysOfWeek?.forEach((d) => daysSet.add(d));
      });
    return Array.from(daysSet);
  }, [slotConfigs]);

  // Available times
  const availableTimes = React.useMemo(() => {
    const timesSet = new Set();
    if (slotConfigs.length === 0) return ["19:00", "20:00", "21:00", "22:00"];
    slotConfigs
      .filter((sc) => sc.isActive)
      .forEach((sc) => {
        let currentH = parseInt(sc.startTime.split(":")[0]);
        const endH = parseInt(sc.endTime.split(":")[0]);
        while (currentH < endH) {
          timesSet.add(`${currentH.toString().padStart(2, "0")}:00`);
          currentH++;
        }
      });
    return Array.from(timesSet).sort();
  }, [slotConfigs]);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchDay = selectedDay === "All" || b.dayOfWeek === selectedDay;
    const matchField =
      selectedFieldFilter === "All" || b.fieldId === selectedFieldFilter;
    const matchSearch =
      searchQuery === "" ||
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.players.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchDay && matchField && matchSearch;
  });

  // User search results
  const searchResults =
    userIdInput.length > 0
      ? users
          .filter(
            (u) =>
              u.name.toLowerCase().includes(userIdInput.toLowerCase()) ||
              u.id.includes(userIdInput) ||
              u.email.toLowerCase().includes(userIdInput.toLowerCase())
          )
          .slice(0, 5)
      : [];

  // Click outside to close dropdown
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
    setUserIdInput("");
    setShowUserResults(false);
    setAddPlayerError(null);
    setAddPlayerSuccess(null);
    setSuggestion(null);
  };

  const handleCreateSession = (field, day, time, maxPlayers = 14) => {
    const newBooking = {
      id: `BK-${Date.now()}`,
      date: "2025-12-28",
      time: time,
      dayOfWeek: day,
      duration: 1,
      fieldId: field.id,
      fieldName: field.name,
      userId: "ADMIN",
      userName: "Admin Created",
      status: "Confirmed",
      price: 3,
      maxPlayers: maxPlayers,
      players: [],
      waitlist: [],
      creditUsageHistory: [],
    };
    addBooking(newBooking);
    handleOpenManager(newBooking);
  };

  const findNextAvailableSlot = () => {
    return bookings.find(
      (b) =>
        b.id !== selectedBooking?.id &&
        b.players.length < 14 &&
        b.status === "Confirmed"
    );
  };

  const handleSelectUserForAdd = (user) => {
    setUserIdInput(user.id);
    setShowUserResults(false);
    handleAddPlayer(user);
  };

  const handleChangeBookingField = (newFieldId) => {
    if (!selectedBooking) return;
    const targetField = fields.find((f) => f.id === newFieldId);
    if (targetField) {
      const updated = {
        ...selectedBooking,
        fieldId: targetField.id,
        fieldName: targetField.name,
      };
      updateBooking(updated);
      setSelectedBooking(updated);
    }
  };

  const handleAddPlayer = (directUser) => {
    if (!canManageSession || !selectedBooking) return;
    setAddPlayerError(null);
    setAddPlayerSuccess(null);
    setSuggestion(null);

    const user =
      directUser ||
      users.find(
        (u) =>
          u.id === userIdInput ||
          u.email === userIdInput ||
          u.name === userIdInput
      );
    if (!user) {
      setAddPlayerError("User not found.");
      return;
    }

    const alreadyJoined =
      selectedBooking.players.some((p) => p.userId === user.id) ||
      selectedBooking.waitlist.some((p) => p.userId === user.id);
    if (alreadyJoined) {
      setAddPlayerError(`${user.name} is already in the roster or waitlist.`);
      return;
    }

    const isFull = selectedBooking.players.length >= selectedBooking.maxPlayers;

    if (isFull) {
      const updatedWaitlist = [
        ...selectedBooking.waitlist,
        {
          userId: user.id,
          name: user.name,
          status: "Waitlist",
          joinedAt: new Date().toISOString().split("T")[0],
        },
      ];
      const updatedBooking = { ...selectedBooking, waitlist: updatedWaitlist };
      updateBooking(updatedBooking);
      setSelectedBooking(updatedBooking);
      const nextSlot = findNextAvailableSlot();
      setSuggestion(nextSlot || null);
      setAddPlayerSuccess(`Session full. Added ${user.name} to Waitlist.`);
    } else {
      if (user.credits < 3) {
        setAddPlayerError(
          `Insufficient credits. ${user.name} has ${user.credits} CR, needs 3 CR.`
        );
        return;
      }

      const updatedPlayers = [
        ...selectedBooking.players,
        {
          userId: user.id,
          name: user.name,
          status: "Confirmed",
          joinedAt: new Date().toISOString().split("T")[0],
        },
      ];

      const updatedBooking = { ...selectedBooking, players: updatedPlayers };
      updateBooking(updatedBooking);
      setSelectedBooking(updatedBooking);

      const newCredits = user.credits - 3;
      updateUser({
        ...user,
        credits: newCredits,
        creditsSpent: user.creditsSpent + 3,
        totalBookings: user.totalBookings + 1,
      });

      setAddPlayerSuccess(
        `Added ${user.name} to roster. Deducted 3 CR (Bal: ${newCredits}).`
      );
      setUserIdInput("");
    }
  };

  const handleRemovePlayer = (targetUserId, listType) => {
    if (!canManageSession || !selectedBooking) return;
    setAddPlayerError(null);
    setAddPlayerSuccess(null);

    const user = users.find((u) => u.id === targetUserId);

    if (listType === "players") {
      const updatedPlayers = selectedBooking.players.filter(
        (p) => p.userId !== targetUserId
      );
      const updatedBooking = { ...selectedBooking, players: updatedPlayers };
      updateBooking(updatedBooking);
      setSelectedBooking(updatedBooking);

      if (user) {
        const newCredits = user.credits + 3;
        updateUser({
          ...user,
          credits: newCredits,
          creditsSpent: Math.max(0, user.creditsSpent - 3),
          totalBookings: Math.max(0, user.totalBookings - 1),
        });
        setAddPlayerSuccess(
          `Removed ${user.name}. Refunded 3 CR (Bal: ${newCredits}).`
        );
      }
    } else {
      const updatedWaitlist = selectedBooking.waitlist.filter(
        (p) => p.userId !== targetUserId
      );
      const updatedBooking = { ...selectedBooking, waitlist: updatedWaitlist };
      updateBooking(updatedBooking);
      setSelectedBooking(updatedBooking);
      setAddPlayerSuccess(`Removed from waitlist.`);
    }
  };

  const renderListView = () => (
    <div className="bookings_list-view">
      {filteredBookings.length === 0 ? (
        <div className="empty-state">No bookings found matching filters.</div>
      ) : (
        filteredBookings.map((booking) => {
          const playerCount = booking.players.length;
          const isFull = playerCount >= booking.maxPlayers;

          return (
            <div
              key={booking.id}
              className="booking-item"
              onClick={() => handleOpenManager(booking)}
            >
              <div className="booking-header">
                <div className="time-badge">
                  <span className="day">
                    {booking.dayOfWeek.substring(0, 3)}
                  </span>
                  <span className="time">{booking.time}</span>
                </div>
                <div className="bookings-header_titles">
                  <h4>{booking.fieldName}</h4>
                  <span className="booking-id">{booking.id}</span>
                </div>
              </div>
              <div className="booking-details">
                <span>
                  <Timer /> {booking.duration}h (7v7)
                </span>
                <span>
                  <MapPin /> Dubai
                </span>
              </div>
              <div className="roster-bar">
                <div className="player-count">
                  <Users />
                  <span className={isFull ? "full" : "available"}>
                    {playerCount} / {booking.maxPlayers}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(playerCount / booking.maxPlayers) * 100}%`,
                      background: isFull ? "#f87171" : "#34d399",
                    }}
                  ></div>
                </div>
                {booking.waitlist?.length > 0 && (
                  <div className="waitlist-count">
                    ⏳ Waitlist: {booking.waitlist.length}
                  </div>
                )}
              </div>
              <button className="manage-btn">Manage</button>
            </div>
          );
        })
      )}
    </div>
  );

  const renderCalendarView = () => {
    const activeFields = fields.filter(
      (f) =>
        f.status === "Active" &&
        (selectedFieldFilter === "All" || f.id === selectedFieldFilter)
    );

    return (
      <div className="calendar-container">
        <div className="calendar-inner">
          {/* Header Row */}
          <div className="calendar-row header-row">
            <div className="time-header">Time / Day</div>
            {availableDays.map((day) => (
              <div
                key={day}
                className={`day-header ${
                  selectedDay === day || selectedDay === "All" ? "active" : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time Rows */}
          {availableTimes.map((time) => (
            <div key={time} className="calendar-row">
              <div className="time-label">{time}</div>
              {availableDays.map((day) => {
                const isSelectedFilter =
                  selectedDay === "All" || selectedDay === day;

                if (!isSelectedFilter) {
                  return (
                    <div key={`${day}-${time}`} className="empty-cell">
                      <div className="cell-content"></div>
                    </div>
                  );
                }

                // Har bir field uchun slotlarni ko'rsatish
                return (
                  <div key={`${day}-${time}`} className="day-column">
                    {activeFields.map((field) => {
                      // Slot mavjudligini tekshirish
                      const configExists = slotConfigs.some(
                        (sc) =>
                          sc.isActive &&
                          sc.fieldId === field.id &&
                          (sc.type === "DayOfWeek"
                            ? sc.daysOfWeek?.includes(day)
                            : true) &&
                          time >= sc.startTime &&
                          time < sc.endTime
                      );

                      if (!configExists) {
                        return (
                          <div key={field.id} className="slot-cell locked">
                            <div className="cell-content">
                              <span className="field-name">{field.name}</span>
                              <span className="locked-text">No Slot</span>
                            </div>
                          </div>
                        );
                      }

                      // Mavjud bookingni topish
                      const slotBooking = bookings.find(
                        (b) =>
                          b.dayOfWeek === day &&
                          b.time === time &&
                          b.fieldId === field.id
                      );

                      const maxPlayers =
                        slotConfigs.find((sc) => sc.fieldId === field.id)
                          ?.maxPlayers || 14;
                      const currentPlayers = slotBooking?.players.length || 0;
                      const isFull = currentPlayers >= maxPlayers;

                      if (slotBooking) {
                        // Mavjud booking
                        return (
                          <div
                            key={slotBooking.id}
                            className={`slot-cell booked ${
                              isFull ? "full" : "available"
                            }`}
                            onClick={() => handleOpenManager(slotBooking)}
                          >
                            <div className="cell-content">
                              <div className="field-info">
                                <span className="field-name">{field.name}</span>
                                {isFull && (
                                  <span className="full-badge">FULL</span>
                                )}
                              </div>
                              <div className="player-info">
                                <span className="players-count">
                                  {currentPlayers}/{maxPlayers}
                                </span>
                                <div className="progress-bar">
                                  <div
                                    className="progress-fill"
                                    style={{
                                      width: `${
                                        (currentPlayers / maxPlayers) * 100
                                      }%`,
                                      background: isFull
                                        ? "#ef4444"
                                        : "#10b981",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        // Yangi slot qo'shish
                        return (
                          <div
                            key={`${day}-${time}-${field.id}`}
                            className="slot-cell available"
                            onClick={() =>
                              canManageSession &&
                              handleCreateSession(field, day, time, maxPlayers)
                            }
                          >
                            <div className="cell-content">
                              <span className="field-name">{field.name}</span>
                              <span className="add-action">+ Add Session</span>
                              <div className="capacity-info">
                                <span className="max-players">
                                  0/{maxPlayers}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Return qismida calendar view uchun className qo'shing:
  {
    viewMode === "LIST" ? renderListView() : renderCalendarView();
  }

  return (
    <div className="bookings-container">
      {/* KPIs */}
      <div className="bookings_kpi-grid">
        <div className="bookings_kpi-card">
          <div>Total Sessions</div>
          <div className="bookings_kpi-value">{bookings.length}</div>
        </div>
        <div className="bookings_kpi-card">
          <div>Total Players</div>
          <div className="bookings_kpi-value green">
            {bookings.reduce((acc, b) => acc + b.players.length, 0)}
          </div>
        </div>
        <div className="bookings_kpi-card">
          <div>Waitlisted</div>
          <div className="bookings_kpi-value yellow">
            {bookings.reduce((acc, b) => acc + (b.waitlist?.length || 0), 0)}
          </div>
        </div>
        <div className="bookings_kpi-card">
          <div>Upcoming (24h)</div>
          <div className="bookings_kpi-value blue">
            {bookings.filter((b) => b.status === "Confirmed").length}
          </div>
        </div>
      </div>

      {/* Main Table/Calendar */}
      <div className="bookings_main-panel">
        <div className="bookings_toolbar">
          <div className="bookings_toolbar-left">
            <h3>Game Schedule</h3>
            <div className="bookings_search-box">
              <div className="bookings_icons">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search User or Field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="bookings_day-filters">
              {availableDays.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={selectedDay === day ? "active" : ""}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
              <button
                onClick={() => setSelectedDay("All")}
                className={selectedDay === "All" ? "active" : ""}
              >
                All
              </button>
            </div>

            <select
              value={selectedFieldFilter}
              onChange={(e) => setSelectedFieldFilter(e.target.value)}
            >
              <option value="All">All Fields</option>
              {fields
                .filter((f) => f.status === "Active")
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} - {f.location}
                  </option>
                ))}
            </select>
          </div>

          <div className="bookings_view-toggle">
            <button
              onClick={() => setViewMode("LIST")}
              className={viewMode === "LIST" ? "active" : ""}
            >
              <LayoutList size={17} /> List
            </button>
            <button
              onClick={() => setViewMode("CALENDAR")}
              className={viewMode === "CALENDAR" ? "active" : ""}
            >
              <Grid3X3 size={17} /> Calendar
            </button>
          </div>
        </div>

        {viewMode === "LIST" ? renderListView() : renderCalendarView()}
      </div>

      {/* Session Manager Modal */}
      {showManager && selectedBooking && (
        <div
          className="bookings_modal-overlay"
          onClick={() => setShowManager(false)}
        >
          <div
            className="bookings_session-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bookings_modal-header">
              <div>
                {canManageSession ? (
                  <select
                    value={selectedBooking.fieldId}
                    onChange={(e) => handleChangeBookingField(e.target.value)}
                  >
                    {fields
                      .filter((f) => f.status === "Active")
                      .map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} - {f.location}
                        </option>
                      ))}
                  </select>
                ) : (
                  <span>{selectedBooking.fieldName}</span>
                )}
                <span> - 7v7 Game</span>
              </div>
              <div className="bookings_modal-info">
                <span>
                  {selectedBooking.dayOfWeek}, {selectedBooking.time} • 3
                  Credits/Player
                </span>
              </div>
              <button
                onClick={() => setShowManager(false)}
                className="bookings_close-modal"
              >
                ✖
              </button>
            </div>

            <div className="bookings_modal-body">
              {/* Add Player Section */}
              <div className="bookings_add-player-section">
                <h4>Add Player to Session</h4>
                {canManageSession && (
                  <div className="bookings_add-player-form" ref={searchRef}>
                    <div className="bookings_search-input-wrapper">
                      <input
                        type="text"
                        placeholder="Search User ID or Name..."
                        value={userIdInput}
                        onChange={(e) => {
                          setUserIdInput(e.target.value);
                          setShowUserResults(true);
                        }}
                        onFocus={() => setShowUserResults(true)}
                      />
                      {showUserResults && userIdInput.length > 0 && (
                        <div className="bookings_user-dropdown">
                          {searchResults.length > 0 ? (
                            searchResults.map((user) => (
                              <div
                                key={user.id}
                                onClick={() => handleSelectUserForAdd(user)}
                                className="bookings_user-result"
                              >
                                <div>
                                  <div>{user.name}</div>
                                  <div>{user.email}</div>
                                </div>
                                <div>{user.credits} CR</div>
                              </div>
                            ))
                          ) : (
                            <div className="bookings_no-results">
                              No users found.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleAddPlayer()}>Add</button>
                  </div>
                )}

                {addPlayerError && (
                  <div className="bookings_error-msg">⚠️ {addPlayerError}</div>
                )}
                {addPlayerSuccess && (
                  <div className="bookings_success-msg">
                    ✅ {addPlayerSuccess}
                  </div>
                )}
                {suggestion && (
                  <div className="bookings_suggestion">
                    Suggestion: Move to {suggestion.dayOfWeek} {suggestion.time}{" "}
                    ({suggestion.players.length}/{suggestion.maxPlayers})
                  </div>
                )}
              </div>

              <div className="roster-grid">
                {/* Active Roster */}
                <div className="roster-card">
                  <div className="roster-header">
                    <h4>Active Roster</h4>
                    <span>
                      {selectedBooking.players.length} /{" "}
                      {selectedBooking.maxPlayers}
                    </span>
                  </div>
                  <div className="roster-list">
                    {selectedBooking.players.length === 0 ? (
                      <div>No players joined yet.</div>
                    ) : (
                      selectedBooking.players.map((p, idx) => (
                        <div key={idx} className="player-row">
                          <div>
                            <span className="index">{idx + 1}</span>
                            <div>{p.name}</div>
                            <div>ID: {p.userId}</div>
                          </div>
                          {canManageSession && (
                            <button
                              onClick={() =>
                                handleRemovePlayer(p.userId, "players")
                              }
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Waitlist */}
                <div className="roster-card">
                  <div className="roster-header">
                    <h4>Waiting List</h4>
                    <span>{selectedBooking.waitlist?.length || 0}</span>
                  </div>
                  <div className="roster-list">
                    {!selectedBooking.waitlist ||
                    selectedBooking.waitlist.length === 0 ? (
                      <div className="bookings_waitlist">
                        Waitlist is empty.
                      </div>
                    ) : (
                      selectedBooking.waitlist.map((p, idx) => (
                        <div key={idx} className="player-row">
                          <div>
                            <span className="index">{idx + 1}</span>
                            <div>{p.name}</div>
                            <div>ID: {p.userId}</div>
                          </div>
                          {canManageSession && (
                            <button
                              onClick={() =>
                                handleRemovePlayer(p.userId, "waitlist")
                              }
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
