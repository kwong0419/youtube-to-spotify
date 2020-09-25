import React, { useState, useEffect } from "react";
import { Typography, DialogTitle, Dialog } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const SigninDialog = ({ setOpen, open }) => {
  const classes = useStyles();
  //   const [html, setHtml] = useState();

  const handleClose = () => {
    setOpen(false);
  };

  //   const getIframe = async () => {
  //     await axios.get(`https://www.w3schools.com`).then((res) => {
  //       setHtml(res.data);
  //     });
  //   };

  //   useEffect(() => {
  //     getIframe();
  //   }, []);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      style={{ textAlign: "center" }}
    >
      <DialogTitle
        style={{ width: 200, textAlign: "center", Color: "black" }}
        id="simple-dialog-title"
      >
        Testing
        <iframe
          src="https://www.w3schools.com&output=embed"
          title="sign in"
        ></iframe>
      </DialogTitle>
    </Dialog>
  );
};

export default SigninDialog;
