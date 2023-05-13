import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IComment, ICommentCreate, IComments } from '../../models'

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  tagTypes: ['Comments'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyapi.io/data/v1/',
    headers: { 'app-id': '6455b2b4bf5df73924396aeb' },
  }),

  endpoints: (build) => ({
    getComments: build.query<IComments, number>({
      query: (debounceLimit) => ({
        url: '/comment',
        params: {
          limit: debounceLimit,
        },
      }),
      providesTags: ['Comments'],
    }),

    getCommentsByPost: build.query<IComments, string>({
      query: (id) => ({ url: `/post/${id}/comment` }),
      providesTags: ['Comments'],
    }),

    createComment: build.mutation<IComment, ICommentCreate>({
      query: (body) => ({
        url: '/comment/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => ['Comments'],
    }),
  }),
})

export const {
  useGetCommentsQuery,
  useLazyGetCommentsByPostQuery,
  useCreateCommentMutation,
} = commentsApi
