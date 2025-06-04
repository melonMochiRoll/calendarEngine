import { axiosInstance } from "./axiosInstance";

export const getTodosByDate = async (
  url: string | undefined,
  date: string,
) => {
  if (!url) {
    return;
  }

  try {
    const { data } = await axiosInstance
      .get(`/api/sharedspaces/${url}/todos?date=${date}`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const getTodosCount = async (
  url: string | undefined,
  year: string,
  month: string,
  ) => {
  if (!url) {
    return;
  }

  try {
    const { data } = await axiosInstance
      .get(`/api/sharedspaces/${url}/todos/count?date=${year}-${month}`);
      
    return data;
  } catch (error) {
    throw error;
  }
};

export const createTodo = async (
  description: string,
  date: string,
  startTime: string,
  endTime: string,
  AuthorId: number,
  url: string,
  ) => {
  try {
    await axiosInstance
      .post(`/api/sharedspaces/${url}/todos`, {
        description,
        date,
        startTime,
        endTime,
        AuthorId,
      });
  } catch (error) {
    throw error;
  }
};

export const updateTodo = async (
  id: number,
  description: string,
  startTime: string,
  endTime: string,
  EditorId: number,
  url: string,
  ) => {
  try {
    await axiosInstance
      .put(`/api/sharedspaces/${url}/todos`, {
        id,
        description,
        startTime,
        endTime,
        EditorId,
      });
  } catch (error) {
    throw error;
  }
};

export const deleteTodo = async (
  todoId: number,
  url: string,
) => {
  try {
    await axiosInstance
      .delete(`/api/sharedspaces/${url}/todos/${todoId}`);
  } catch (error) {
    throw error;
  }
};

export const searchTodos = async (
  url: string | undefined,
  query: string,
  offset: number = 1,
  limit: number = 10,
) => {
  if (!url || !query) {
    return [];
  }
  
  try {
    const { data } = await axiosInstance.get(
      `/api/sharedspaces/${url}/todos/search?query=${query}&offset=${offset}&limit=${limit}`
    );
    
    return data;
  } catch (error) {
    throw error;
  }
};