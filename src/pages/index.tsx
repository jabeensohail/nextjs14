import { trpc } from "../utils/trpc";
import { useState } from "react";
import "../styles/global.css"; // Importing global styles

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
    <div className="container">
      <h1>Task Manager</h1>

      {/* Form to add a new task */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTask.mutate({ name: taskName });
          setTaskName("");
        }}
        className="task-form"
      >
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="New Task"
          className="input"
        />
        <button type="submit" className="button">Add Task</button>
      </form>

      {/* Display all tasks */}
      {tasksQuery.isLoading ? (
        <p>Loading tasks...</p>
      ) : tasksQuery.error ? (
        <p>Error fetching tasks</p>
      ) : (
        <ul className="task-list">
          {tasksQuery.data?.map((task) => (
            <li key={task.id} className="task-item">{task.name}</li>
          ))}
        </ul>
      )}

      <div className="fetch-task">
        <h2>Fetch Task by ID</h2>
        <input
          type="number"
          placeholder="Enter Task ID"
          value={taskId ?? ""}
          onChange={(e) => setTaskId(Number(e.target.value))}
          className="input"
        />
        <button onClick={handleFetchById} className="button">Fetch Task</button>

        {taskByIdQuery.isLoading && <p>Loading...</p>}
        {taskByIdQuery.error && <p>Error: {taskByIdQuery.error.message}</p>}
        {taskByIdQuery.data ? (
          <div className="task-details">
            <h3>Task Details</h3>
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
