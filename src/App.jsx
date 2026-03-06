import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  ListTodo,
  LogIn,
  LogOut,
  Plus,
  Trash2,
  User2,
  Users,
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

export default function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [folders, setFolders] = useState([]);
  const [sections, setSections] = useState([]);
  const [items, setItems] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#0f172a");
  const [newSectionNames, setNewSectionNames] = useState({});
  const [drafts, setDrafts] = useState({});
  const [filter, setFilter] = useState("alla");
  const [openFolders, setOpenFolders] = useState({});
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
      },
    ]);

    if (error) {
      console.error(error);
      return;
    }

    setNewFolderName("");
    setNewFolderColor("#0f172a");
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
      [draftKey]: { text: "", assignedTo: currentUser.id },
    }));

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

        <div className="mb-6 grid gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:grid-cols-[1fr_70px_auto]">
          <input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createFolder()}
            placeholder="Ny mapp, t.ex. Hemma eller Handla"
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />

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
                      <Folder className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{folder.name}</h2>
                      <p className="text-sm text-slate-500">
                        {folder.sections.length} underrubriker
                      </p>
                    </div>
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
                                title="Ta bort underrubrik"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_160px_auto]">
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
                                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                              />

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

                              <button
                                type="button"
                                onClick={() => addItem(folder.id, section.id)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white"
                              >
                                <Plus className="h-4 w-4" />
                                Lägg till
                              </button>
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
                                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                                        item.done
                                          ? "border-emerald-200 bg-emerald-50"
                                          : "border-slate-200 bg-white"
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

                                        <div className="mt-1 text-xs text-slate-500">
                                          Skapad av {createdUser?.name || "okänd"} • Tilldelad{" "}
                                          {assignedUser?.name || "okänd"}
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