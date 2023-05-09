import { FC, Fragment } from 'react'

import { Card, CardContent, CardHeader, Grid, Skeleton } from '@mui/material'

export const SkeletonCardPosts: FC = () => {
  return (
    <Grid container justifyContent="center" spacing={4} mt="50px" mb="50px">
      {[...new Array(12)].map((_, i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader
              avatar={
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={50}
                  height={50}
                />
              }
              title={
                <Skeleton
                  animation="wave"
                  height={10}
                  width="80%"
                  style={{ marginBottom: 6 }}
                />
              }
              subheader={<Skeleton animation="wave" height={10} width="40%" />}
            />
            <Skeleton
              sx={{ height: 300 }}
              animation="wave"
              variant="rectangular"
            />
            <CardContent>
              <Fragment>
                <Skeleton
                  animation="wave"
                  height={10}
                  style={{ marginBottom: 6 }}
                />
                <Skeleton
                  animation="wave"
                  height={10}
                  width="60%"
                  style={{ marginBottom: 40 }}
                />
                <Skeleton animation="wave" height={20} width="100%" />
              </Fragment>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
