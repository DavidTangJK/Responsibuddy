import "./index.css";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

// ADD YOUR FIREBASE CONFIG OBJECT HERE (from Step 4):
const firebaseConfig = {
  apiKey: "AIzaSyCrghmB4TWjkdmtkuTbA_aDrlQ8gBif1jA",
  authDomain: "responsibuddy.firebaseapp.com",
  projectId: "responsibuddy",
  storageBucket: "responsibuddy.firebasestorage.app",
  messagingSenderId: "15706687468",
  appId: "1:15706687468:web:9dc09a9a1fa8db8dca22c9",
  measurementId: "G-9HM1FC7K94",
}; // Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = firebaseConfig.projectId;

// --- SVG Icons ---
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5 text-yellow-400"
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c.321-.662 1.001-.662 1.323 0l1.879 3.868 4.172.606c.73.106 1.023.986.494 1.503l-3.019 2.94.713 4.156c.124.726-.635 1.28-1.28.944L10 15.11l-3.738 1.965c-.644.337-1.403-.218-1.28-.944l.713-4.156-3.019-2.94c-.53-.517-.237-1.397.494-1.503l4.172-.606 1.879-3.868z"
      clipRule="evenodd"
    />
  </svg>
);

const MascotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-blue-500"
  >
    <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10A10 10 0 0 0 12 2z" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path d="M9 9h.01" />
    <path d="M15 9h.01" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

const AvatarIcon = ({ className = "w-16 h-16 text-blue-300" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.5 5.5 0 0 0-5.5 5.5A.75.75 0 0 0 5.25 18h9.5a.75.75 0 0 0 .75-.75A5.5 5.5 0 0 0 10 12Z"
      clipRule="evenodd"
    />
  </svg>
);

// New Icons for Bottom Navigation
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path d="M11.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7Z" />
  </svg>
);

const TaskListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

const SocialIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.658a4.978 4.978 0 0 1-2.07-.659ZM16.51 15.326a4.978 4.978 0 0 1-2.07.659c.039-.216.048-.436.025-.658a6.484 6.484 0 0 0-1.905-3.959 3 3 0 0 1 4.308 3.516.78.78 0 0 1-.358.442ZM14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM10 18a5 5 0 0 0 5-5c0-2.209-1.79-4-4-4s-4 1.791-4 4a5 5 0 0 0 5 5Z" />
  </svg>
);

const ShopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M1 2.75A.75.75 0 0 1 1.75 2h1.562a1.75 1.75 0 0 1 1.73 1.598l.5 3.5A1.75 1.75 0 0 1 3.75 9H14.5a.75.75 0 0 1 .75.75v.042a.75.75 0 0 1-.67.745L5.45 11.23a1.75 1.75 0 0 1-1.699-1.34L3.3 8.373l-.631-4.416A.25.25 0 0 0 2.41 3.5H1.75A.75.75 0 0 1 1 2.75ZM.99 12.152a.75.75 0 0 1 .632-.78l12.723-1.817a.75.75 0 0 1 .84.67L16 17.75a.75.75 0 0 1-.75.75H4.342a.75.75 0 0 1-.74-.66L3.02 12.656a.75.75 0 0 1-.22-.488v-.016ZM5.5 13.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM11.5 14.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [childrenProfiles, setChildrenProfiles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effect for Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        try {
          // This logic is for the Canvas environment
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Error during sign-in:", error);
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Effect for Data Subscriptions (Profile & Tasks)
  useEffect(() => {
    if (user && db) {
      setLoading(true);
      const userId = user.uid;

      // 1. Subscribe to App Settings (viewMode, currentChildId)
      // This is private to the authenticated user
      const settingsDocRef = doc(
        db,
        `artifacts/${appId}/users/${userId}/appSettings`,
        "main"
      );
      const unsubscribeSettings = onSnapshot(
        settingsDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setSettings(docSnap.data());
          } else {
            // Create default settings
            const defaultSettings = {
              viewMode: "child",
              currentChildId: null,
            };
            setDoc(settingsDocRef, defaultSettings).then(() => {
              setSettings(defaultSettings);
            });
          }
        },
        (error) => {
          console.error("Error fetching settings:", error);
        }
      );

      // 2. Subscribe to Children Profiles Collection
      // These are public for the "family" (appId)
      const childrenCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/children`
      );
      const unsubscribeChildren = onSnapshot(
        childrenCollectionRef,
        (snapshot) => {
          const profilesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setChildrenProfiles(profilesData);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching children profiles:", error);
          setLoading(false);
        }
      );

      // 3. Subscribe to Tasks Collection
      // These are public for the "family" (appId)
      const tasksCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/tasks`
      );
      const q = query(tasksCollectionRef);
      const unsubscribeTasks = onSnapshot(
        q,
        (snapshot) => {
          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasksData);
        },
        (error) => {
          console.error("Error fetching tasks:", error);
        }
      );

      // Cleanup subscriptions on component unmount or user change
      return () => {
        unsubscribeSettings();
        unsubscribeChildren();
        unsubscribeTasks();
      };
    }
  }, [user, db]);

  // --- Handlers ---

  const handleToggleView = async (view) => {
    if (!user || !settings) return;

    const settingsDocRef = doc(
      db,
      `artifacts/${appId}/users/${user.uid}/appSettings`,
      "main"
    );
    try {
      // When switching to child view, reset the current child
      await updateDoc(settingsDocRef, {
        viewMode: view,
        currentChildId: view === "child" ? null : settings.currentChildId,
      });
    } catch (error) {
      console.error("Error updating view mode:", error);
    }
  };

  const handleCreateTask = async (text, stars, assignedTo, assignedToName) => {
    if (!text || stars <= 0) {
      console.log("Invalid task data");
      return;
    }
    try {
      const tasksCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/tasks`
      );
      await addDoc(tasksCollectionRef, {
        text: text,
        stars: parseInt(stars, 10),
        assignedTo: assignedTo, // 'all' or a child's doc ID
        assignedToName: assignedToName, // 'All Children' or child's name
        completed: false,
        createdAt: new Date(),
        completedBy: null,
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleCompleteTask = async (task) => {
    if (!user || !settings || !settings.currentChildId || task.completed)
      return;

    const childId = settings.currentChildId;
    const childProfile = childrenProfiles.find((p) => p.id === childId);
    if (!childProfile) {
      console.error("Could not find child profile to award stars.");
      return;
    }

    const taskDocRef = doc(db, `artifacts/${appId}/public/data/tasks`, task.id);
    const profileDocRef = doc(
      db,
      `artifacts/${appId}/public/data/children`,
      childId
    );

    try {
      const batch = writeBatch(db);

      // 1. Update the task
      batch.update(taskDocRef, {
        completed: true,
        completedBy: childId, // Store which child completed it
        completedAt: new Date(),
      });

      // 2. Update the child's stars
      batch.update(profileDocRef, {
        stars: (childProfile.stars || 0) + task.stars,
      });

      await batch.commit();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleAddChild = async (name) => {
    if (!name) return;
    try {
      const childrenCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/children`
      );
      await addDoc(childrenCollectionRef, {
        name: name,
        stars: 0,
        avatar: "default", // You could randomize this later
      });
    } catch (error) {
      console.error("Error adding child:", error);
    }
  };

  const handleSetCurrentChild = async (childId) => {
    if (!user) return;
    const settingsDocRef = doc(
      db,
      `artifacts/${appId}/users/${user.uid}/appSettings`,
      "main"
    );
    try {
      await updateDoc(settingsDocRef, { currentChildId: childId });
    } catch (error) {
      console.error("Error setting current child:", error);
    }
  };

  const handleBuyItem = async (item) => {
    if (!user || !settings || !settings.currentChildId) return;

    const childId = settings.currentChildId;
    const childProfile = childrenProfiles.find((p) => p.id === childId);

    if (!childProfile) {
      console.error("Could not find child profile.");
      return;
    }

    if (childProfile.stars < item.price) {
      console.error("Not enough stars!");
      // Here you could set an error message in state to show the user
      return;
    }

    const profileDocRef = doc(
      db,
      `artifacts/${appId}/public/data/children`,
      childId
    );

    try {
      // Deduct stars
      await updateDoc(profileDocRef, {
        stars: childProfile.stars - item.price,
      });

      // Here, you would also add the item to the child's "inventory"
      // For example:
      // const inventoryRef = collection(db, `artifacts/${appId}/public/data/children/${childId}/inventory`);
      // await addDoc(inventoryRef, {
      //   itemId: item.id,
      //   name: item.name,
      //   boughtAt: new Date()
      // });

      console.log("Purchase successful!");
    } catch (error) {
      console.error("Error buying item:", error);
    }
  };

  // --- Render Logic ---

  if (loading || !user || !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-xl font-semibold text-blue-600">
          Loading ResponsiBuddies...
        </div>
      </div>
    );
  }

  const currentView = settings.viewMode;
  const currentChildId = settings.currentChildId;
  const currentChildProfile = childrenProfiles.find(
    (p) => p.id === currentChildId
  );

  return (
    <div className="antialiased text-gray-800 bg-blue-50 min-h-screen p-4 sm:p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-xl shadow-lg mb-6">
          <div className="flex items-center gap-3">
            <MascotIcon />
            <h1 className="text-3xl font-bold text-blue-600">
              ResponsiBuddies
            </h1>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {currentView === "child" && currentChildProfile ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
                <StarIcon />
                <span className="font-bold text-lg text-yellow-700">
                  {currentChildProfile.stars || 0}
                </span>
              </div>
            ) : currentView === "parent" ? (
              <div className="px-4 py-2 font-semibold text-blue-600">
                Parent Mode
              </div>
            ) : null}
            <div className="text-xs text-gray-500 text-right">
              <div>User ID:</div>
              <div>{user.uid.substring(0, 10)}...</div>
            </div>
          </div>
        </header>

        {/* View Toggler */}
        <div className="flex justify-center mb-6">
          <div className="flex p-1 bg-blue-100 rounded-full">
            <button
              onClick={() => handleToggleView("child")}
              className={`py-2 px-6 rounded-full font-semibold transition-all ${
                currentView === "child"
                  ? "bg-white shadow text-blue-600"
                  : "text-blue-500 hover:bg-blue-200"
              }`}
            >
              Child View
            </button>
            <button
              onClick={() => handleToggleView("parent")}
              className={`py-2 px-6 rounded-full font-semibold transition-all ${
                currentView === "parent"
                  ? "bg-white shadow text-blue-600"
                  : "text-blue-500 hover:bg-blue-200"
              }`}
            >
              Parent View
            </button>
          </div>
        </div>

        {/* Main Content: Render view based on state */}
        <main>
          {currentView === "parent" ? (
            <ParentView
              tasks={tasks}
              childrenProfiles={childrenProfiles}
              onCreateTask={handleCreateTask}
              onAddChild={handleAddChild}
            />
          ) : !currentChildId ? (
            <ChildSelectionView
              childrenProfiles={childrenProfiles}
              onSelectChild={handleSetCurrentChild}
            />
          ) : (
            <ChildDashboard
              tasks={tasks}
              childrenProfiles={childrenProfiles}
              currentChildId={currentChildId}
              currentChildProfile={currentChildProfile}
              onCompleteTask={handleCompleteTask}
              onBuyItem={handleBuyItem}
              onSwitchChild={() => handleSetCurrentChild(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// --- Parent View Component ---
function ParentView({ tasks, childrenProfiles, onCreateTask, onAddChild }) {
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskStars, setNewTaskStars] = useState(10);
  const [assignedTo, setAssignedTo] = useState("all"); // Default to 'all'
  const [newChildName, setNewChildName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignedToName =
      assignedTo === "all"
        ? "All Children"
        : childrenProfiles.find((p) => p.id === assignedTo)?.name;

    if (!assignedToName) {
      console.error("Could not find name for assigned child.");
      return;
    }

    onCreateTask(newTaskText, newTaskStars, assignedTo, assignedToName);
    setNewTaskText("");
    setNewTaskStars(10);
    setAssignedTo("all");
  };

  const handleAddChildSubmit = (e) => {
    e.preventDefault();
    onAddChild(newChildName);
    setNewChildName("");
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Parent Dashboard</h2>

      {/* Manage Children */}
      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
        <h3 className="text-lg font-semibold">Manage Children</h3>
        <ul className="space-y-2">
          {childrenProfiles.map((child) => (
            <li
              key={child.id}
              className="flex justify-between items-center p-2 bg-white rounded border"
            >
              <div className="flex items-center gap-2">
                <AvatarIcon className="w-8 h-8 text-blue-400" />
                <span className="font-medium">{child.name}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
                <StarIcon className="w-4 h-4" />
                <span className="font-semibold text-sm text-yellow-700">
                  {child.stars}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddChildSubmit} className="flex gap-2">
          <input
            type="text"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            placeholder="New child's name"
            className="flex-grow p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Child
          </button>
        </form>
      </div>

      {/* Create Task Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-50 rounded-lg space-y-3"
      >
        <h3 className="text-lg font-semibold">Create New Task</h3>
        <div>
          <label
            htmlFor="taskText"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Task Name
          </label>
          <input
            id="taskText"
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="e.g., Clean your room"
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="taskStars"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Star Reward
            </label>
            <input
              id="taskStars"
              type="number"
              value={newTaskStars}
              onChange={(e) => setNewTaskStars(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="assignedTo"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Assign To
            </label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2 border rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Children</option>
              {childrenProfiles.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Task
        </button>
      </form>

      {/* Task Lists */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Pending Tasks ({pendingTasks.length})
          </h3>
          <div className="space-y-2">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  childrenProfiles={childrenProfiles}
                />
              ))
            ) : (
              <p className="text-gray-500">No pending tasks. Great job!</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">
            Completed Tasks ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  childrenProfiles={childrenProfiles}
                />
              ))
            ) : (
              <p className="text-gray-500">No tasks have been completed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Child Selection View Component ---
function ChildSelectionView({ childrenProfiles, onSelectChild }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Who is playing?
      </h2>
      {childrenProfiles.length === 0 ? (
        <p className="text-center text-gray-500">
          Ask a parent to add a child profile to get started!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {childrenProfiles.map((child) => (
            <button
              key={child.id}
              onClick={() => onSelectChild(child.id)}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-100 hover:shadow-md transition-all border border-transparent hover:border-blue-300"
            >
              <AvatarIcon />
              <span className="mt-2 text-lg font-semibold text-blue-600">
                {child.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Child View Component ---
function ChildDashboard({
  tasks,
  childrenProfiles,
  currentChildId,
  currentChildProfile,
  onCompleteTask,
  onBuyItem,
  onSwitchChild,
}) {
  const [childView, setChildView] = useState("tasks"); // 'tasks', 'home', 'social'

  let content;
  switch (childView) {
    case "home":
      content = (
        <HomeView
          currentChildProfile={currentChildProfile}
          onBuyItem={onBuyItem}
        />
      );
      break;
    case "social":
      content = (
        <SocialView
          childrenProfiles={childrenProfiles}
          currentChildId={currentChildId}
        />
      );
      break;
    case "tasks":
    default:
      content = (
        <TaskView
          tasks={tasks}
          currentChildId={currentChildId}
          onCompleteTask={onCompleteTask}
        />
      );
      break;
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">
          Hi, {currentChildProfile?.name}!
        </h2>
        <button
          onClick={onSwitchChild}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          Switch Child
        </button>
      </div>

      {/* Content Area */}
      {content}

      {/* Bottom Navigation */}
      <BottomNavigation currentView={childView} setView={setChildView} />
    </div>
  );
}

// --- Bottom Navigation Component ---
function BottomNavigation({ currentView, setView }) {
  const navItems = [
    { name: "home", icon: <HomeIcon /> },
    { name: "tasks", icon: <TaskListIcon /> },
    { name: "social", icon: <SocialIcon /> },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto bg-white border-t border-gray-200 shadow-lg_ md:rounded-b-xl">
      <nav className="flex justify-around items-center p-2">
        {navItems.map((item) => {
          const isActive = currentView === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setView(item.name)}
              className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium capitalize mt-1">
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
}

// --- Child "Home" View Component ---
function HomeView({ currentChildProfile, onBuyItem }) {
  const [showShop, setShowShop] = useState(false);

  if (showShop) {
    return (
      <ShopView
        currentChildProfile={currentChildProfile}
        onBuyItem={onBuyItem}
        onClose={() => setShowShop(false)}
      />
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Home</h2>
        <button
          onClick={() => setShowShop(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          <ShopIcon />
          <span>Go to Shop</span>
        </button>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full w-fit">
        <StarIcon />
        <span className="font-bold text-lg text-yellow-700">
          You have {currentChildProfile.stars || 0} stars
        </span>
      </div>

      {/* Virtual Home Placeholder */}
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 text-lg">Your Virtual Home Goes Here</p>
      </div>
    </div>
  );
}

// --- Child "Shop" View Component ---
const shopItems = [
  { id: "sofa", name: "Comfy Sofa", price: 50 },
  { id: "lamp", name: "Cool Lamp", price: 20 },
  { id: "plant", name: "Potted Plant", price: 15 },
  { id: "tv", name: "Big Screen TV", price: 100 },
];

function ShopView({ currentChildProfile, onBuyItem, onClose }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Star Shop</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to Home
        </button>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full w-fit">
        <StarIcon />
        <span className="font-bold text-lg text-yellow-700">
          You have {currentChildProfile.stars || 0} stars
        </span>
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-2 gap-4">
        {shopItems.map((item) => {
          const canBuy = currentChildProfile.stars >= item.price;
          return (
            <div
              key={item.id}
              className="p-4 border rounded-lg flex flex-col items-center space-y-2"
            >
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">{item.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4" />
                <span className="font-semibold text-yellow-700">
                  {item.price}
                </span>
              </div>
              <button
                onClick={() => onBuyItem(item)}
                disabled={!canBuy}
                className={`w-full px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                  canBuy
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {canBuy ? "Buy" : "Not Enough Stars"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Child "Social" View Component ---
function SocialView({ childrenProfiles, currentChildId }) {
  const friends = childrenProfiles.filter((p) => p.id !== currentChildId);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Friends</h2>
      {friends.length === 0 ? (
        <p className="text-gray-500">No other children profiles found.</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex justify-between items-center p-3 bg-white rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <AvatarIcon className="w-10 h-10 text-blue-400" />
                <span className="text-lg font-medium">{friend.name}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
                <StarIcon className="w-4 h-4" />
                <span className="font-semibold text-sm text-yellow-700">
                  {friend.stars}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- Child "Tasks" View Component ---
function TaskView({ tasks, currentChildId, onCompleteTask }) {
  // Show tasks assigned to "all" or to the specific child
  const myTasks = tasks.filter(
    (task) => task.assignedTo === "all" || task.assignedTo === currentChildId
  );
  const pendingTasks = myTasks.filter((task) => !task.completed);
  const completedTasks = myTasks.filter((task) => task.completed);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      {/* Pending Tasks List */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            To-Do ({pendingTasks.length})
          </h3>
          <div className="space-y-2">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isChildView={true}
                  onCompleteTask={onCompleteTask}
                />
              ))
            ) : (
              <p className="text-gray-500">No tasks left for today. Hooray!</p>
            )}
          </div>
        </div>

        {/* Completed Tasks List */}
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Done! ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} isChildView={true} />
              ))
            ) : (
              <p className="text-gray-500">Let's get started on some tasks!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Shared Task Item Component ---
function TaskItem({
  task,
  isChildView = false,
  onCompleteTask = () => {},
  childrenProfiles = [],
}) {
  const isCompleted = task.completed;

  const completer = isCompleted
    ? childrenProfiles.find((p) => p.id === task.completedBy)
    : null;
  const completerName = completer ? completer.name : "Someone";

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg transition-all gap-2 ${
        isCompleted
          ? "bg-gray-100"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        {isCompleted && (
          <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckIcon className="w-4 h-4 text-white" />
          </div>
        )}
        <div>
          <span
            className={`font-medium ${
              isCompleted ? "text-gray-500 line-through" : "text-gray-700"
            }`}
          >
            {task.text}
          </span>
          {!isChildView && (
            <span className="block text-sm text-gray-500">
              (For: {task.assignedToName})
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 justify-between sm:justify-end">
        <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
          <StarIcon className="w-4 h-4" />
          <span className="font-semibold text-sm text-yellow-700">
            {task.stars}
          </span>
        </div>
        {isChildView && !isCompleted && (
          <button
            onClick={() => onCompleteTask(task)}
            className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-600 transition-colors"
          >
            Complete
          </button>
        )}
        {!isChildView && isCompleted && (
          <span className="text-sm font-medium text-green-600">
            Completed by {completerName}
          </span>
        )}
      </div>
    </div>
  );
}
