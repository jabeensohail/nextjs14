import { trpc } from "../utils/trpc";
import { useState } from "react";
import "../styles/global.css"; // Importing global styles
import "../styles/tailwind.css";

export default function TaskManager() {
  const [taskName, setTaskName] = useState("");
  const [taskId, setTaskId] = useState<number | null>(null);

  // Query to fetch all tasks from the database
  const tasksQuery = trpc.task.getAll.useQuery();

  // Mutation to create a new task
  const createTask = trpc.task.create.useMutation({
    onSuccess: () => tasksQuery.refetch(), // Refetch tasks after creating a new one
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Task Manager</h1>

      {/* Form to add a new task */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTask.mutate({ name: taskName });
          setTaskName("");
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

      {/* Display all tasks */}
      {tasksQuery.isLoading ? (
        <p>Loading tasks...</p>
      ) : tasksQuery.error ? (
        <p>Error fetching tasks</p>
      ) : (
        <ul className="task-list">
          {tasksQuery.data?.map((task) => (
            <li key={task.id} className="task-item p-2 border-b border-gray-200">{task.name}</li>
          ))}
        </ul>
      )}

      <div className="fetch-task mt-8">
        <h2 className="text-xl font-semibold">Fetch Task by ID</h2>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <input
            type="number"
            placeholder="Enter Task ID"
            value={taskId ?? ""}
            onChange={(e) => setTaskId(Number(e.target.value))}
            className="input p-2 border border-gray-300 rounded-md w-full sm:w-80"
          />
          <button
            onClick={handleFetchById}
            className="button bg-brown-500 hover:bg-brown-600 text-white py-2 px-4 rounded-md w-full sm:w-auto ml-auto"
          >
            Fetch Task
          </button>
        </div>

        {taskByIdQuery.isLoading && <p>Loading...</p>}
        {taskByIdQuery.error && <p>Error: {taskByIdQuery.error.message}</p>}
        {taskByIdQuery.data ? (
          <div className="task-details mt-4 p-4 border border-gray-200 rounded-md">
            <h3 className="font-semibold">Task Details</h3>
            <p>ID: {taskByIdQuery.data.id}</p>
            <p>Name: {taskByIdQuery.data.name}</p>
          </div>
        ) : (
          <p>No task found</p>
        )}
      </div>
    </div>
  );
}
