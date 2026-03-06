import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  Home,
  ListTodo,
  LogIn,
  LogOut,
  Plus,
  Trash2,
  User2,
  Users,
  Briefcase,
  BedDouble,
  Bath,
  CookingPot,
  Package,
  ShoppingCart,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { supabase } from "./supabase";

const USERS = [
  { id: "Eddy", name: "Eddy", pin: "1234" },
  { id: "Paula", name: "Paula", pin: "5678" },
];

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [selectedUser, setSelectedUser] = useState(USERS[0].id);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = USERS.find((u) => u.id === selectedUser);
    if (!user) return;

    if (pin === user.pin) {
      setError("");
      onLogin(user.id);
    } else {
      setError("Fel PIN-kod. Testa 1234 för Eddy eller 5678 för Paula.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 p-6">
      <div className="mx-auto flex min-h-[85vh] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5 md:grid-cols-2">
          <div className="bg-slate-900 p-8 text-white md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
              <Users className="h-4 w-4" />
              Delad app för er två
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Gemensamma mappar för hem och handling
            </h1>

            <p className="mt-4 max-w-md text-slate-300">
              Organisera allt i mappar som Hemma och Handla, med underrubriker som
              Vardagsrum, Sovrum, Kök eller Veckohandling.
            </p>
          </div>

          <div className="p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <LogIn className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Logga in</h2>
                  <p className="text-sm text-slate-500">Välj användare och skriv PIN-kod</p>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Användare
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {USERS.map((user) => {
                      const active = selectedUser === user.id;

                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => setSelectedUser(user.id)}
                          className={`rounded-2xl border px-4 py-3 text-left transition ${
                            active
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <User2 className="h-4 w-4" />
                            {user.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    PIN-kod
                  </label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="Skriv PIN-kod"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                  />
                </div>

                {error ? <div className="text-sm text-rose-600">{error}</div> : null}

                <button
                  type="button"
                  onClick={handleLogin}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:opacity-95"
                >
                  <LogIn className="h-4 w-4" />
                  Fortsätt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function priorityLabel(priority) {
  if (priority === "high") return "🔴 Hög";
  if (priority === "low") return "🟢 Låg";
  return "🟡 Medel";
}

function priorityClasses(priority, done) {
  if (done) return "border-emerald-200 bg-emerald-50";
  if (priority === "high") return "border-rose-200 bg-rose-50";
  if (priority === "low") return "border-emerald-200 bg-emerald-50/40";
  return "border-amber-200 bg-amber-50";
}

function getFolderIcon(iconName) {
  const className = "h-5 w-5";

  switch (iconName) {
    case "home":
      return <Home className={className} />;
    case "shopping":
      return <ShoppingCart className={className} />;
    case "work":
      return <Briefcase className={className} />;
    case "bedroom":
      return <BedDouble className={className} />;
    case "bathroom":
      return <Bath className={className} />;
    case "kitchen":
      return <CookingPot className={className} />;
    case "box":
      return <Package className={className} />;
    default:
      return <Folder className={className} />;
  }
}

export default function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [folders, setFolders] = useState([]);
  const [sections, setSections] = useState([]);
  const [items, setItems] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#0f172a");
  const [newFolderIcon, setNewFolderIcon] = useState("folder");
  const [newSectionNames, setNewSectionNames] = useState({});
  const [drafts, setDrafts] = useState({});
  const [filter, setFilter] = useState("alla");
  const [openFolders, setOpenFolders] = useState({});

  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [editingFolderColor, setEditingFolderColor] = useState("#0f172a");
  const [editingFolderIcon, setEditingFolderIcon] = useState("folder");

  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionName, setEditingSectionName] = useState("");

  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemText, setEditingItemText] = useState("");
  const [editingItemPriority, setEditingItemPriority] = useState("medium");
  const [editingItemAssignedTo, setEditingItemAssignedTo] = useState("Eddy");

  const [loading, setLoading] = useState(true);

  const currentUser = USERS.find((u) => u.id === currentUserId) || null;

  async function loadData() {
    setLoading(true);

    const [
      { data: foldersData, error: foldersError },
      { data: sectionsData, error: sectionsError },
      { data: itemsData, error: itemsError },
    ] = await Promise.all([
      supabase.from("folders").select("*").order("created_at", { ascending: true }),
      supabase.from("sections").select("*").order("created_at", { ascending: true }),
      supabase.from("items").select("*").order("created_at", { ascending: true }),
    ]);

    if (foldersError) console.error(foldersError);
    if (sectionsError) console.error(sectionsError);
    if (itemsError) console.error(itemsError);

    setFolders(foldersData || []);
    setSections(sectionsData || []);
    setItems(itemsData || []);

    const nextOpenFolders = {};
    (foldersData || []).forEach((folder) => {
      nextOpenFolders[folder.id] = true;
    });
    setOpenFolders((prev) => ({ ...nextOpenFolders, ...prev }));

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const allItems = useMemo(() => items, [items]);
  const totalItems = allItems.length;
  const doneItems = allItems.filter((item) => item.done).length;
  const myItems = allItems.filter(
    (item) => item.assigned_to === currentUserId && !item.done
  ).length;

  const foldersWithSections = useMemo(() => {
    return folders.map((folder) => ({
      ...folder,
      sections: sections
        .filter((section) => section.folder_id === folder.id)
        .map((section) => ({
          ...section,
          items: items.filter((item) => item.section_id === section.id),
        })),
    }));
  }, [folders, sections, items]);

  const login = (userId) => setCurrentUserId(userId);
  const logout = () => setCurrentUserId(null);

  const toggleFolder = (folderId) => {
    setOpenFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const createFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;

    const { error } = await supabase.from("folders").insert([
      {
        name,
        color: newFolderColor,
        icon: newFolderIcon,
      },
    ]);

    if (error) {
      console.error(error);
      return;
    }

    setNewFolderName("");
    setNewFolderColor("#0f172a");
    setNewFolderIcon("folder");
    loadData();
  };

  const startEditFolder = (folder) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name || "");
    setEditingFolderColor(folder.color || "#0f172a");
    setEditingFolderIcon(folder.icon || "folder");
  };

  const cancelEditFolder = () => {
    setEditingFolderId(null);
    setEditingFolderName("");
    setEditingFolderColor("#0f172a");
    setEditingFolderIcon("folder");
  };

  const saveFolderEdit = async () => {
    const name = editingFolderName.trim();
    if (!name || !editingFolderId) return;

    const { error } = await supabase
      .from("folders")
      .update({
        name,
        color: editingFolderColor,
        icon: editingFolderIcon,
      })
      .eq("id", editingFolderId);

    if (error) {
      console.error(error);
      return;
    }

    cancelEditFolder();
    loadData();
  };

  const createSection = async (folderId) => {
    const name = (newSectionNames[folderId] || "").trim();
    if (!name) return;

    const { error } = await supabase
      .from("sections")
      .insert([{ folder_id: folderId, name }]);

    if (error) {
      console.error(error);
      return;
    }

    setNewSectionNames((prev) => ({ ...prev, [folderId]: "" }));
    loadData();
  };

  const startEditSection = (section) => {
    setEditingSectionId(section.id);
    setEditingSectionName(section.name || "");
  };

  const cancelEditSection = () => {
    setEditingSectionId(null);
    setEditingSectionName("");
  };

  const saveSectionEdit = async () => {
    const name = editingSectionName.trim();
    if (!name || !editingSectionId) return;

    const { error } = await supabase
      .from("sections")
      .update({ name })
      .eq("id", editingSectionId);

    if (error) {
      console.error(error);
      return;
    }

    cancelEditSection();
    loadData();
  };

  const deleteFolder = async (folderId) => {
    const { error } = await supabase.from("folders").delete().eq("id", folderId);
    if (error) {
      console.error(error);
      return;
    }

    loadData();
  };

  const deleteSection = async (sectionId) => {
    const { error } = await supabase.from("sections").delete().eq("id", sectionId);
    if (error) {
      console.error(error);
      return;
    }

    loadData();
  };

  const addItem = async (folderId, sectionId) => {
    const draftKey = `${folderId}-${sectionId}`;
    const draft = drafts[draftKey];
    const text = draft?.text?.trim();

    if (!text || !currentUser) return;

    const { error } = await supabase.from("items").insert([
      {
        section_id: sectionId,
        text,
        done: false,
        priority: draft.priority || "medium",
        created_by: currentUser.id,
        assigned_to: draft.assignedTo || currentUser.id,
      },
    ]);

    if (error) {
      console.error(error);
      return;
    }

    setDrafts((prev) => ({
      ...prev,
      [draftKey]: {
        text: "",
        assignedTo: currentUser.id,
        priority: "medium",
      },
    }));

    loadData();
  };

  const startEditItem = (item) => {
    setEditingItemId(item.id);
    setEditingItemText(item.text || "");
    setEditingItemPriority(item.priority || "medium");
    setEditingItemAssignedTo(item.assigned_to || currentUserId);
  };

  const cancelEditItem = () => {
    setEditingItemId(null);
    setEditingItemText("");
    setEditingItemPriority("medium");
    setEditingItemAssignedTo(currentUserId || "Eddy");
  };

  const saveItemEdit = async () => {
    const text = editingItemText.trim();
    if (!text || !editingItemId) return;

    const { error } = await supabase
      .from("items")
      .update({
        text,
        priority: editingItemPriority,
        assigned_to: editingItemAssignedTo,
      })
      .eq("id", editingItemId);

    if (error) {
      console.error(error);
      return;
    }

    cancelEditItem();
    loadData();
  };

  const toggleItem = async (itemId, currentDone) => {
    const { error } = await supabase
      .from("items")
      .update({ done: !currentDone })
      .eq("id", itemId);

    if (error) {
      console.error(error);
      return;
    }

    loadData();
  };

  const deleteItem = async (itemId) => {
    const { error } = await supabase.from("items").delete().eq("id", itemId);
    if (error) {
      console.error(error);
      return;
    }

    loadData();
  };

  if (!currentUser) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              <Users className="h-4 w-4" />
              Inloggad som {currentUser.name}
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Våra mappar</h1>
            <p className="mt-1 text-slate-500">
              Exempel: Hemma → Vardagsrum / Sovrum / Kök
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Logga ut
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Totalt uppgifter" value={totalItems} icon={ListTodo} />
          <StatCard label="Klart" value={doneItems} icon={Check} />
          <StatCard label="Mina kvar" value={myItems} icon={User2} />
        </div>

        <div className="mb-6 grid gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:grid-cols-[1fr_150px_70px_auto]">
          <input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createFolder()}
            placeholder="Ny mapp, t.ex. Hemma eller Handla"
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />

          <select
            value={newFolderIcon}
            onChange={(e) => setNewFolderIcon(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          >
            <option value="folder">📁 Standard</option>
            <option value="home">🏠 Hemma</option>
            <option value="shopping">🛒 Handla</option>
            <option value="work">💼 Jobb</option>
            <option value="bedroom">🛏 Sovrum</option>
            <option value="bathroom">🛁 Badrum</option>
            <option value="kitchen">🍳 Kök</option>
            <option value="box">📦 Övrigt</option>
          </select>

          <input
            type="color"
            value={newFolderColor}
            onChange={(e) => setNewFolderColor(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white p-1"
            title="Välj färg på mappen"
          />

          <button
            type="button"
            onClick={createFolder}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Skapa mapp
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {[
            ["alla", "Alla"],
            ["mina", "Mina"],
            ["öppna", "Öppna"],
            ["klara", "Klara"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                filter === value
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-[28px] bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-black/5">
            Laddar mappar...
          </div>
        ) : (
          <div className="space-y-5">
            {foldersWithSections.map((folder) => (
              <div
                key={folder.id}
                className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleFolder(folder.id)}
                    className="flex items-center gap-3 text-left"
                  >
                    {openFolders[folder.id] ? (
                      <ChevronDown className="h-5 w-5 text-slate-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-500" />
                    )}

                    <div
                      className="rounded-2xl p-2 text-white"
                      style={{ backgroundColor: folder.color || "#0f172a" }}
                    >
                      {getFolderIcon(folder.icon)}
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{folder.name}</h2>
                      <p className="text-sm text-slate-500">
                        {folder.sections.length} underrubriker
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEditFolder(folder)}
                      className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      title="Ändra mapp"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteFolder(folder.id)}
                      className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                      title="Ta bort mapp"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {editingFolderId === folder.id ? (
                  <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_150px_70px_auto_auto]">
                    <input
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                      placeholder="Mappnamn"
                    />

                    <select
                      value={editingFolderIcon}
                      onChange={(e) => setEditingFolderIcon(e.target.value)}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                    >
                      <option value="folder">📁 Standard</option>
                      <option value="home">🏠 Hemma</option>
                      <option value="shopping">🛒 Handla</option>
                      <option value="work">💼 Jobb</option>
                      <option value="bedroom">🛏 Sovrum</option>
                      <option value="bathroom">🛁 Badrum</option>
                      <option value="kitchen">🍳 Kök</option>
                      <option value="box">📦 Övrigt</option>
                    </select>

                    <input
                      type="color"
                      value={editingFolderColor}
                      onChange={(e) => setEditingFolderColor(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white p-1"
                    />

                    <button
                      type="button"
                      onClick={saveFolderEdit}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white"
                    >
                      <Save className="h-4 w-4" />
                      Spara
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditFolder}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-700"
                    >
                      <X className="h-4 w-4" />
                      Avbryt
                    </button>
                  </div>
                ) : null}

                {openFolders[folder.id] ? (
                  <div className="mt-5">
                    <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto]">
                      <input
                        value={newSectionNames[folder.id] || ""}
                        onChange={(e) =>
                          setNewSectionNames((prev) => ({
                            ...prev,
                            [folder.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && createSection(folder.id)}
                        placeholder={`Ny underrubrik i ${folder.name}, t.ex. Kök`}
                        className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => createSection(folder.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700"
                      >
                        <Plus className="h-4 w-4" />
                        Lägg till underrubrik
                      </button>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                      {folder.sections.map((section) => {
                        const draftKey = `${folder.id}-${section.id}`;
                        const draft = drafts[draftKey] || {
                          text: "",
                          assignedTo: currentUser.id,
                          priority: "medium",
                        };

                        const visibleItems = section.items.filter((item) => {
                          if (filter === "mina") return item.assigned_to === currentUser.id;
                          if (filter === "öppna") return !item.done;
                          if (filter === "klara") return item.done;
                          return true;
                        });

                        return (
                          <div
                            key={section.id}
                            className="rounded-[24px] border border-slate-200 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              {editingSectionId === section.id ? (
                                <div className="flex flex-1 flex-col gap-3 md:flex-row">
                                  <input
                                    value={editingSectionName}
                                    onChange={(e) => setEditingSectionName(e.target.value)}
                                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={saveSectionEdit}
                                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white"
                                    >
                                      <Save className="h-4 w-4" />
                                      Spara
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelEditSection}
                                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-700"
                                    >
                                      <X className="h-4 w-4" />
                                      Avbryt
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                      {section.name}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                      {visibleItems.length} uppgifter visas
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => startEditSection(section)}
                                      className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                      title="Ändra underrubrik"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => deleteSection(section.id)}
                                      className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                                      title="Ta bort underrubrik"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="mt-4 space-y-3">
                              <input
                                value={draft.text}
                                onChange={(e) =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [draftKey]: { ...draft, text: e.target.value },
                                  }))
                                }
                                onKeyDown={(e) =>
                                  e.key === "Enter" && addItem(folder.id, section.id)
                                }
                                placeholder="Lägg till uppgift"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                              />

                              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                                <select
                                  value={draft.assignedTo || currentUser.id}
                                  onChange={(e) =>
                                    setDrafts((prev) => ({
                                      ...prev,
                                      [draftKey]: { ...draft, assignedTo: e.target.value },
                                    }))
                                  }
                                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                                >
                                  {USERS.map((user) => (
                                    <option key={user.id} value={user.id}>
                                      Tilldela {user.name}
                                    </option>
                                  ))}
                                </select>

                                <select
                                  value={draft.priority || "medium"}
                                  onChange={(e) =>
                                    setDrafts((prev) => ({
                                      ...prev,
                                      [draftKey]: { ...draft, priority: e.target.value },
                                    }))
                                  }
                                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                                >
                                  <option value="high">🔴 Hög</option>
                                  <option value="medium">🟡 Medel</option>
                                  <option value="low">🟢 Låg</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={() => addItem(folder.id, section.id)}
                                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white"
                                >
                                  <Plus className="h-4 w-4" />
                                  Lägg till
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 space-y-3">
                              {visibleItems.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                                  Inga uppgifter här än.
                                </div>
                              ) : (
                                visibleItems.map((item) => {
                                  const assignedUser = USERS.find(
                                    (u) => u.id === item.assigned_to
                                  );
                                  const createdUser = USERS.find(
                                    (u) => u.id === item.created_by
                                  );

                                  return (
                                    <div
                                      key={item.id}
                                      className={`rounded-2xl border px-4 py-3 ${priorityClasses(
                                        item.priority,
                                        item.done
                                      )}`}
                                    >
                                      {editingItemId === item.id ? (
                                        <div className="space-y-3">
                                          <input
                                            value={editingItemText}
                                            onChange={(e) => setEditingItemText(e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                                          />

                                          <div className="grid gap-3 md:grid-cols-2">
                                            <select
                                              value={editingItemAssignedTo}
                                              onChange={(e) => setEditingItemAssignedTo(e.target.value)}
                                              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                                            >
                                              {USERS.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                  Tilldela {user.name}
                                                </option>
                                              ))}
                                            </select>

                                            <select
                                              value={editingItemPriority}
                                              onChange={(e) => setEditingItemPriority(e.target.value)}
                                              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                                            >
                                              <option value="high">🔴 Hög</option>
                                              <option value="medium">🟡 Medel</option>
                                              <option value="low">🟢 Låg</option>
                                            </select>
                                          </div>

                                          <div className="flex gap-2">
                                            <button
                                              type="button"
                                              onClick={saveItemEdit}
                                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white"
                                            >
                                              <Save className="h-4 w-4" />
                                              Spara
                                            </button>
                                            <button
                                              type="button"
                                              onClick={cancelEditItem}
                                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-700"
                                            >
                                              <X className="h-4 w-4" />
                                              Avbryt
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-3">
                                          <button
                                            type="button"
                                            onClick={() => toggleItem(item.id, item.done)}
                                            className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                                              item.done
                                                ? "border-emerald-500 bg-emerald-500 text-white"
                                                : "border-slate-300 bg-white text-transparent"
                                            }`}
                                          >
                                            <Check className="h-4 w-4" />
                                          </button>

                                          <div className="min-w-0 flex-1">
                                            <div
                                              className={`font-medium ${
                                                item.done
                                                  ? "text-slate-500 line-through"
                                                  : "text-slate-900"
                                              }`}
                                            >
                                              {item.text}
                                            </div>

                                            <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                                              <span>
                                                Skapad av {createdUser?.name || "okänd"}
                                              </span>
                                              <span>
                                                Tilldelad {assignedUser?.name || "okänd"}
                                              </span>
                                              <span>{priorityLabel(item.priority)}</span>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <button
                                              type="button"
                                              onClick={() => startEditItem(item)}
                                              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                            >
                                              <Pencil className="h-4 w-4" />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => deleteItem(item.id)}
                                              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}