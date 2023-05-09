import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IComment } from '../../models'

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  tagTypes: ['Comments'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyapi.io/data/v1/',
    headers: { 'app-id': '6455b2b4bf5df73924396aeb' },
  }),

  endpoints: (build) => ({
    getComments: build.query<IComment[], number>({
      query: (debounceLimit) => ({
        url: '/comment',
        params: {
          limit: debounceLimit,
        },
      }),
      providesTags: ['Comments'],
    }),
  }),
})

export const { useGetCommentsQuery } = commentsApi
