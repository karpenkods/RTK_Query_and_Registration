import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IUser } from '../../models/user'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['Users'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyapi.io/data/v1/',
    headers: { 'app-id': '6455b2b4bf5df73924396aeb' },
  }),

  endpoints: (build) => ({
    getUsers: build.query<IUser[], number>({
      query: (debounceLimit) => ({
        url: '/user',
        params: {
          limit: debounceLimit,
        },
      }),
      providesTags: ['Users'],
    }),

    createUsers: build.mutation<string, IUser>({
      query: (body) => ({
        url: '/user',
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
