"use client"; // Enables client-side rendering for this component

import { useState, useEffect } from "react"; // Import useState and useEffect hooks from React
import { Button } from "@/components/ui/button"; // Import custom Button component
import { Card } from "@/components/ui/card"; // Import custom Card component
import { FilePenIcon, TrashIcon } from "lucide-react"; // Import icons from lucide-react

// Define the Note type
type Note = {
  id: number;
  title: string;
  content: string;
};

// Default notes to initialize the app with
const defaultNotes: Note[] = [
  {
    id: 1,
    title: "Grocery List",
    content: "Milk, Eggs, Bread, Apples",
  },
  {
    id: 2,
    title: "Meeting Notes",
    content: "Discuss new project timeline, assign tasks to team",
  },
  {
    id: 3,
    title: "Idea for App",
    content: "Develop a note-taking app with a clean and minimalist design",
  },
];

// Custom hook to manage localStorage with state
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default function NotesApp() {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", defaultNotes);
  const [newNote, setNewNote] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddNote = (): void => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const newNoteWithId = { id: Date.now(), ...newNote };
      setNotes([...notes, newNoteWithId]);
      setNewNote({ title: "", content: "" });
    }
  };

  const handleEditNote = (id: number): void => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setNewNote({ title: noteToEdit.title, content: noteToEdit.content });
      setEditingNoteId(id);
    }
  };

  const handleUpdateNote = (): void => {
    if (newNote.title.trim() && newNote.content.trim()) {
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? { id: note.id, title: newNote.title, content: newNote.content }
            : note
        )
      );
      setNewNote({ title: "", content: "" });
      setEditingNoteId(null);
    }
  };

  const handleDeleteNote = (id: number): void => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-foreground">
      {/* Header Section */}
      <header className="bg-blue-600 p-6 shadow-lg text-white">
        <h1 className="text-3xl font-extrabold">📝 My Notes</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Input Section */}
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
            <input
              type="text"
              placeholder="Enter note title"
              value={newNote.title || ""}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 p-3 mb-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Enter note content"
              value={newNote.content || ""}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            />
            <Button
              onClick={editingNoteId === null ? handleAddNote : handleUpdateNote}
              className="mt-3 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              {editingNoteId === null ? "Add Note" : "Update Note"}
            </Button>
          </div>

          {/* Notes List Section */}
          <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="p-4 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{note.title}</h2>
                  <div className="flex space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditNote(note.id)}
                    >
                      <FilePenIcon className="h-5 w-5 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{note.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
