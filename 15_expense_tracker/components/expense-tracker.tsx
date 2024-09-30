"use client"; // Enables client-side rendering for this component

import React, { useState, useEffect, ChangeEvent } from "react"; // Import React hooks and types
import { Button } from "@/components/ui/button"; // Import custom Button component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Import custom Dialog components
import { Label } from "@/components/ui/label"; // Import custom Label component
import { Input } from "@/components/ui/input"; // Import custom Input component
import { FilePenIcon, PlusIcon, TrashIcon } from "lucide-react"; // Import icons from lucide-react
import { format } from "date-fns"; // Import date formatting utility

// Define the Expense type
type Expense = {
  id: number;
  name: string;
  amount: number;
  date: Date;
};

// Initial expenses to populate the tracker
const initialExpenses: Expense[] = [
  {
    id: 1,
    name: "Groceries",
    amount: 250,
    date: new Date("2024-05-15"),
  },
  {
    id: 2,
    name: "Rent",
    amount: 250,
    date: new Date("2024-06-01"),
  },
  {
    id: 3,
    name: "Utilities",
    amount: 250,
    date: new Date("2024-06-05"),
  },
  {
    id: 4,
    name: "Dining Out",
    amount: 250,
    date: new Date("2024-06-10"),
  },
];

export default function ExpenseTracker() {
  // State to manage the list of expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);
  // State to manage the visibility of the modal
  const [showModal, setShowModal] = useState<boolean>(false);
  // State to track if an expense is being edited
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // State to track the current expense being edited
  const [currentExpenseId, setCurrentExpenseId] = useState<number | null>(null);
  // State to manage the new expense input form
  const [newExpense, setNewExpense] = useState<{
    name: string;
    amount: string; // Using string for controlled input
    date: Date;
  }>({
    name: "",
    amount: "",
    date: new Date(),
  });

  // useEffect to load expenses from local storage or set initial expenses
  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      setExpenses(
        JSON.parse(storedExpenses).map((expense: Expense) => ({
          ...expense,
          date: new Date(expense.date), // Ensure date is a Date object
        }))
      );
    } else {
      setExpenses(initialExpenses); // Set initial expenses if none stored
    }
  }, []);

  // useEffect to store expenses in local storage whenever they change
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem("expenses", JSON.stringify(expenses)); // Store expenses in local storage
    }
  }, [expenses]);

  // Function to handle adding a new expense
  const handleAddExpense = (): void => {
    const amount = parseFloat(newExpense.amount); // Convert amount to a number

    // Check if the amount is valid
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount."); // Alert if amount is invalid
      return; // Prevent adding if the amount is invalid
    }

    setExpenses([
      ...expenses,
      {
        id: expenses.length + 1, // Generate a new ID for the expense
        name: newExpense.name,
        amount: amount, // Ensure amount is a valid number
        date: new Date(newExpense.date), // Use date from input
      },
    ]);
    resetForm(); // Reset the input form
    setShowModal(false); // Close the modal
  };

  // Function to handle editing an existing expense
  const handleEditExpense = (id: number): void => {
    const expenseToEdit = expenses.find((expense) => expense.id === id); // Find the expense by ID
    if (expenseToEdit) {
      // Populate the form with the selected expense data
      setNewExpense({
        name: expenseToEdit.name,
        amount: expenseToEdit.amount.toString(), // Convert amount to string for controlled input
        date: expenseToEdit.date,
      });
      setCurrentExpenseId(id); // Set the ID of the current expense
      setIsEditing(true); // Set editing mode to true
      setShowModal(true); // Show the modal
    }
  };

  // Function to handle saving the edited expense
  const handleSaveEditExpense = (): void => {
    const amount = parseFloat(newExpense.amount); // Convert amount to a number

    // Check if the amount is valid
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount."); // Alert if amount is invalid
      return; // Prevent saving if the amount is invalid
    }

    setExpenses(
      expenses.map((expense) =>
        expense.id === currentExpenseId
          ? { ...expense, ...newExpense, amount: amount } // Update the expense
          : expense
      )
    );
    resetForm(); // Reset the input form
    setShowModal(false); // Close the modal
  };

  // Function to reset the input form
  const resetForm = (): void => {
    setNewExpense({
      name: "",
      amount: "", // Reset amount to empty string
      date: new Date(), // Reset date to current date
    });
    setIsEditing(false); // Reset editing mode
    setCurrentExpenseId(null); // Reset current expense ID
  };

  // Function to handle deleting an expense
  const handleDeleteExpense = (id: number): void => {
    setExpenses(expenses.filter((expense) => expense.id !== id)); // Remove the expense by ID
  };

  // Calculate the total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount, // Sum up the amounts
    0
  );

  // Function to handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target; // Destructure target ID and value
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [id]:
        id === "amount"
          ? value // Keep amount as a string for input
          : id === "date"
          ? new Date(value) // Convert date to Date object
          : value,
    }));
  };

  // JSX return statement rendering the Expense Tracker UI
  return (
    <div className="flex flex-col h-screen">
      {/* Header section */}
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <div className="text-2xl font-bold">
            Total: ${totalExpenses.toFixed(2)} {/* Display total expenses */}
          </div>
        </div>
      </header>
      {/* Main section */}
      <main className="flex-1 overflow-y-auto p-6">
        <ul className="space-y-4">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="bg-card p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium">{expense.name}</h3>
                <p className="text-muted-foreground">
                  ${expense.amount != null ? expense.amount.toFixed(2) : "0.00"} -{" "}
                  {format(expense.date, "dd/MM/yyyy")} {/* Format date for display */}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditExpense(expense.id)} // Open edit modal
                >
                  <FilePenIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteExpense(expense.id)} // Delete expense
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      {/* Floating add expense button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="icon"
          className="rounded-full shadow-lg"
          onClick={() => {
            setShowModal(true); // Show modal for adding expense
            setIsEditing(false); // Reset editing state
            resetForm(); // Reset form fields
          }}
        >
          <PlusIcon className="w-6 h-6" />
        </Button>
      </div>
      {/* Modal dialog for adding/editing expenses */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card p-6">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Expense" : "Add Expense"}</DialogTitle>
          </DialogHeader>
          {/* Input fields for expense details */}
          <Label htmlFor="name">Expense Name</Label>
          <Input
            id="name"
            value={newExpense.name}
            onChange={handleInputChange}
            className="mb-4"
          />
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number" // Set input type to number
            value={newExpense.amount}
            onChange={handleInputChange}
            className="mb-4"
          />
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date" // Set input type to date
            value={newExpense.date.toISOString().substring(0, 10)} // Format date for input
            onChange={handleInputChange}
            className="mb-4"
          />
          {/* Modal footer with buttons */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={isEditing ? handleSaveEditExpense : handleAddExpense}>
              {isEditing ? "Save" : "Add"} Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
