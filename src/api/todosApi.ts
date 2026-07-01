import { TSearchTodosPayload } from "Src/typings/types";
import { axiosInstance } from "./axiosInstance";

export const getTodosByMonth = async (
  url: string | undefined,
  year: string,
  month: string,
) => {
  if (!url) {
    return;
  }

  const { data } = await axiosInstance
    .get(`/api/sharedspaces/${url}/todos?date=${year}-${month}`);

  return data;
};

export const createTodo = async (
  description: string,
  date: string,
  startTime: string,
  endTime: string,
  url: string | undefined,
) => {
  if (!url) {
    return;
  }

  await axiosInstance
    .post(`/api/sharedspaces/${url}/todos`, {
      description,
      date,
      startTime,
      endTime,
    });
};

export const updateTodo = async (
  id: string,
  description: string,
  date: string,
  startTime: string,
  endTime: string,
  url: string | undefined,
) => {
  if (!url) {
    return;
  }

  await axiosInstance
    .put(`/api/sharedspaces/${url}/todos`, {
      id,
      description,
      date,
      startTime,
      endTime,
    });
};

export const deleteTodo = async (
  todoId: string,
  url: string | undefined,
) => {
  if (!url) {
    return;
  }

  await axiosInstance
    .delete(`/api/sharedspaces/${url}/todos/${todoId}`);
};

export const searchTodos = async (
  url: string | undefined,
  query: string,
  beforeTodoId?: string,
): Promise<TSearchTodosPayload> => {
  if (!query || !url) {
    return { todos: [], hasMoreData: false };
  }
  
  const { data } = await axiosInstance.get(
    `/api/sharedspaces/${url}/todos/search`, {
      params: {
        query,
        before: beforeTodoId,
      },
    }
  );
  
  return data;
};