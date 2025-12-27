import React, { useState, useMemo } from "react";
import "./LoadAds.css";

// Mock useData — real loyihada o'zgartiriladi
const useData = () => {
  const campaigns = [
    {
      id: 1,
      name: "Summer Football Fest",
      advertiser: "Nike",
      type: "Rewarded Video",
      status: "Active",
      impressions: 12500,
      revenue: 18750,
      thumbnail: "https://picsum.photos/200/300?random=1",
    },
    {
      id: 2,
      name: "Hydration Boost",
      advertiser: "Coca-Cola",
      type: "Splash Screen",
      status: "Paused",
      impressions: 8900,
      revenue: 8900,
      thumbnail: "https://picsum.photos/200/300?random=2",
    },
    {
      id: 3,
      name: "Energy Drink Launch",
      advertiser: "Red Bull",
      type: "Banner Ad",
      status: "Active",
      impressions: 21000,
      revenue: 6300,
      thumbnail: "https://picsum.photos/200/300?random=3",
    },
  ];

  const shuffleGroups = [
    {
      id: 1,
      name: "Weekend Mix",
      videoIds: [1, 4, 5],
      positions: [2, 5],
      active: true,
    },
    {
      id: 2,
      name: "Evening Rewards",
      videoIds: [6, 7],
      positions: [3],
      active: false,
    },
  ];

  const adQueue = [
    { position: 1, type: "Campaign", referenceId: 1 },
    { position: 2, type: "ShuffleGroup", referenceId: 1 },
    { position: 3, type: "Campaign", referenceId: 2 },
    { position: 4, type: "Campaign", referenceId: 3 },
  ];

  const currentAdmin = { role: "Super Admin" };

  const updateQueue = async (queue) => console.log("Queue updated:", queue);
  const addShuffleGroup = async (group) => console.log("Group added:", group);
  const updateShuffleGroup = async (group) =>
    console.log("Group updated:", group);
  const addCampaign = async (camp) => console.log("Campaign added:", camp);
  const updateCampaign = async (camp) => console.log("Campaign updated:", camp);
  const deleteCampaign = async (id) => console.log("Campaign deleted:", id);

  return {
    campaigns,
    shuffleGroups,
    adQueue,
    updateQueue,
    addShuffleGroup,
    updateShuffleGroup,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    currentAdmin,
  };
};

const LoadAds = () => {
  const {
    campaigns,
    shuffleGroups,
    adQueue,
    updateQueue,
    addShuffleGroup,
    updateShuffleGroup,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    currentAdmin,
  } = useData();

  const [view, setView] = useState("LIST");
  const canManageAds = ["Founder & CEO", "Super Admin"].includes(
    currentAdmin.role
  );

  const [sortKey, setSortKey] = useState("revenue");
  const [sortDir, setSortDir] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCampaignIds, setSelectedCampaignIds] = useState([]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [formState, setFormState] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroupState, setEditingGroupState] = useState({
    name: "",
    positions: [],
    videoIds: [],
    active: true,
  });

  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastSimulationTime, setLastSimulationTime] = useState(new Date());

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedCampaigns = useMemo(() => {
    let data = [...campaigns];
    if (statusFilter !== "ALL")
      data = data.filter((c) => c.status === statusFilter);
    if (!sortKey) return data;
    return data.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      return sortDir === "asc" ? valA - valB : valB - valA;
    });
  }, [campaigns, sortKey, sortDir, statusFilter]);

  const handleSelectAll = (checked) => {
    if (!canManageAds) return;
    setSelectedCampaignIds(checked ? sortedCampaigns.map((c) => c.id) : []);
  };

  const handleSelectRow = (id) => {
    if (!canManageAds) return;
    setSelectedCampaignIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    if (!canManageAds || selectedCampaignIds.length === 0) return;
    if (
      action === "DELETE" &&
      window.confirm(`Delete ${selectedCampaignIds.length} campaigns?`)
    ) {
      selectedCampaignIds.forEach((id) => deleteCampaign(id));
      setSelectedCampaignIds([]);
    } else {
      const newStatus = action === "PAUSE" ? "Paused" : "Active";
      selectedCampaignIds.forEach((id) => {
        const camp = campaigns.find((c) => c.id === id);
        if (camp) updateCampaign({ ...camp, status: newStatus });
      });
    }
  };

  const handleFileChange = (file) => {
    setUploadError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (!file) return;

    let max_size = 50 * 1024 * 1024;
    let error_msg = "";

    if (formState.type === "Rewarded Video") {
      if (!file.type.startsWith("video/"))
        error_msg = "Only video files allowed.";
    } else if (formState.type === "Splash Screen") {
      max_size = 10 * 1024 * 1024;
      if (!file.type.startsWith("image/"))
        error_msg = "Only image files allowed.";
    } else {
      if (!file.type.startsWith("image/"))
        error_msg = "Only image files allowed.";
    }

    if (file.size > max_size)
      error_msg = `File too large. Max ${max_size / (1024 * 1024)}MB.`;

    if (error_msg) {
      setUploadError(error_msg);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const openUploadModal = (type = "Rewarded Video") => {
    if (!canManageAds) return;
    setEditingCampaignId(null);
    setFormState({
      type,
      pricingModel: "FIXED",
      creditsPerView: 1,
      cooldownMinutes: 0,
      status: "Active",
      name: "",
      advertiser: "",
    });
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadError(null);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setEditingCampaignId(null);
    setFormState({});
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
  };

  const handleEditCampaign = (camp) => {
    if (!canManageAds) return;
    setEditingCampaignId(camp.id);
    setFormState({ ...camp });
    setPreviewUrl(camp.thumbnail || null);
    setSelectedFile(null);
    setUploadError(null);
    setIsUploadModalOpen(true);
  };

  const handleSaveCampaign = () => {
    if (!formState.name || !formState.advertiser) {
      setUploadError("Name and Advertiser required.");
      return;
    }
    if (!editingCampaignId && !selectedFile) {
      setUploadError("Upload a creative file.");
      return;
    }

    const campaignToSave = {
      id: editingCampaignId || Math.max(...campaigns.map((c) => c.id), 0) + 1,
      ...formState,
      thumbnail: previewUrl || undefined,
      impressions: editingCampaignId
        ? campaigns.find((c) => c.id === editingCampaignId).impressions
        : 0,
      revenue: editingCampaignId
        ? campaigns.find((c) => c.id === editingCampaignId).revenue
        : 0,
    };

    if (editingCampaignId) updateCampaign(campaignToSave);
    else addCampaign(campaignToSave);
    closeUploadModal();
  };

  const handleDeleteSingle = (id) => {
    if (canManageAds && window.confirm("Delete this campaign?"))
      deleteCampaign(id);
  };

  const handleStatusToggleSingle = (camp) => {
    if (canManageAds)
      updateCampaign({
        ...camp,
        status: camp.status === "Active" ? "Paused" : "Active",
      });
  };

  const handleAddToQueue = (type, id) => {
    if (canManageAds)
      updateQueue([
        ...adQueue,
        { position: adQueue.length + 1, type, referenceId: id },
      ]);
  };

  const handleRemoveFromQueue = (index) => {
    if (canManageAds)
      updateQueue(
        adQueue
          .filter((_, i) => i !== index)
          .map((item, idx) => ({ ...item, position: idx + 1 }))
      );
  };

  const onDragStart = (e, index) => {
    if (canManageAds) setDraggedItemIndex(index);
  };
  const onDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex !== null) setDragOverIndex(index);
  };
  const onDrop = () => {
    if (!canManageAds || draggedItemIndex === null || dragOverIndex === null)
      return;
    const newQueue = [...adQueue];
    const [dragged] = newQueue.splice(draggedItemIndex, 1);
    newQueue.splice(dragOverIndex, 0, dragged);
    updateQueue(newQueue.map((item, idx) => ({ ...item, position: idx + 1 })));
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  const simulatedQueueItems = useMemo(() => {
    return adQueue.slice(0, 5).map((item) => {
      if (item.type === "ShuffleGroup") {
        const group = shuffleGroups.find((g) => g.id === item.referenceId);
        return {
          name: group?.name || "Shuffle Group",
          subtitle: "Random Video",
          isShuffle: true,
        };
      } else {
        const camp = campaigns.find((c) => c.id === item.referenceId);
        return {
          name: camp?.name || "Unknown",
          subtitle: camp?.advertiser || "",
          thumbnail: camp?.thumbnail,
        };
      }
    });
  }, [adQueue, shuffleGroups, campaigns, refreshTrigger]);

  const renderList = () => (
    <div className="list-view">
      <div className="filter-bar">
        {["ALL", "Active", "Paused", "Draft", "Ended"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={statusFilter === status ? "active" : ""}
          >
            {status === "ALL" ? "All" : status}
          </button>
        ))}
      </div>

      {selectedCampaignIds.length > 0 && canManageAds && (
        <div className="bulk-actions">
          <span>{selectedCampaignIds.length} Selected</span>
          <button onClick={() => handleBulkAction("RESUME")}>Resume</button>
          <button onClick={() => handleBulkAction("PAUSE")}>Pause</button>
          <button onClick={() => handleBulkAction("DELETE")} className="delete">
            Delete
          </button>
        </div>
      )}

      <div className="campaigns-table-container">
        <table className="campaigns-table">
          <thead>
            <tr>
              <th>
                {canManageAds && (
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={
                      selectedCampaignIds.length === sortedCampaigns.length &&
                      sortedCampaigns.length > 0
                    }
                  />
                )}
              </th>
              <th>Thumbnail</th>
              <th onClick={() => handleSort("name")}>Campaign</th>
              <th onClick={() => handleSort("advertiser")}>Advertiser</th>
              <th onClick={() => handleSort("type")}>Type</th>
              <th onClick={() => handleSort("impressions")}>Impressions</th>
              <th onClick={() => handleSort("revenue")}>Revenue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCampaigns.map((camp) => (
              <tr
                key={camp.id}
                className={
                  selectedCampaignIds.includes(camp.id) ? "selected" : ""
                }
              >
                <td onClick={(e) => e.stopPropagation()}>
                  {canManageAds && (
                    <input
                      type="checkbox"
                      checked={selectedCampaignIds.includes(camp.id)}
                      onChange={() => handleSelectRow(camp.id)}
                    />
                  )}
                </td>
                <td>
                  <div className="thumb">
                    {camp.thumbnail ? (
                      <img src={camp.thumbnail} alt="" />
                    ) : (
                      "📷"
                    )}
                  </div>
                </td>
                <td>{camp.name}</td>
                <td>{camp.advertiser}</td>
                <td>
                  <span
                    className={`type-badge ${camp.type
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {camp.type}
                  </span>
                </td>
                <td>{camp.impressions.toLocaleString()}</td>
                <td className="revenue">AED {camp.revenue}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusToggleSingle(camp);
                    }}
                    disabled={!canManageAds}
                  >
                    {camp.status === "Active" ? "🔛 Active" : "⏸️ Paused"}
                  </button>
                </td>
                <td className="actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCampaign(camp);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToQueue("Campaign", camp.id);
                    }}
                    disabled={!canManageAds}
                  >
                    Queue
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSingle(camp.id);
                    }}
                    className="delete"
                    disabled={!canManageAds}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderQueueManager = () => (
    <div className="queue-manager">
      <div className="queue-left">
        <div className="shuffle-groups">
          <h3>Shuffle Groups</h3>
          {canManageAds && (
            <button onClick={() => setIsGroupModalOpen(true)}>
              Create Group
            </button>
          )}
          {shuffleGroups.map((group) => (
            <div key={group.id} className="group-item">
              <span>{group.name}</span>
              <span>{group.videoIds.length} Videos</span>
              <span>{group.active ? "Active" : "Inactive"}</span>
            </div>
          ))}
        </div>

        <div className="ad-queue">
          <h3>Ad Queue</h3>
          <div className="queue-list">
            {adQueue.map((item, index) => {
              const isShuffle = item.type === "ShuffleGroup";
              const ref = isShuffle
                ? shuffleGroups.find((g) => g.id === item.referenceId)
                : campaigns.find((c) => c.id === item.referenceId);
              return (
                <div
                  key={index}
                  draggable={canManageAds}
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDrop={onDrop}
                  className={`queue-item ${
                    draggedItemIndex === index ? "dragging" : ""
                  } ${dragOverIndex === index ? "drag-over" : ""}`}
                >
                  <span className="position">{item.position}</span>
                  {canManageAds && <span className="grip">☰</span>}
                  <div className="item-info">
                    {isShuffle
                      ? `🔀 ${ref?.name || "Group"}`
                      : `▶️ ${ref?.name || "Campaign"}`}
                  </div>
                  {canManageAds && (
                    <button
                      onClick={() => handleRemoveFromQueue(index)}
                      className="remove"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="live-preview">
        <h3>Live Simulation</h3>
        <div className="preview-phone">
          <div className="phone-notch"></div>
          <div className="preview-content">
            {simulatedQueueItems.map((item, idx) => (
              <div key={idx} className="preview-ad">
                <div className="ad-header">REWARDED AD</div>
                <div className="ad-title">{item.name}</div>
                <div className="ad-subtitle">{item.subtitle}</div>
                {item.isShuffle && (
                  <div className="shuffle-indicator">Random from pool</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            setRefreshTrigger((prev) => prev + 1);
            setLastSimulationTime(new Date());
          }}
        >
          Refresh Preview
        </button>
      </div>
    </div>
  );

  return (
    <div className="loadads-container">
      <div className="page-header">
        <div>
          <h2>Load Ads</h2>
          <p>Manage campaigns, creative uploads, and serving queue.</p>
        </div>
        <div className="header-actions">
          <div className="view-tabs">
            <button
              onClick={() => setView("LIST")}
              className={view === "LIST" ? "active" : ""}
            >
              Campaigns
            </button>
            <button
              onClick={() => setView("QUEUE")}
              className={view === "QUEUE" ? "active" : ""}
            >
              Queue
            </button>
          </div>
          {canManageAds && (
            <button onClick={() => openUploadModal()} className="upload-btn">
              Upload New Ad
            </button>
          )}
        </div>
      </div>

      {view === "LIST" ? renderList() : renderQueueManager()}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <div className="modal-header">
              <h3>{editingCampaignId ? "Edit Campaign" : "Upload New Ad"}</h3>
              <button onClick={closeUploadModal}>Close</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Campaign Name"
                value={formState.name || ""}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Advertiser"
                value={formState.advertiser || ""}
                onChange={(e) =>
                  setFormState({ ...formState, advertiser: e.target.value })
                }
              />

              <div className="ad-format-selector">
                {["Rewarded Video", "Banner Ad", "Splash Screen"].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setFormState({ ...formState, type })}
                      className={formState.type === type ? "selected" : ""}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>

              <div className="upload-area">
                {!previewUrl ? (
                  <label>
                    Upload Creative
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                    />
                  </label>
                ) : (
                  <div className="preview">
                    {formState.type === "Rewarded Video" ? (
                      <video src={previewUrl} controls />
                    ) : (
                      <img src={previewUrl} alt="Preview" />
                    )}
                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
                {uploadError && <div className="error">{uploadError}</div>}
              </div>

              <div className="modal-actions">
                <button onClick={closeUploadModal}>Cancel</button>
                <button onClick={handleSaveCampaign} className="save">
                  Save Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadAds;
