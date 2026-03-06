import React, { useEffect, useMemo, useState } from "react";
import { Check, ListTodo, LogIn, LogOut, Plus, Trash2, User2, Users } from "lucide-react";

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const USERS = [
  { id: "du", name: "Du", pin: "1234" },
  { id: "frun", name: "Frun", pin: "5678" },
];

const STORAGE_KEY = "parlista-app-v1";

const defaultData = {
  currentUserId: null,
  lists: [
    {
      id: makeId(),
      name: "Handla",
      items: [
        {
          id: makeId(),
          text: "Mjölk",
          done: false,
          createdBy: "du",
          assignedTo: "frun",
          createdAt: new Date().toISOString(),
        },
        {
          id: makeId(),
          text: "Pasta",
          done: true,
          createdBy: "frun",
          assignedTo: "du",
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: makeId(),
      name: "Hemma",
      items: [
        {
          id: makeId(),
          text: "Boka däckbyte",
          done: false,
          createdBy: "frun",
          assignedTo: "du",
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ],
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultData;
  } catch {
    return defaultData;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
      setError("Fel PIN-kod. Testa 1234 för Du eller 5678 för Frun.");
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
              Gemensamma listor för dig och frun
            </h1>

            <p className="mt-4 max-w-md text-slate-300">
              Logga in, skapa listor, lägg till uppgifter och se vem som ansvarar för vad.
            </p>

            <div className="mt-8 space-y-3 text-sm text-slate-300">
              <div>• Separat inloggning för två användare</div>
              <div>• Delade att-göra-listor</div>
              <div>• Spara allt lokalt i webbläsaren</div>
            </div>
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
  const [data, setData] = useState(defaultData);
  const [newListName, setNewListName] = useState("");
  const [drafts, setDrafts] = useState({});
  const [filter, setFilter] = useState("alla");

  useEffect(() => {
    setData(loadData());
  }, []);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const currentUser = USERS.find((u) => u.id === data.currentUserId) || null;

  const totalItems = useMemo(() => {
    return data.lists.reduce((sum, list) => sum + list.items.length, 0);
  }, [data.lists]);

  const doneItems = useMemo(() => {
    return data.lists.reduce((sum, list) => {
      return sum + list.items.filter((item) => item.done).length;
    }, 0);
  }, [data.lists]);

  const myItems = useMemo(() => {
    return data.lists.reduce((sum, list) => {
      return sum + list.items.filter((item) => item.assignedTo === data.currentUserId && !item.done).length;
    }, 0);
  }, [data.lists, data.currentUserId]);

  const login = (userId) => {
    setData((prev) => ({ ...prev, currentUserId: userId }));
  };

  const logout = () => {
    setData((prev) => ({ ...prev, currentUserId: null }));
  };

  const createList = () => {
    const name = newListName.trim();
    if (!name) return;

    setData((prev) => ({
      ...prev,
      lists: [...prev.lists, { id: makeId(), name, items: [] }],
    }));

    setNewListName("");
  };

  const deleteList = (listId) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.filter((list) => list.id !== listId),
    }));
  };

  const addItem = (listId) => {
    const draft = drafts[listId];
    const text = draft?.text?.trim();

    if (!text || !currentUser) return;

    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: [
                ...list.items,
                {
                  id: makeId(),
                  text,
                  done: false,
                  createdBy: currentUser.id,
                  assignedTo: draft.assignedTo || currentUser.id,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : list
      ),
    }));

    setDrafts((prev) => ({
      ...prev,
      [listId]: { text: "", assignedTo: currentUser.id },
    }));
  };

  const toggleItem = (listId, itemId) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item
              ),
            }
          : list
      ),
    }));
  };

  const deleteItem = (listId, itemId) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list
      ),
    }));
  };

  if (!currentUser) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div>
          <div className="mb-6 flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                <Users className="h-4 w-4" />
                Inloggad som {currentUser.name}
              </div>

              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Våra listor</h1>
              <p className="mt-1 text-slate-500">
                En enkel MVP för gemensamma att-göra-listor.
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

          <div className="mb-6 grid gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:grid-cols-[1fr_auto]">
            <input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createList()}
              placeholder="Ny lista, t.ex. Veckohandling"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
            />

            <button
              type="button"
              onClick={createList}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Skapa lista
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

          <div className="grid gap-5 lg:grid-cols-2">
            {data.lists.map((list) => {
              const draft = drafts[list.id] || { text: "", assignedTo: currentUser.id };

              const visibleItems = list.items.filter((item) => {
                if (filter === "mina") return item.assignedTo === currentUser.id;
                if (filter === "öppna") return !item.done;
                if (filter === "klara") return item.done;
                return true;
              });

              return (
                <div
                  key={list.id}
                  className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{list.name}</h2>
                      <p className="text-sm text-slate-500">{visibleItems.length} uppgifter visas</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteList(list.id)}
                      className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                      title="Ta bort lista"
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
                          [list.id]: { ...draft, text: e.target.value },
                        }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && addItem(list.id)}
                      placeholder="Lägg till uppgift"
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                    />

                    <select
                      value={draft.assignedTo || currentUser.id}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [list.id]: { ...draft, assignedTo: e.target.value },
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
                      onClick={() => addItem(list.id)}
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
                        const assignedUser = USERS.find((u) => u.id === item.assignedTo);
                        const createdUser = USERS.find((u) => u.id === item.createdBy);

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
                              onClick={() => toggleItem(list.id, item.id)}
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
                                  item.done ? "text-slate-500 line-through" : "text-slate-900"
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
                              onClick={() => deleteItem(list.id, item.id)}
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
      </div>
    </div>
  );
}