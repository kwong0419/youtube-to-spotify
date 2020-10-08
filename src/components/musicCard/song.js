import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 151,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export default function Song({
  title,
  artist,
  albumImg,
  preview_url,
  explicit,
}) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h2" variant="subtitle1">
            {title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {artist}
          </Typography>

          {explicit === "true" ? (
            <Typography variant="subtitle2" color="textSecondary">
              E
            </Typography>
          ) : null}
        </CardContent>
        <div className={classes.controls}>
          <audio controls="true" name="media">
            <source src={preview_url} type="audio/mpeg" />
          </audio>
        </div>
      </div>
      <CardMedia
        className={classes.cover}
        image={albumImg}
        title="Live from space album cover"
      />
    </Card>
  );
}
