import { axiosInstance } from "./axiosInstance";

export const getTodosByMonth = async (
  url: string | undefined,
  year: string,
  month: string,
) => {
  if (!url) {
    return;
  }

  try {
    const { data } = await axiosInstance
      .get(`/api/sharedspaces/${url}/todos?date=${year}-${month}`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const createTodo = async (
  description: string,
  date: string,
  startTime: string,
  endTime: string,
  url: string | undefined,
) => {
  if (!url) {
    throw new Error;
  }

  try {
    await axiosInstance
      .post(`/api/sharedspaces/${url}/todos`, {
        description,
        date,
        startTime,
        endTime,
      });
  } catch (err) {
    throw err;
  }
};

export const updateTodo = async (
  id: number,
  description: string,
  date: string,
  startTime: string,
  endTime: string,
  url: string | undefined,
) => {
  if (!url) {
    throw new Error;
  }

  try {
    await axiosInstance
      .put(`/api/sharedspaces/${url}/todos`, {
        id,
        description,
        date,
        startTime,
        endTime,
      });
  } catch (err) {
    throw err;
  }
};

export const deleteTodo = async (
  todoId: number,
  url: string | undefined,
) => {
  if (!url) {
    throw new Error;
  }

  try {
    await axiosInstance
      .delete(`/api/sharedspaces/${url}/todos/${todoId}`);
  } catch (err) {
    throw err;
  }
};

export const searchTodos = async (
  url: string | undefined,
  query: string,
  page: number,
) => {
  if (!query) {
    return [];
  }

  if (!url) {
    return;
  }
  
  try {
    const { data } = await axiosInstance.get(
      `/api/sharedspaces/${url}/todos/search?query=${query}&page=${page}`
    );
    
    return data;
  } catch (err) {
    throw err;
  }
};