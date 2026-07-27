import { TSearchTodosPayload } from "Src/typings/types";
import { axiosInstance } from "./axiosInstance";

export const getTodosByMonth = async (
  SharedspaceId: string | undefined,
  year: string,
  month: string,
) => {
  if (!SharedspaceId) {
    return;
  }

  const { data } = await axiosInstance
    .get(`/api/sharedspaces/${SharedspaceId}/todos?date=${year}-${month}`);

  return data;
};

export const createTodo = async (
  description: string,
  date: string,
  startTime: string,
  endTime: string,
  SharedspaceId: string | undefined,
) => {
  if (!SharedspaceId) {
    return;
  }

  await axiosInstance
    .post(`/api/sharedspaces/${SharedspaceId}/todos`, {
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
  SharedspaceId: string | undefined,
) => {
  if (!SharedspaceId) {
    return;
  }

  await axiosInstance
    .put(`/api/sharedspaces/${SharedspaceId}/todos`, {
      id,
      description,
      date,
      startTime,
      endTime,
    });
};

export const deleteTodo = async (
  todoId: string,
  SharedspaceId: string | undefined,
) => {
  if (!SharedspaceId) {
    return;
  }

  await axiosInstance
    .delete(`/api/sharedspaces/${SharedspaceId}/todos/${todoId}`);
};

export const searchTodos = async (
  SharedspaceId: string | undefined,
  query: string,
  beforeTodoId?: string,
): Promise<TSearchTodosPayload> => {
  if (!query || !SharedspaceId) {
    return { todos: [], hasMoreData: false };
  }
  
  const { data } = await axiosInstance.get(
    `/api/sharedspaces/${SharedspaceId}/todos/search`, {
      params: {
        query,
        before: beforeTodoId,
      },
    }
  );
  
  return data;
};