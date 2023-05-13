import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IUser } from '../../models/user'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['Users', 'User'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyapi.io/data/v1/',
    headers: { 'app-id': '6455b2b4bf5df73924396aeb' },
  }),

  endpoints: (build) => ({
    getUsers: build.query<IUser[], string>({
      query: () => ({
        url: '/user',
      }),
      providesTags: ['Users'],
    }),

    getUser: build.query<IUser, string>({
      query: (id) => ({ url: `/user/${id}` }),
      providesTags: ['User'],
    }),

    createUsers: build.mutation<IUser, IUser>({
      query: (body) => ({
        url: '/user/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => ['Users'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useCreateUsersMutation,
} = usersApi
