import "./index.css";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  addDoc,
  collection,
  query,
  onSnapshot,
  updateDoc,
  writeBatch,
  where,
  Timestamp,
} from "firebase/firestore";

// Import our new config and components
import { auth, db, appId, signInAnonymously } from "./firebaseConfig.js";
import { MascotIcon, StarIcon, LockIcon } from "./components/icons.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ParentView from "./views/ParentView.jsx";
import ChildSelectionView from "./views/ChildSelectionView.jsx";
import ChildDashboard from "./views/ChildDashboard.jsx";

// Helper function to get the start of the day as a string
const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null);

  // --- Local State for View Management (Replaces Firestore 'settings') ---
  const [view, setView] = useState("child"); // Default to child view for safety
  const [currentChildId, setCurrentChildId] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  // ---

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
      //    REMOVED: This is no longer stored in Firestore.

      // 2. Subscribe to Children Profiles Collection
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

      // 3. Subscribe to Tasks Collection (Only for today)
      const tasksCollectionRef = collection(
        db,
        `artifacts/${appId}/public/data/tasks`
      );
      const todayString = getTodayString();

      const q = query(tasksCollectionRef, where("taskDate", "==", todayString));

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
        // unsubscribeSettings(); // No longer needed
        unsubscribeChildren();
        unsubscribeTasks();
      };
    }
  }, [user, db]);

  // --- Handlers ---

  const handleViewChange = (targetView) => {
    if (targetView === "parent") {
      // Show PIN modal instead of switching directly
      setShowPinModal(true);
    } else {
      setView("child");
      setCurrentChildId(null); // Go back to child selection
    }
  };

  const handlePinSubmit = (pin) => {
    const PARENT_PIN = "1234"; // Hardcoded PIN

    if (pin === PARENT_PIN) {
      setView("parent");
      setShowPinModal(false);
    } else {
      // Show an error in the modal
      return "Incorrect PIN. Please try again.";
    }
  };

  const handleCreateTask = async (
    text,
    stars,
    assignedTo,
    assignedToName,
    taskDate
  ) => {
    if (!text || stars <= 0 || !taskDate) {
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
        taskDate: taskDate, // YYYY-MM-DD string
        createdAt: new Date(),
        status: "pending", // 'pending', 'completed'
        completed: false, // Legacy, for compatibility
        completedBy: null,
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleCompleteTask = async (task) => {
    if (!user || !currentChildId || task.status === "completed") return;

    const childId = currentChildId;
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
        status: "completed",
        completed: true, // Legacy
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

  const handleSetCurrentChild = (childId) => {
    // This now just sets local state, no DB write
    setCurrentChildId(childId);
  };

  const handleBuyItem = async (item) => {
    if (!user || !currentChildId) return;

    const childId = currentChildId;
    const childProfile = childrenProfiles.find((p) => p.id === childId);

    if (!childProfile) {
      console.error("Could not find child profile.");
      return;
    }

    if (childProfile.stars < item.price) {
      console.error("Not enough stars!");
      return;
    }

    const profileDocRef = doc(
      db,
      `artifacts/${appId}/public/data/children`,
      childId
    );

    try {
      await updateDoc(profileDocRef, {
        stars: childProfile.stars - item.price,
      });

      // Here, you would also add the item to the child's "inventory"
      const inventoryRef = collection(
        db,
        `artifacts/${appId}/public/data/children/${childId}/inventory`
      );
      await addDoc(inventoryRef, {
        itemId: item.id,
        name: item.name,
        boughtAt: new Date(),
      });

      console.log("Purchase successful!");
    } catch (error) {
      console.error("Error buying item:", error);
    }
  };

  // --- Render Logic ---

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  const currentView = view; // Use local state
  const currentChildProfile = childrenProfiles.find(
    (p) => p.id === currentChildId
  );

  return (
    <div className="antialiased text-gray-800 bg-blue-50 min-h-screen p-4 sm:p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
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
              <div className="font-mono break-all">{user.uid}</div>
            </div>
          </div>
        </header>

        {/* View Toggler */}
        <div className="mb-6 flex justify-center">
          <div className="flex p-1 bg-blue-100 rounded-full">
            <button
              onClick={() => handleViewChange("child")}
              className={`py-2 px-6 rounded-full font-semibold transition-all ${
                currentView === "child"
                  ? "bg-white shadow text-blue-600"
                  : "text-blue-500 hover:bg-blue-200"
              }`}
            >
              Child View
            </button>
            <button
              onClick={() => handleViewChange("parent")}
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

        {/* PIN Modal */}
        {showPinModal && (
          <ParentPinModal
            onSubmit={handlePinSubmit}
            onCancel={() => setShowPinModal(false)}
          />
        )}

        {/* Main Content: Render view based on state */}
        <main>
          {currentView === "parent" ? (
            <ParentView
              tasks={tasks} // Will only contain today's tasks
              childrenProfiles={childrenProfiles}
              onCreateTask={handleCreateTask}
              onAddChild={handleAddChild}
              getTodayString={getTodayString}
            />
          ) : !currentChildId ? (
            <ChildSelectionView
              childrenProfiles={childrenProfiles}
              onSelectChild={handleSetCurrentChild}
            />
          ) : (
            <ChildDashboard
              tasks={tasks} // Will only contain today's tasks
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

// --- PIN Modal Component ---
const ParentPinModal = ({ onSubmit, onCancel }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onSubmit(pin);
    if (result) {
      setError(result); // Show error message if PIN is wrong
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <LockIcon />
          <h2 className="text-xl font-bold text-gray-800">Enter Parent PIN</h2>
        </div>
        <p className="text-center text-gray-600 mb-6">
          Please enter the 4-digit PIN to access the parent dashboard.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            maxLength="4"
            value={pin}
            onChange={(e) => {
              setError(""); // Clear error on new input
              setPin(e.target.value.replace(/[^0-9]/g, ""));
            }}
            className="w-full text-center text-3xl font-mono tracking-widest p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
