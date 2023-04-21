import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IUser } from '../../models/user'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['Users'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
  }),

  endpoints: (build) => ({
    getUsers: build.query<IUser[], string>({
      query: () => ({ url: '/users' }),
      providesTags: ['Users'],
    }),

    createUsers: build.mutation<string, IUser>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => ['Users'],
    }),

    deleteUser: build.mutation<IUser, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => ['Users'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useCreateUsersMutation,
  useDeleteUserMutation,
} = usersApi
