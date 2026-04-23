import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  Home,
  ShoppingCart,
  Briefcase,
  Bath,
  BedDouble,
  CookingPot,
  Package,
  ListTodo,
  LogOut,
  Plus,
  Trash2,
  Users,
  User2,
} from "lucide-react";
import { supabase } from "./supabase";

function iconForFolder(iconName) {
  const className = "h-5 w-5";
  switch (iconName) {
    case "home":
      return <Home className={className} />;
    case "shopping":
      return <ShoppingCart className={className} />;
    case "work":
      return <Briefcase className={className} />;
    case "bathroom":
      return <Bath className={className} />;
    case "bedroom":
      return <BedDouble className={className} />;
    case "kitchen":
      return <CookingPot className={className} />;
    case "box":
      return <Package className={className} />;
    default:
      return <Folder className={className} />;
  }
}

function priorityLabel(priority) {
  if (priority === "high") return "🔴 Hög";
  if (priority === "low") return "🟢 Låg";
  return "🟡 Medel";
}

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

function AuthScreen({ onLoggedIn }) {
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        setInfo(
          "Konto skapat. Om Supabase kräver mailbekräftelse, öppna mailet först. Annars kan du logga in direkt."
        );
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        onLoggedIn();
      }
    } catch (err) {
      setError(err.message || "Något gick fel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 p-6">
      <div className="mx-auto flex min-h-[85vh] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5 md:grid-cols-2">
          <div className="bg-slate-900 p-8 text-white md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
              <Users className="h-4 w-4" />
              Household-version
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Delade hemmaplaner för par och familj
            </h1>

            <p className="mt-4 max-w-md text-slate-300">
              Skapa konto, skapa eller gå med i ett household, och dela samma mappar och uppgifter.
            </p>
          </div>

          <div className="p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-full px-4 py-2 text-sm ${
                    mode === "login"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Logga in
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`rounded-full px-4 py-2 text-sm ${
                    mode === "signup"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Skapa konto
                </button>
              </div>

              <div className="space-y-4">
                {mode === "signup" ? (
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Namn"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  />
                ) : null}

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Lösenord"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                />

                {error ? <div className="text-sm text-rose-600">{error}</div> : null}
                {info ? <div className="text-sm text-emerald-700">{info}</div> : null}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? "Jobbar..." : mode === "signup" ? "Skapa konto" : "Logga in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HouseholdSetup({ refreshApp }) {
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const createHousehold = async () => {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const { error } = await supabase.rpc("create_household", {
        p_name: householdName,
      });
      if (error) throw error;

      setInfo("Household skapat.");
      refreshApp();
    } catch (err) {
      setError(err.message || "Kunde inte skapa household.");
    } finally {
      setLoading(false);
    }
  };

  const joinHousehold = async () => {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const { error } = await supabase.rpc("join_household_by_code", {
        p_code: inviteCode,
      });
      if (error) throw error;

      setInfo("Du gick med i householdet.");
      refreshApp();
    } catch (err) {
      setError(err.message || "Kunde inte gå med i household.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h1 className="text-3xl font-semibold text-slate-900">Sätt upp ert household</h1>
          <p className="mt-2 text-slate-500">
            Skapa ett nytt household eller gå med i ett befintligt med invite code.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <h2 className="text-xl font-semibold text-slate-900">Skapa nytt household</h2>
              <input
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="T.ex. Eddy & Paula"
                className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              />
              <button
                type="button"
                onClick={createHousehold}
                disabled={loading}
                className="mt-4 inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white disabled:opacity-60"
              >
                Skapa household
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <h2 className="text-xl font-semibold text-slate-900">Gå med med invite code</h2>
              <input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="T.ex. A1B2C3D4"
                className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 uppercase outline-none focus:border-slate-400"
              />
              <button
                type="button"
                onClick={joinHousehold}
                disabled={loading}
                className="mt-4 inline-flex rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 disabled:opacity-60"
              >
                Gå med
              </button>
            </div>
          </div>

          {error ? <div className="mt-6 text-sm text-rose-600">{error}</div> : null}
          {info ? <div className="mt-6 text-sm text-emerald-700">{info}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [household, setHousehold] = useState(null);
  const [members, setMembers] = useState([]);
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
  const [loading, setLoading] = useState(true);

  const currentUserId = session?.user?.id || null;

  const memberMap = useMemo(() => {
    const map = {};
    members.forEach((member) => {
      map[member.user_id] = member.full_name || "Okänd";
    });
    return map;
  }, [members]);

  async function refreshApp() {
    setLoading(true);

    const {
      data: { session: activeSession },
    } = await supabase.auth.getSession();

    setSession(activeSession);

    if (!activeSession?.user) {
      setProfile(null);
      setHousehold(null);
      setMembers([]);
      setFolders([]);
      setSections([]);
      setItems([]);
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", activeSession.user.id)
      .single();

    setProfile(profileData || null);

    const { data: membershipData } = await supabase
      .from("household_members")
      .select("household_id")
      .eq("user_id", activeSession.user.id)
      .limit(1);

    const householdId = membershipData?.[0]?.household_id || null;

    if (!householdId) {
      setHousehold(null);
      setMembers([]);
      setFolders([]);
      setSections([]);
      setItems([]);
      setLoading(false);
      return;
    }

    const [
      { data: householdData },
      { data: memberRows },
      { data: folderRows },
      { data: sectionRows },
      { data: itemRows },
    ] = await Promise.all([
      supabase.from("households").select("*").eq("id", householdId).single(),
      supabase.from("household_members").select("*").eq("household_id", householdId),
      supabase.from("folders").select("*").eq("household_id", householdId).order("created_at"),
      supabase.from("sections").select("*").order("created_at"),
      supabase.from("items").select("*").order("created_at"),
    ]);

    const memberIds = (memberRows || []).map((m) => m.user_id);
    let profileRows = [];
    if (memberIds.length > 0) {
      const { data } = await supabase.from("profiles").select("*").in("id", memberIds);
      profileRows = data || [];
    }

    const mergedMembers = (memberRows || []).map((member) => ({
      ...member,
      full_name:
        profileRows.find((p) => p.id === member.user_id)?.full_name || "Okänd",
    }));

    setHousehold(householdData || null);
    setMembers(mergedMembers);
    setFolders(folderRows || []);

    const folderIds = (folderRows || []).map((f) => f.id);
    const allowedSections = (sectionRows || []).filter((s) => folderIds.includes(s.folder_id));
    setSections(allowedSections);

    const sectionIds = allowedSections.map((s) => s.id);
    const allowedItems = (itemRows || []).filter((i) => sectionIds.includes(i.section_id));
    setItems(allowedItems);

    const nextOpenFolders = {};
    (folderRows || []).forEach((folder) => {
      nextOpenFolders[folder.id] = true;
    });
    setOpenFolders((prev) => ({ ...nextOpenFolders, ...prev }));

    setLoading(false);
  }

  useEffect(() => {
    refreshApp();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshApp();
    });

    return () => subscription.unsubscribe();
  }, []);

  const totalItems = items.length;
  const doneItems = items.filter((item) => item.done).length;
  const myItems = items.filter(
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    refreshApp();
  };

  const toggleFolder = (folderId) => {
    setOpenFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const createFolder = async () => {
    const name = newFolderName.trim();
    if (!name || !household?.id) return;

    const { error } = await supabase.from("folders").insert([
      {
        household_id: household.id,
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
    refreshApp();
  };

  const createSection = async (folderId) => {
    const name = (newSectionNames[folderId] || "").trim();
    if (!name) return;

    const { error } = await supabase.from("sections").insert([{ folder_id: folderId, name }]);

    if (error) {
      console.error(error);
      return;
    }

    setNewSectionNames((prev) => ({ ...prev, [folderId]: "" }));
    refreshApp();
  };

  const addItem = async (folderId, sectionId) => {
    const draftKey = `${folderId}-${sectionId}`;
    const draft = drafts[draftKey];
    const text = draft?.text?.trim();

    if (!text || !currentUserId) return;

    const { error } = await supabase.from("items").insert([
      {
        section_id: sectionId,
        text,
        done: false,
        priority: draft.priority || "medium",
        created_by: currentUserId,
        assigned_to: draft.assignedTo || currentUserId,
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
        assignedTo: currentUserId,
        priority: "medium",
      },
    }));

    refreshApp();
  };

  const toggleItem = async (itemId, currentDone) => {
    if (!currentDone) {
      // Om uppgiften inte är gjord, markera som gjord och ta bort den
      const { error } = await supabase.from("items").delete().eq("id", itemId);
      if (error) {
        console.error(error);
        return;
      }
    } else {
      // Om den är gjord, sätt tillbaka till inte gjord (omvänd funktion)
      const { error } = await supabase
        .from("items")
        .update({ done: false })
        .eq("id", itemId);
      if (error) {
        console.error(error);
        return;
      }
    }

    refreshApp();
  };

  const deleteItem = async (itemId) => {
    const { error } = await supabase.from("items").delete().eq("id", itemId);
    if (error) {
      console.error(error);
      return;
    }

    refreshApp();
  };

  const deleteSection = async (sectionId) => {
    const { error } = await supabase.from("sections").delete().eq("id", sectionId);
    if (error) {
      console.error(error);
      return;
    }

    refreshApp();
  };

  const deleteFolder = async (folderId) => {
    const { error } = await supabase.from("folders").delete().eq("id", folderId);
    if (error) {
      console.error(error);
      return;
    }

    refreshApp();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
          Laddar...
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onLoggedIn={refreshApp} />;
  }

  if (!household) {
    return <HouseholdSetup refreshApp={refreshApp} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                <Users className="h-4 w-4" />
                {household.name}
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
                {members.map((member) => (
                  <span
                    key={member.user_id}
                    className="rounded-full bg-slate-100 px-3 py-1"
                  >
                    {member.full_name}
                  </span>
                ))}
              </div>

              <div className="mt-2 flex items-center gap-3 text-slate-500">
                <span>
                  Invite code: <span className="font-medium">{household.invite_code}</span>
                </span>

                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(household.invite_code)}
                  className="rounded-lg bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200"
                >
                  Kopiera
                </button>
              </div>

              <p className="mt-1 text-slate-500">
                Inloggad som {profile?.full_name || session.user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Logga ut
            </button>
          </div>
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
                    {iconForFolder(folder.icon)}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{folder.name}</h2>
                    <p className="text-sm text-slate-500">{folder.sections.length} sections</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => deleteFolder(folder.id)}
                  className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

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
                      placeholder={`Ny section i ${folder.name}`}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => createSection(folder.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700"
                    >
                      <Plus className="h-4 w-4" />
                      Lägg till section
                    </button>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    {folder.sections.map((section) => {
                      const draftKey = `${folder.id}-${section.id}`;
                      const draft = drafts[draftKey] || {
                        text: "",
                        assignedTo: currentUserId,
                        priority: "medium",
                      };

                      const visibleItems = section.items.filter((item) => {
                        if (filter === "mina") return item.assigned_to === currentUserId;
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
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                {section.name}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {visibleItems.length} uppgifter visas
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteSection(section.id)}
                              className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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
                              onKeyDown={(e) => e.key === "Enter" && addItem(folder.id, section.id)}
                              placeholder="Lägg till uppgift"
                              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                            />

                            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                              <select
                                value={draft.assignedTo || currentUserId}
                                onChange={(e) =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [draftKey]: { ...draft, assignedTo: e.target.value },
                                  }))
                                }
                                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                              >
                                {members.map((member) => (
                                  <option key={member.user_id} value={member.user_id}>
                                    Tilldela {member.full_name}
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
                              visibleItems.map((item) => (
                                <div
                                  key={item.id}
                                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                                    item.done
                                      ? "border-emerald-200 bg-emerald-50"
                                      : item.priority === "high"
                                      ? "border-rose-200 bg-rose-50"
                                      : item.priority === "low"
                                      ? "border-emerald-200 bg-emerald-50/40"
                                      : "border-amber-200 bg-amber-50"
                                  }`}
                                >
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
                                      <span>Skapad av {memberMap[item.created_by] || "Okänd"}</span>
                                      <span>
                                        Tilldelad {memberMap[item.assigned_to] || "Okänd"}
                                      </span>
                                      <span>{priorityLabel(item.priority)}</span>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => deleteItem(item.id)}
                                    className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))
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
      </div>
    </div>
  );
}