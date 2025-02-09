import { z } from "zod";
import { router, procedure } from ".";

export const taskRouter = router({
  // Create a new task
  create: procedure
    .input(z.object({ name: z.string().min(1, "Task name cannot be empty") })) // Validate non-empty string
    .mutation(async ({ input, ctx }) => {
      try {
        const newTask = await ctx.prisma.task.create({
          data: { name: input.name },
        });
        console.log("[Task Created]:", newTask); // Log created task
        return newTask;
      } catch (error) {
        console.error("[Error Creating Task]:", error);
        throw new Error("Unable to create task. Please try again.");
      }
    }),

  // Get all tasks from the database
  getAll: procedure.query(async ({ ctx }) => {
    try {
      const tasks = await ctx.prisma.task.findMany();
      console.log("[Fetched All Tasks]:", tasks); // Log fetched tasks
      return tasks;
    } catch (error) {
      console.error("[Error Fetching Tasks]:", error);
      throw new Error("Unable to fetch tasks. Please try again.");
    }
  }),

  // Fetch a single task by ID
  getById: procedure
    .input(z.object({ id: z.number().min(1, "ID must be a positive number") })) // Validate positive number for ID
    .query(async ({ input, ctx }) => {
      try {
        const task = await ctx.prisma.task.findUnique({
          where: { id: input.id },
        });
        if (!task) {
          console.warn(`[Task Not Found]: ID ${input.id}`); // Log if task not found
          throw new Error(`Task with ID ${input.id} does not exist.`);
        }
        console.log("[Fetched Task by ID]:", task); // Log fetched task
        return task;
      } catch (error) {
        console.error("[Error Fetching Task by ID]:", error);
        throw new Error("Unable to fetch task by ID. Please try again.");
      }
    }),
});

// Main app router
export const appRouter = router({
  task: taskRouter, // Attach taskRouter under the "task" namespace
});

// Export type for use in client setup
export type AppRouter = typeof appRouter;
