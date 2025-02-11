import { trpc } from "../utils/trpc";
import { useState, useEffect } from "react";
import "../styles/global.css"; // Importing global styles
import "../styles/tailwind.css";

export default function TaskManager() {
  const [taskName, setTaskName] = useState("");
  const [taskId, setTaskId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null); // State for feedback message
  const [taskNotFound, setTaskNotFound] = useState(false); // State to handle not found task by ID

  // Query to fetch all tasks from the database
  const tasksQuery = trpc.task.getAll.useQuery();

  // Mutation to create a new task
  const createTask = trpc.task.create.useMutation({
    onSuccess: () => {
      tasksQuery.refetch(); // Refetch tasks after creating a new one
      setMessage("The entry has been saved in DB"); // Success message
      setTimeout(() => setMessage(null), 3000); // Clear the message after 3 seconds
    },
  });

  // Query to fetch a task by ID
  const taskByIdQuery = trpc.task.getById.useQuery(
    { id: taskId ?? 0 },
    { enabled: false } // Disable automatic fetching
  );

  const handleFetchById = () => {
    if (taskId !== null) {
      taskByIdQuery.refetch();
    } else {
      alert("Please enter a valid Task ID");
    }
  };

  useEffect(() => {
    if (taskByIdQuery.isSuccess && taskByIdQuery.data) {
      setTaskNotFound(false); // Reset if task is found
    }

    if (taskByIdQuery.isError) {
      setTaskNotFound(true); // Set error if task isn't found
    }
  }, [taskByIdQuery.isSuccess, taskByIdQuery.isError]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Task Manager</h1>

      {/* Form to add a new task */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTask.mutate({ name: taskName });
          setTaskName(""); // Clear input after submitting
        }}
        className="task-form flex flex-col sm:flex-row gap-4 mb-6"
      >
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="New Task"
          className="input p-2 border border-gray-300 rounded-md w-full sm:w-80"
        />
        <button
          type="submit"
          className="button bg-brown-500 hover:bg-brown-600 text-white py-2 px-4 rounded-md w-full sm:w-auto ml-auto"
        >
          Add Task
        </button>
      </form>

      {/* Show success or error message */}
      {message && <p className="text-green-500 text-center">{message}</p>}

      {/* Display all tasks */}
      {tasksQuery.isLoading && !tasksQuery.isError ? (
        <p className="text-center">Loading tasks...</p>
      ) : (
        <ul className="task-list">
          {tasksQuery.data?.map((task) => (
            <li key={task.id} className="task-item p-2 border-b border-gray-200">
              {task.name}
            </li>
          ))}
        </ul>
      )}

      {/* Fetch task by ID */}
      <div className="fetch-task mt-8">
        <h1 className="text-xl font-semibold">Fetch Task by ID</h1>
        <div className="task-form flex flex-col sm:flex-row gap-4 mb-6 mt-6">
          <input
            type="number"
            placeholder="Enter Task ID"
            value={taskId ?? ""}
            onChange={(e) => setTaskId(Number(e.target.value))}
            className="input p-2 border border-gray-300 rounded-md w-full sm:w-80 mt-6"
          />
          <button
            onClick={handleFetchById}
            className="button bg-brown-500 hover:bg-brown-600 text-white py-2 px-4 rounded-md w-full sm:w-auto ml-auto mt-6"
          >
            Fetch Task
          </button>
        </div>

        {taskByIdQuery.isLoading && <p className="text-center">Loading task details...</p>}
        {taskByIdQuery.error && taskByIdQuery.isError && !taskByIdQuery.isLoading && (
          <p className="text-red-500 text-center">
            The required ID's row does not exist!
          </p>
        )}
        {taskByIdQuery.data && !taskByIdQuery.isLoading && (
          <div className="task-details mt-4 p-4 border border-gray-200 rounded-md flex flex-row w-300 grid place-items-center max-w-md mx-auto">
            <h3 className="font-semibold">Task Details</h3>
            <p>ID: {taskByIdQuery.data.id}</p>
            <p>Name: {taskByIdQuery.data.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
