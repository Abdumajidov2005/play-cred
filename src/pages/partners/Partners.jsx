import React, { useState } from "react";
import "./Partners.css";
import {
  Briefcase,
  DollarSign,
  Plus,
  PlusCircle,
  PlusCircleIcon,
  TrendingUp,
} from "lucide-react";
import { FaPlus } from "react-icons/fa";

// Mock useData — real loyihada o'zgartiriladi
const useData = () => {
  const partners = [
    {
      id: "P1",
      name: "Sports World",
      fieldsCount: 3,
      totalBookings: 450,
      status: "Active",
      totalExpenseMonth: 12000,
      totalExpenseYTD: 144000,
    },
    {
      id: "P2",
      name: "Elite Turf",
      fieldsCount: 2,
      totalBookings: 320,
      status: "Active",
      totalExpenseMonth: 9000,
      totalExpenseYTD: 108000,
    },
  ];

  const fields = [
    {
      id: "1",
      name: "Al Quoz Pitch 1",
      location: "Dubai",
      status: "Active",
      pricePerHour: 3,
      partnerId: "P1",
      rentalModel: "Per Hour",
      costPerUnit: 4000,
      contractStart: "2025-01-01",
      contractEnd: "2025-12-31",
    },
    {
      id: "2",
      name: "JLT Field A",
      location: "Dubai",
      status: "Active",
      pricePerHour: 3,
      partnerId: "P2",
      rentalModel: "Per Slot",
      costPerUnit: 4500,
      contractStart: "2025-02-01",
      contractEnd: "2026-01-31",
    },
  ];

  const sponsors = [
    {
      id: "S1",
      name: "Nike",
      industry: "Sports Apparel",
      activeCampaigns: 3,
      packageType: "Premium",
      pricingModel: "Combined",
      cpmValue: 5,
      flatFee: 15000,
      totalRevenueMonth: 25000,
      totalRevenueYTD: 300000,
    },
    {
      id: "S2",
      name: "Coca-Cola",
      industry: "Beverages",
      activeCampaigns: 2,
      packageType: "Basic",
      pricingModel: "CPM",
      cpmValue: 3,
      totalRevenueMonth: 8000,
      totalRevenueYTD: 96000,
    },
  ];

  const campaigns = [
    {
      id: 101,
      name: "Summer Football Fest",
      type: "Banner",
      status: "Active",
      revenue: 12000,
      advertiser: "Nike",
    },
    {
      id: 102,
      name: "Hydration Campaign",
      type: "Video",
      status: "Active",
      revenue: 8000,
      advertiser: "Coca-Cola",
    },
  ];

  const sponsorPackages = [
    { type: "Premium", defaultCpm: 8, defaultFlatFee: 20000 },
    { type: "Basic", defaultCpm: 3, defaultFlatFee: 5000 },
  ];

  const updatePartner = async (p) => console.log("Updated partner:", p);
  const addPartner = async (p) => console.log("Added partner:", p);
  const deletePartner = async (id) => console.log("Deleted partner:", id);
  const updateSponsor = async (s) => console.log("Updated sponsor:", s);
  const addSponsor = async (s) => console.log("Added sponsor:", s);
  const deleteSponsor = async (id) => console.log("Deleted sponsor:", id);
  const updateSponsorPackage = async (pkg) =>
    console.log("Updated package:", pkg);
  const addField = async (f) => console.log("Added field:", f);
  const deleteField = async (id) => console.log("Deleted field:", id);
  const updateField = async (f) => console.log("Updated field:", f);
  const deleteCampaign = async (id) => console.log("Deleted campaign:", id);

  return {
    partners,
    sponsors,
    fields,
    campaigns,
    sponsorPackages,
    updatePartner,
    addPartner,
    deletePartner,
    updateSponsor,
    addSponsor,
    deleteSponsor,
    updateSponsorPackage,
    addField,
    deleteField,
    updateField,
    deleteCampaign,
  };
};

const Partners = () => {
  const {
    partners,
    sponsors,
    fields,
    campaigns,
    sponsorPackages,
    updatePartner,
    addPartner,
    deletePartner,
    updateSponsor,
    addSponsor,
    deleteSponsor,
    updateSponsorPackage,
    addField,
    deleteField,
    updateField,
    deleteCampaign,
  } = useData();

  const [activeTab, setActiveTab] = useState("Fields");
  const [editingPartner, setEditingPartner] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [isEditingPackages, setIsEditingPackages] = useState(false);
  const [tempPackages, setTempPackages] = useState(sponsorPackages);
  const [useCpm, setUseCpm] = useState(false);
  const [useFlat, setUseFlat] = useState(false);
  const [isCreatingPartner, setIsCreatingPartner] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [isCreatingSponsor, setIsCreatingSponsor] = useState(false);
  const [newSponsorName, setNewSponsorName] = useState("");
  const [expandedPartnerId, setExpandedPartnerId] = useState(null);
  const [expandedSponsorId, setExpandedSponsorId] = useState(null);
  const [addingFieldForPartner, setAddingFieldForPartner] = useState(null);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldLocation, setNewFieldLocation] = useState("");

  // Financial calculations
  const totalFieldCost = partners.reduce(
    (acc, p) => acc + p.totalExpenseMonth,
    0
  );
  const totalSponsorRevenue = sponsors.reduce(
    (acc, s) => acc + s.totalRevenueMonth,
    0
  );
  const netDifference = totalSponsorRevenue - totalFieldCost;
  const totalPartners = partners.length;
  const totalFields = partners.reduce((acc, p) => acc + p.fieldsCount, 0);
  const avgFieldCost = totalFields > 0 ? totalFieldCost / totalFields : 0;
  const totalSponsors = sponsors.length;
  const premiumSponsors = sponsors.filter(
    (s) => s.packageType === "Premium"
  ).length;

  const handleEditSponsorClick = (sponsor) => {
    setEditingSponsor(sponsor);
    setUseCpm(
      sponsor.pricingModel === "CPM" || sponsor.pricingModel === "Combined"
    );
    setUseFlat(
      sponsor.pricingModel === "Flat Fee" || sponsor.pricingModel === "Combined"
    );
  };

  const handleSavePartner = () => {
    if (editingPartner) {
      updatePartner(editingPartner);
      setEditingPartner(null);
    }
  };

  const handleSaveField = () => {
    if (editingField) {
      updateField(editingField);
      setEditingField(null);
    }
  };

  const handleDeletePartner = (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to remove partner "${name}"? This action cannot be undone.`
      )
    ) {
      deletePartner(id);
    }
  };

  const handleCreatePartner = () => {
    if (!newPartnerName) return;
    const newId = `P-${Date.now()}`;
    addPartner({
      id: newId,
      name: newPartnerName,
      fieldsCount: 0,
      totalBookings: 0,
      status: "Active",
      totalExpenseMonth: 0,
      totalExpenseYTD: 0,
    });
    setIsCreatingPartner(false);
    setNewPartnerName("");
  };

  const handleCreateField = (partnerId) => {
    if (!newFieldName || !newFieldLocation) return;
    const newId = (
      Math.max(0, ...fields.map((f) => parseInt(f.id) || 0)) + 1
    ).toString();
    addField({
      id: newId,
      name: newFieldName,
      location: newFieldLocation,
      status: "Active",
      pricePerHour: 3,
      partnerId: partnerId,
      rentalModel: "Per Hour",
      costPerUnit: 100,
      contractStart: new Date().toISOString().split("T")[0],
      contractEnd: "2025-12-31",
    });
    setAddingFieldForPartner(null);
    setNewFieldName("");
    setNewFieldLocation("");
  };

  const handleDeleteField = (id) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      deleteField(id);
    }
  };

  const handleDeleteCampaign = (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      deleteCampaign(id);
    }
  };

  const handleSaveSponsor = () => {
    if (editingSponsor) {
      let model = "CPM";
      if (useCpm && useFlat) model = "Combined";
      else if (useFlat) model = "Flat Fee";

      updateSponsor({
        ...editingSponsor,
        pricingModel: model,
        cpmValue: useCpm ? editingSponsor.cpmValue : undefined,
        flatFee: useFlat ? editingSponsor.flatFee : undefined,
      });
      setEditingSponsor(null);
    }
  };

  const handleDeleteSponsor = (id, name) => {
    if (window.confirm(`Are you sure you want to remove sponsor "${name}"?`)) {
      deleteSponsor(id);
    }
  };

  const handleCreateSponsor = () => {
    if (!newSponsorName) return;
    const newId = `S-${Date.now()}`;
    addSponsor({
      id: newId,
      name: newSponsorName,
      industry: "General",
      activeCampaigns: 0,
      contactEmail: "",
      packageType: "Basic",
      pricingModel: "CPM",
      totalRevenueMonth: 0,
      totalRevenueYTD: 0,
      impressionsMonth: 0,
    });
    setIsCreatingSponsor(false);
    setNewSponsorName("");
  };

  const handleSavePackages = () => {
    tempPackages.forEach((pkg) => updateSponsorPackage(pkg));
    setIsEditingPackages(false);
  };

  const toggleExpandPartner = (id) => {
    setExpandedPartnerId(expandedPartnerId === id ? null : id);
  };

  const toggleExpandSponsor = (id) => {
    setExpandedSponsorId(expandedSponsorId === id ? null : id);
  };

  const renderPricingModel = (sponsor) => {
    if (sponsor.pricingModel === "Combined") {
      return (
        <div>
          <div className="flat-fee">
            AED {(sponsor.flatFee || 0).toLocaleString()}/mo
          </div>
          <div className="cpm-note">+ AED {sponsor.cpmValue || 0} CPM</div>
        </div>
      );
    }
    if (sponsor.pricingModel === "Flat Fee") {
      return (
        <div className="flat-fee">
          AED {(sponsor.flatFee || 0).toLocaleString()}/mo
        </div>
      );
    }
    return <div className="cpm-value">AED {sponsor.cpmValue || 0} CPM</div>;
  };

  return (
    <div className="partners-container">
      {/* Financial Snapshot */}
      <div className="financial-grid">
        <div className="financial-card expense">
          <h3>Field Rental Costs (Expense)</h3>
          <div className="amount">AED {totalFieldCost.toLocaleString()}</div>
          <div className="note">Outgoing Payments</div>
          <div className="partners_title">
            <Briefcase size={50} />
          </div>
        </div>
        <div className="financial-card revenue">
          <h3>Sponsorship Revenue (Income)</h3>
          <div className="amount">
            AED {totalSponsorRevenue.toLocaleString()}
          </div>
          <div className="note">Incoming Revenue</div>
          <div className="partners_title">
            <DollarSign size={50} />
          </div>
        </div>
        <div className="financial-card net">
          <h3>Net Difference</h3>
          <div className={`amount ${netDifference >= 0 ? "profit" : "loss"}`}>
            {netDifference >= 0 ? "+" : ""} AED{" "}
            {Math.abs(netDifference).toLocaleString()}
          </div>
          <div className="note">Monthly Profit/Loss from Ops</div>
          <div className="partners_title">
            <TrendingUp size={50} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          onClick={() => setActiveTab("Fields")}
          className={activeTab === "Fields" ? "active" : ""}
        >
          Field Partners (Expenses)
        </button>
        <button
          onClick={() => setActiveTab("Sponsors")}
          className={activeTab === "Sponsors" ? "active" : ""}
        >
          Advertisers & Sponsors (Revenue)
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === "Fields" ? (
          <div className="fields-tab">
            {/* Summary */}
            <div className="summary-grid">
              <div>
                Total Partners <span>{totalPartners}</span>
              </div>
              <div>
                Active Fields <span>{totalFields}</span>
              </div>
              <div>
                Avg Cost / Field{" "}
                <span className="cost">AED {avgFieldCost.toFixed(0)}</span>
              </div>
              <div>
                Total Expense (Mo){" "}
                <span className="cost">
                  AED {totalFieldCost.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
              <button onClick={() => setIsCreatingPartner(true)}>
                <PlusCircle size={20}/> Add New Partner
              </button>
            </div>

            {/* Partners Table */}
            <div className="partners-table-container">
              <table className="partners-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Partner Name</th>
                    <th>Fields</th>
                    <th>Total Bookings</th>
                    <th>Total Expense (Mo)</th>
                    <th>Expense YTD</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <React.Fragment key={partner.id}>
                      <tr
                        className={
                          expandedPartnerId === partner.id ? "expanded" : ""
                        }
                      >
                        <td
                          onClick={() => toggleExpandPartner(partner.id)}
                          className="expand-toggle"
                        >
                          {expandedPartnerId === partner.id ? "▼" : "▶"}
                        </td>
                        <td
                          onClick={() => toggleExpandPartner(partner.id)}
                          className="partner-name"
                        >
                          {partner.name}
                        </td>
                        <td>{partner.fieldsCount}</td>
                        <td>{partner.totalBookings}</td>
                        <td className="expense">
                          AED {partner.totalExpenseMonth.toLocaleString()}
                        </td>
                        <td className="expense">
                          AED {partner.totalExpenseYTD.toLocaleString()}
                        </td>
                        <td className="actions">
                          <button onClick={() => setEditingPartner(partner)}>
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeletePartner(partner.id, partner.name)
                            }
                            className="delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {expandedPartnerId === partner.id && (
                        <tr className="expanded-row">
                          <td colSpan="7">
                            <div className="expanded-content">
                              <div className="expanded-header">
                                <h4>Field Expense Details</h4>
                                <button
                                  onClick={() =>
                                    setAddingFieldForPartner(partner.id)
                                  }
                                >
                                  Add Field
                                </button>
                              </div>
                              <table className="fields-subtable">
                                <thead>
                                  <tr>
                                    <th>Field Name</th>
                                    <th>Rental Model</th>
                                    <th>Cost per Unit</th>
                                    <th>Contract End</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {fields.filter(
                                    (f) => f.partnerId === partner.id
                                  ).length === 0 ? (
                                    <tr>
                                      <td colSpan="5" className="no-data">
                                        No fields assigned
                                      </td>
                                    </tr>
                                  ) : (
                                    fields
                                      .filter((f) => f.partnerId === partner.id)
                                      .map((field) => (
                                        <tr key={field.id}>
                                          <td>{field.name}</td>
                                          <td>{field.rentalModel}</td>
                                          <td className="cost">
                                            AED {field.costPerUnit}
                                          </td>
                                          <td>{field.contractEnd}</td>
                                          <td className="actions">
                                            <button
                                              onClick={() =>
                                                setEditingField(field)
                                              }
                                            >
                                              Edit
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleDeleteField(field.id)
                                              }
                                              className="delete"
                                            >
                                              Delete
                                            </button>
                                          </td>
                                        </tr>
                                      ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="sponsors-tab">
            {/* Package Settings */}
            <div className="package-settings">
              <div className="package-header">
                <h4>Global Package Pricing</h4>
                {isEditingPackages ? (
                  <div className="package-actions">
                    <button onClick={handleSavePackages} className="save">
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingPackages(false)}
                      className="cancel"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingPackages(true)}
                    className="edit"
                  >
                    Edit Defaults
                  </button>
                )}
              </div>
              <div className="packages-grid">
                {tempPackages.map((pkg, idx) => (
                  <div
                    key={pkg.type}
                    className={`package-card ${pkg.type.toLowerCase()}`}
                  >
                    <div className="package-title">{pkg.type} Package</div>
                    <div className="package-row">
                      <label>Default CPM</label>
                      {isEditingPackages ? (
                        <input
                          type="number"
                          value={pkg.defaultCpm}
                          onChange={(e) => {
                            const newPkgs = [...tempPackages];
                            newPkgs[idx].defaultCpm = Number(e.target.value);
                            setTempPackages(newPkgs);
                          }}
                        />
                      ) : (
                        <span>AED {pkg.defaultCpm}</span>
                      )}
                    </div>
                    <div className="package-row">
                      <label>Flat Monthly Fee</label>
                      {isEditingPackages ? (
                        <input
                          type="number"
                          value={pkg.defaultFlatFee}
                          onChange={(e) => {
                            const newPkgs = [...tempPackages];
                            newPkgs[idx].defaultFlatFee = Number(
                              e.target.value
                            );
                            setTempPackages(newPkgs);
                          }}
                        />
                      ) : (
                        <span>AED {pkg.defaultFlatFee}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="summary-grid">
              <div>
                Active Sponsors <span>{totalSponsors}</span>
              </div>
              <div>
                Premium Tier <span>{premiumSponsors}</span>
              </div>
              <div>
                Revenue (Mo)
                <span className="revenue">
                  AED {totalSponsorRevenue.toLocaleString()}
                </span>
              </div>
              <div>
                Revenue YTD
                <span className="revenue">
                  AED{" "}
                  {sponsors
                    .reduce((a, s) => a + s.totalRevenueYTD, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
              <button onClick={() => setIsCreatingSponsor(true)}>
                <FaPlus />
                Add New Sponsor
              </button>
            </div>

            {/* Sponsors Table */}
            <div className="sponsors-table-container">
              <table className="sponsors-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Advertiser</th>
                    <th>Package</th>
                    <th>Pricing Model</th>
                    <th>Deal Value</th>
                    <th>Revenue (Mo)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((sponsor) => (
                    <React.Fragment key={sponsor.id}>
                      <tr
                        className={
                          expandedSponsorId === sponsor.id ? "expanded" : ""
                        }
                      >
                        <td
                          onClick={() => toggleExpandSponsor(sponsor.id)}
                          className="expand-toggle"
                        >
                          {expandedSponsorId === sponsor.id ? "▼" : "▶"}
                        </td>
                        <td
                          onClick={() => toggleExpandSponsor(sponsor.id)}
                          className="sponsor-name"
                        >
                          {sponsor.name}
                          <div className="sponsor-info">
                            {sponsor.industry} • {sponsor.activeCampaigns}{" "}
                            Campaigns
                          </div>
                        </td>
                        <td>
                          <span
                            className={`package-badge ${sponsor.packageType.toLowerCase()}`}
                          >
                            {sponsor.packageType}
                          </span>
                        </td>
                        <td className="pricing-model">
                          {sponsor.pricingModel}
                        </td>
                        <td>{renderPricingModel(sponsor)}</td>
                        <td className="revenue">
                          AED {sponsor.totalRevenueMonth.toLocaleString()}
                        </td>
                        <td className="actions">
                          <button
                            onClick={() => handleEditSponsorClick(sponsor)}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteSponsor(sponsor.id, sponsor.name)
                            }
                            className="delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {expandedSponsorId === sponsor.id && (
                        <tr className="expanded-row">
                          <td colSpan="7">
                            <div className="expanded-content">
                              <h4>Active Ad Campaigns</h4>
                              <table className="campaigns-subtable">
                                <thead>
                                  <tr>
                                    <th>Campaign</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Revenue</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {campaigns.filter((c) =>
                                    c.advertiser.includes(sponsor.name)
                                  ).length === 0 ? (
                                    <tr>
                                      <td colSpan="5" className="no-data">
                                        No campaigns found
                                      </td>
                                    </tr>
                                  ) : (
                                    campaigns
                                      .filter((c) =>
                                        c.advertiser.includes(sponsor.name)
                                      )
                                      .map((camp) => (
                                        <tr key={camp.id}>
                                          <td>{camp.name}</td>
                                          <td>{camp.type}</td>
                                          <td>
                                            <span
                                              className={`status-badge ${camp.status.toLowerCase()}`}
                                            >
                                              {camp.status}
                                            </span>
                                          </td>
                                          <td className="revenue">
                                            AED {camp.revenue}
                                          </td>
                                          <td>
                                            <button
                                              onClick={() =>
                                                handleDeleteCampaign(camp.id)
                                              }
                                              className="delete"
                                            >
                                              Delete
                                            </button>
                                          </td>
                                        </tr>
                                      ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingPartner && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Partner</h3>
            <input
              type="text"
              value={editingPartner.name}
              onChange={(e) =>
                setEditingPartner({ ...editingPartner, name: e.target.value })
              }
            />
            <div className="modal-actions">
              <button onClick={() => setEditingPartner(null)}>Cancel</button>
              <button onClick={handleSavePartner} className="save">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {editingField && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Field Rental Costs</h3>
            <input type="text" value={editingField.name} disabled />
            <select
              value={editingField.rentalModel}
              onChange={(e) =>
                setEditingField({
                  ...editingField,
                  rentalModel: e.target.value,
                })
              }
            >
              <option>Per Hour</option>
              <option>Per Slot</option>
              <option>Per Month</option>
            </select>
            <input
              type="number"
              value={editingField.costPerUnit}
              onChange={(e) =>
                setEditingField({
                  ...editingField,
                  costPerUnit: Number(e.target.value),
                })
              }
              placeholder="Cost Per Unit (AED)"
            />
            <div className="date-grid">
              <input
                type="date"
                value={editingField.contractStart}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    contractStart: e.target.value,
                  })
                }
              />
              <input
                type="date"
                value={editingField.contractEnd}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    contractEnd: e.target.value,
                  })
                }
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setEditingField(null)}>Cancel</button>
              <button onClick={handleSaveField} className="save">
                Save Field Costs
              </button>
            </div>
          </div>
        </div>
      )}

      {editingSponsor && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Sponsor Deal</h3>
            <input type="text" value={editingSponsor.name} disabled />
            <select
              value={editingSponsor.packageType}
              onChange={(e) =>
                setEditingSponsor({
                  ...editingSponsor,
                  packageType: e.target.value,
                })
              }
            >
              <option>Premium</option>
              <option>Basic</option>
              <option>Custom</option>
            </select>
            <div className="pricing-model-section">
              <label>
                <input
                  type="checkbox"
                  checked={useCpm}
                  onChange={(e) => setUseCpm(e.target.checked)}
                />{" "}
                Enable CPM
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={useFlat}
                  onChange={(e) => setUseFlat(e.target.checked)}
                />{" "}
                Enable Flat Fee
              </label>
            </div>
            {useCpm && (
              <input
                type="number"
                value={editingSponsor.cpmValue || 0}
                onChange={(e) =>
                  setEditingSponsor({
                    ...editingSponsor,
                    cpmValue: Number(e.target.value),
                  })
                }
                placeholder="CPM Value (AED)"
              />
            )}
            {useFlat && (
              <input
                type="number"
                value={editingSponsor.flatFee || 0}
                onChange={(e) =>
                  setEditingSponsor({
                    ...editingSponsor,
                    flatFee: Number(e.target.value),
                  })
                }
                placeholder="Flat Fee (AED/Month)"
              />
            )}
            <div className="modal-actions">
              <button onClick={() => setEditingSponsor(null)}>Cancel</button>
              <button
                onClick={handleSaveSponsor}
                disabled={!useCpm && !useFlat}
                className="save"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreatingPartner && (
        <div className="modal-overlay">
          <div className="modal small">
            <h3>Add New Partner</h3>
            <input
              type="text"
              value={newPartnerName}
              onChange={(e) => setNewPartnerName(e.target.value)}
              placeholder="Partner Name"
            />
            <div className="modal-actions">
              <button onClick={() => setIsCreatingPartner(false)}>
                Cancel
              </button>
              <button onClick={handleCreatePartner} className="save">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreatingSponsor && (
        <div className="modal-overlay">
          <div className="modal small">
            <h3>Add New Sponsor</h3>
            <input
              type="text"
              value={newSponsorName}
              onChange={(e) => setNewSponsorName(e.target.value)}
              placeholder="Sponsor Name"
            />
            <div className="modal-actions">
              <button onClick={() => setIsCreatingSponsor(false)}>
                Cancel
              </button>
              <button onClick={handleCreateSponsor} className="save">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {addingFieldForPartner && (
        <div className="modal-overlay">
          <div className="modal small">
            <h3>Add Field for Partner</h3>
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Field Name"
            />
            <input
              type="text"
              value={newFieldLocation}
              onChange={(e) => setNewFieldLocation(e.target.value)}
              placeholder="Location"
            />
            <div className="modal-actions">
              <button onClick={() => setAddingFieldForPartner(null)}>
                Cancel
              </button>
              <button
                onClick={() => handleCreateField(addingFieldForPartner)}
                className="save"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;
