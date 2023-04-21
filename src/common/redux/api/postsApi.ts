import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IPost } from '../../models'

export const postsApi = createApi({
  reducerPath: 'postsApi',
  tagTypes: ['Posts', 'Post'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
  }),

  endpoints: (build) => ({
    getPosts: build.query<IPost[], number>({
      query: (debounceLimit) => ({
        url: '/posts',
        params: {
          _limit: debounceLimit,
        },
      }),
      providesTags: ['Posts'],
    }),

    getPost: build.query<IPost, number>({
      query: (id) => ({ url: `/posts/${id}` }),
      providesTags: ['Post'],
    }),

    createPost: build.mutation<IPost, IPost>({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => ['Posts'],
    }),

    deletePost: build.mutation<IPost, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => ['Posts'],
    }),

    putPost: build.mutation<IPost, IPost>({
      query: ({ id, ...body }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: () => ['Post'],
    }),
  }),
})

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  usePutPostMutation,
} = postsApi
