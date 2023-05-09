import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IPost, IPosts } from '../../models'

export const postsApi = createApi({
  reducerPath: 'postsApi',
  tagTypes: ['Posts', 'Post'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyapi.io/data/v1/',
    headers: { 'app-id': '6455b2b4bf5df73924396aeb' },
  }),

  endpoints: (build) => ({
    getPosts: build.query<
      IPosts,
      { page: number; debounceLimitNumber: number }
    >({
      query: ({ page, debounceLimitNumber }) => ({
        url: '/post',
        params: {
          page: page,
          limit: debounceLimitNumber,
        },
      }),
      providesTags: ['Posts'],
    }),

    getPostsTags: build.query<
      IPosts,
      { tagId: string; page: number; debounceLimitNumber: number }
    >({
      query: ({ tagId, page, debounceLimitNumber }) => ({
        url: `/tag/${tagId}/post`,
        params: {
          page: page,
          limit: debounceLimitNumber,
        },
      }),
      providesTags: ['Posts'],
    }),

    getPost: build.query<IPost, number>({
      query: (id) => ({ url: `/posts/:${id}` }),
      providesTags: ['Post'],
    }),

    updatePost: build.mutation<IPost, IPost>({
      query: ({ id, ...body }) => ({
        url: `/post/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: () => ['Posts'],
    }),

    // ____________________________________________________________

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
  }),
})

export const {
  useGetPostsQuery,
  useLazyGetPostsTagsQuery,
  useGetPostQuery,
  useUpdatePostMutation,
  useCreatePostMutation,
  useDeletePostMutation,
} = postsApi
