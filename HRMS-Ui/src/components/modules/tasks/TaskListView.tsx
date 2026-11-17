"use client";

import { useState } from "react";
import {
  LuPlus,
  LuCalendar,
  LuFlag,
  LuSearch,
  LuChevronDown,
  LuChevronRight,
  LuCheck,
} from "react-icons/lu";
import { TaskItem, TaskPriority, TaskCategory } from "@/types/task.types";
import { useTasks } from "@/context/TaskContext";

export default function TaskListView() {
  const { tasks, activeCount, completedCount, toggleTask, addTask } = useTasks();
  const [activeTab, setActiveTab] = useState<"all" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("Normal");
  const [newCategory, setNewCategory] = useState<TaskCategory>("today");

  // Section collapse states
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    overdue: false,
    today: false,
    upcoming: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleToggleTask = (id: string) => {
    toggleTask(id);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask(newTitle, newPriority, newCategory);
    setNewTitle("");
    setNewPriority("Normal");
  };

  // Filtered lists
  const activeTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);

  const filterBySearch = (list: TaskItem[]) => {
    if (!searchQuery.trim()) return list;
    return list.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const filteredActive = filterBySearch(activeTasks);
  const overdueTasks = filteredActive.filter((t) => t.category === "overdue");
  const todayTasks = filteredActive.filter((t) => t.category === "today");
  const upcomingTasks = filteredActive.filter((t) => t.category === "upcoming");
  const filteredCompleted = filterBySearch(completedTasks);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Task list
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture what’s next. Keep your everyday work moving.
          </p>
        </div>

        <span className="text-xs sm:text-sm font-medium text-slate-600 self-start sm:self-auto">
          Thu, 22 Oct 2026
        </span>
      </div>

      {/* 2. Main Card Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
        {/* Top Tabs & Search Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Tabs */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`pb-2.5 text-sm font-semibold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === "all"
                  ? "border-[#0084f4] text-[#0084f4]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>All active</span>
              <span
                className={`text-xs px-1.5 py-0.2 rounded-md font-semibold ${
                  activeTab === "all"
                    ? "bg-sky-50 text-[#0084f4]"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {activeTasks.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`pb-2.5 text-sm font-semibold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === "completed"
                  ? "border-[#0084f4] text-[#0084f4]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Completed</span>
              {completedTasks.length > 0 && (
                <span className="text-xs px-1.5 py-0.2 rounded-md font-semibold bg-slate-100 text-slate-600">
                  {completedTasks.length}
                </span>
              )}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Find a task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition shadow-2xs"
            />
          </div>
        </div>

        {activeTab === "all" ? (
          <>
            {/* Add a task Bar */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Add a task</label>
              <form
                onSubmit={handleAddTask}
                className="border border-slate-200 rounded-2xl bg-white px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs focus-within:border-sky-500 transition"
              >
                <div className="flex items-center gap-2.5 flex-1">
                  <LuPlus className="text-slate-400 text-base shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="What do you need to do?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  {/* Category / Due Date Trigger */}
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="text-xs text-slate-500 bg-transparent hover:text-slate-700 cursor-pointer focus:outline-none"
                  >
                    <option value="today">📅 Today</option>
                    <option value="upcoming">📅 Upcoming</option>
                    <option value="overdue">📅 Overdue</option>
                  </select>

                  {/* Priority Toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setNewPriority((prev) => (prev === "Normal" ? "High" : "Normal"))
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                      newPriority === "High"
                        ? "bg-rose-50 text-rose-700 border-rose-200 font-semibold"
                        : "text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <LuFlag className="text-[10px]" />
                    <span>{newPriority}</span>
                  </button>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-[#0084f4] hover:bg-[#0070d1] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-[0.99]"
                  >
                    <LuPlus className="text-xs" />
                    <span>Add task</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Task Groups */}
            <div className="space-y-6 pt-2">
              {/* SECTION 1: Overdue */}
              {overdueTasks.length > 0 && (
                <div className="space-y-2">
                  <div
                    onClick={() => toggleSection("overdue")}
                    className="flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer select-none py-1 group"
                  >
                    <div className="flex items-center gap-1.5">
                      {collapsedSections.overdue ? (
                        <LuChevronRight className="text-sm text-slate-400 group-hover:text-slate-700" />
                      ) : (
                        <LuChevronDown className="text-sm text-slate-400 group-hover:text-slate-700" />
                      )}
                      <span>Overdue</span>
                      <span className="font-normal text-slate-400">{overdueTasks.length}</span>
                    </div>
                    <span className="text-slate-400 font-medium text-[11px]">Before 22 Oct</span>
                  </div>

                  {!collapsedSections.overdue && (
                    <div className="divide-y divide-slate-100">
                      {overdueTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50/70 transition group"
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                            <button
                              type="button"
                              onClick={() => handleToggleTask(task.id)}
                              className="w-4 h-4 rounded-md border border-slate-300 hover:border-slate-500 transition shrink-0 flex items-center justify-center cursor-pointer"
                            >
                              {task.isCompleted && <LuCheck className="text-xs text-sky-600" />}
                            </button>
                            <span className="text-sm text-slate-800 truncate">{task.title}</span>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            {task.priority === "High" && (
                              <span className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                                <LuFlag className="text-xs text-slate-800 fill-slate-800" />
                                <span>High</span>
                              </span>
                            )}
                            <span className="text-xs font-semibold text-[#e11d48]">
                              {task.dueDateLabel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 2: Today */}
              {todayTasks.length > 0 && (
                <div className="space-y-2">
                  <div
                    onClick={() => toggleSection("today")}
                    className="flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer select-none py-1 group"
                  >
                    <div className="flex items-center gap-1.5">
                      {collapsedSections.today ? (
                        <LuChevronRight className="text-sm text-slate-400 group-hover:text-slate-700" />
                      ) : (
                        <LuChevronDown className="text-sm text-slate-400 group-hover:text-slate-700" />
                      )}
                      <span>Today</span>
                      <span className="font-normal text-slate-400">{todayTasks.length}</span>
                    </div>
                    <span className="text-slate-400 font-medium text-[11px]">Thu, 22 Oct</span>
                  </div>

                  {!collapsedSections.today && (
                    <div className="divide-y divide-slate-100">
                      {todayTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50/70 transition group"
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                            <button
                              type="button"
                              onClick={() => handleToggleTask(task.id)}
                              className="w-4 h-4 rounded-md border border-slate-300 hover:border-slate-500 transition shrink-0 flex items-center justify-center cursor-pointer"
                            >
                              {task.isCompleted && <LuCheck className="text-xs text-sky-600" />}
                            </button>
                            <span className="text-sm text-slate-800 truncate">{task.title}</span>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            {task.priority === "High" && (
                              <span className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                                <LuFlag className="text-xs text-slate-800 fill-slate-800" />
                                <span>High</span>
                              </span>
                            )}
                            <span className="text-xs text-slate-600 font-medium">
                              {task.dueDateLabel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 3: Upcoming */}
              {upcomingTasks.length > 0 && (
                <div className="space-y-2">
                  <div
                    onClick={() => toggleSection("upcoming")}
                    className="flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer select-none py-1 group"
                  >
                    <div className="flex items-center gap-1.5">
                      {collapsedSections.upcoming ? (
                        <LuChevronRight className="text-sm text-slate-400 group-hover:text-slate-700" />
                      ) : (
                        <LuChevronDown className="text-sm text-slate-400 group-hover:text-slate-700" />
                      )}
                      <span>Upcoming</span>
                      <span className="font-normal text-slate-400">{upcomingTasks.length}</span>
                    </div>
                    <span className="text-slate-400 font-medium text-[11px]">23–30 Oct</span>
                  </div>

                  {!collapsedSections.upcoming && (
                    <div className="divide-y divide-slate-100">
                      {upcomingTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50/70 transition group"
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                            <button
                              type="button"
                              onClick={() => handleToggleTask(task.id)}
                              className="w-4 h-4 rounded-md border border-slate-300 hover:border-slate-500 transition shrink-0 flex items-center justify-center cursor-pointer"
                            >
                              {task.isCompleted && <LuCheck className="text-xs text-sky-600" />}
                            </button>
                            <span className="text-sm text-slate-800 truncate">{task.title}</span>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            {task.priority === "High" && (
                              <span className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                                <LuFlag className="text-xs text-slate-800 fill-slate-800" />
                                <span>High</span>
                              </span>
                            )}
                            <span className="text-xs text-slate-600 font-medium">
                              {task.dueDateLabel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Completed Tasks View */
          <div className="space-y-4">
            {filteredCompleted.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No completed tasks yet. Mark tasks as done to see them here.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredCompleted.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-slate-50/70 transition"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task.id)}
                        className="w-4 h-4 rounded-md bg-[#0084f4] border border-[#0084f4] text-white flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <LuCheck className="text-xs" />
                      </button>
                      <span className="text-sm text-slate-400 line-through truncate">
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-400">Completed</span>
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task.id)}
                        className="text-xs text-[#0084f4] hover:underline cursor-pointer"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Bottom Note */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Only High priority is marked. Everything else is Normal.
          </p>
        </div>
      </div>
    </div>
  );
}
